-- Drop the auto-create cart trigger (causing signup to fail)
DROP TRIGGER IF EXISTS on_user_created_cart ON auth.users;
DROP FUNCTION IF EXISTS create_cart_for_user();

-- Carts will be created on-demand when user adds first item
-- This is more efficient and prevents signup failures
