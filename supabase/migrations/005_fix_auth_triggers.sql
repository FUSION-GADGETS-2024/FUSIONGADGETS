-- Drop old cart-related functions that use session_id
DROP FUNCTION IF EXISTS get_or_create_cart(UUID, TEXT);
DROP FUNCTION IF EXISTS merge_guest_cart_to_user(UUID, TEXT);

-- Drop old cart indexes that reference session_id
DROP INDEX IF EXISTS idx_carts_session_id;
DROP INDEX IF EXISTS idx_carts_user_session;

-- Create function to auto-create cart on user signup
CREATE OR REPLACE FUNCTION create_cart_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO carts (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate trigger for cart creation
DROP TRIGGER IF EXISTS on_user_created_cart ON auth.users;
CREATE TRIGGER on_user_created_cart
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_cart_for_user();
