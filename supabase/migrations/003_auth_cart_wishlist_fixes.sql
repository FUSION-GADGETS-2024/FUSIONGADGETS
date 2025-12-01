-- ============================================================================
-- Migration: Auth, Cart & Wishlist System Fixes
-- Description: Fixes critical loopholes in authentication, cart, and wishlist
-- ============================================================================

-- 1. AUTO-CREATE PROFILE ON USER SIGNUP
-- ============================================================================
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_profile_for_user();

-- 2. AUTO-CREATE WISHLIST ON USER SIGNUP
-- ============================================================================
CREATE OR REPLACE FUNCTION create_wishlist_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO wishlists (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_user_created_wishlist ON auth.users;
CREATE TRIGGER on_user_created_wishlist
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_wishlist_for_user();

-- 3. ADD UNIQUE CONSTRAINT TO CART (one cart per user/session)
-- ============================================================================
CREATE UNIQUE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_carts_session_id ON carts(session_id) WHERE session_id IS NOT NULL;

-- 4. ADD UNIQUE CONSTRAINT TO CART ITEMS (one product per cart)
-- ============================================================================
CREATE UNIQUE INDEX IF NOT EXISTS idx_cart_items_cart_product ON cart_items(cart_id, product_id);

-- 5. CREATE HELPER FUNCTIONS FOR CART OPERATIONS
-- ============================================================================

-- Get or create cart for user/session
CREATE OR REPLACE FUNCTION get_or_create_cart(p_user_id UUID, p_session_id TEXT)
RETURNS UUID AS $$
DECLARE
  v_cart_id UUID;
BEGIN
  -- Try to find existing cart
  IF p_user_id IS NOT NULL THEN
    SELECT id INTO v_cart_id FROM carts WHERE user_id = p_user_id LIMIT 1;
  ELSIF p_session_id IS NOT NULL THEN
    SELECT id INTO v_cart_id FROM carts WHERE session_id = p_session_id LIMIT 1;
  END IF;

  -- Create new cart if not found
  IF v_cart_id IS NULL THEN
    INSERT INTO carts (user_id, session_id)
    VALUES (p_user_id, p_session_id)
    RETURNING id INTO v_cart_id;
  END IF;

  RETURN v_cart_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Merge guest cart into user cart on login
CREATE OR REPLACE FUNCTION merge_guest_cart_to_user(p_user_id UUID, p_session_id TEXT)
RETURNS VOID AS $$
DECLARE
  v_user_cart_id UUID;
  v_guest_cart_id UUID;
  v_item RECORD;
BEGIN
  -- Get or create user cart
  v_user_cart_id := get_or_create_cart(p_user_id, NULL);
  
  -- Get guest cart
  SELECT id INTO v_guest_cart_id FROM carts WHERE session_id = p_session_id LIMIT 1;
  
  -- If guest cart exists, merge items
  IF v_guest_cart_id IS NOT NULL THEN
    FOR v_item IN SELECT * FROM cart_items WHERE cart_id = v_guest_cart_id LOOP
      -- Insert or update cart item
      INSERT INTO cart_items (cart_id, product_id, quantity, selected_variant)
      VALUES (v_user_cart_id, v_item.product_id, v_item.quantity, v_item.selected_variant)
      ON CONFLICT (cart_id, product_id) 
      DO UPDATE SET 
        quantity = cart_items.quantity + EXCLUDED.quantity,
        updated_at = NOW();
    END LOOP;
    
    -- Delete guest cart
    DELETE FROM carts WHERE id = v_guest_cart_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. CREATE HELPER FUNCTIONS FOR WISHLIST OPERATIONS
-- ============================================================================

-- Get or create wishlist for user
CREATE OR REPLACE FUNCTION get_or_create_wishlist(p_user_id UUID)
RETURNS UUID AS $$
DECLARE
  v_wishlist_id UUID;
BEGIN
  SELECT id INTO v_wishlist_id FROM wishlists WHERE user_id = p_user_id;
  
  IF v_wishlist_id IS NULL THEN
    INSERT INTO wishlists (user_id)
    VALUES (p_user_id)
    RETURNING id INTO v_wishlist_id;
  END IF;
  
  RETURN v_wishlist_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. CREATE VIEWS FOR EASIER QUERYING
-- ============================================================================

-- Cart items with product details
CREATE OR REPLACE VIEW cart_items_with_products AS
SELECT 
  ci.id,
  ci.cart_id,
  ci.product_id,
  ci.quantity,
  ci.selected_variant,
  ci.added_at,
  ci.updated_at,
  p.name as product_name,
  p.price as product_price,
  p.mrp_price as product_mrp,
  p.discount as product_discount,
  p.in_stock as product_in_stock,
  p.slug as product_slug,
  (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as product_image,
  b.name as brand_name,
  (ci.quantity * p.price) as subtotal
FROM cart_items ci
JOIN products p ON ci.product_id = p.id
LEFT JOIN brands b ON p.brand_id = b.id;

-- Wishlist items with product details
CREATE OR REPLACE VIEW wishlist_items_with_products AS
SELECT 
  wi.id,
  wi.wishlist_id,
  wi.product_id,
  wi.added_at,
  p.name as product_name,
  p.price as product_price,
  p.mrp_price as product_mrp,
  p.discount as product_discount,
  p.rating as product_rating,
  p.in_stock as product_in_stock,
  p.slug as product_slug,
  (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as product_image,
  b.name as brand_name
FROM wishlist_items wi
JOIN products p ON wi.product_id = p.id
LEFT JOIN brands b ON p.brand_id = b.id;

-- 8. ADD INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_carts_user_session ON carts(user_id, session_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_updated_at ON cart_items(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_added_at ON wishlist_items(added_at DESC);

-- 9. GRANT PERMISSIONS (if using RLS)
-- ============================================================================
-- These will be configured in the RLS policies migration
