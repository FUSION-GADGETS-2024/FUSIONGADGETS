-- Disable all auth triggers - handle everything manually
DROP TRIGGER IF EXISTS on_user_created_wishlist ON auth.users;
DROP FUNCTION IF EXISTS create_wishlist_for_user();