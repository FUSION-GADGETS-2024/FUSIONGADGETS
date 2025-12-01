-- Drop policies that depend on session_id
DROP POLICY IF EXISTS "Users can view their own cart" ON carts;
DROP POLICY IF EXISTS "Users can insert their own cart" ON carts;
DROP POLICY IF EXISTS "Users can update their own cart" ON carts;
DROP POLICY IF EXISTS "Users can delete their own cart" ON carts;
DROP POLICY IF EXISTS "Users can view their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can insert their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can update their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON cart_items;

-- Remove session_id from carts table
ALTER TABLE carts DROP CONSTRAINT IF EXISTS user_or_session;
ALTER TABLE carts DROP COLUMN IF EXISTS session_id;
ALTER TABLE carts ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE carts ADD CONSTRAINT carts_user_id_unique UNIQUE (user_id);

-- Recreate cart policies (user_id only)
CREATE POLICY "Users can view their own cart" ON carts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart" ON carts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart" ON carts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart" ON carts
  FOR DELETE USING (auth.uid() = user_id);

-- Recreate cart_items policies
CREATE POLICY "Users can view their own cart items" ON cart_items
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own cart items" ON cart_items
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own cart items" ON cart_items
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own cart items" ON cart_items
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()
  ));
