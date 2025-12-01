-- Disable all auth triggers temporarily to test signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_user_created_wishlist ON auth.users;
DROP FUNCTION IF EXISTS create_profile_for_user();
DROP FUNCTION IF EXISTS create_wishlist_for_user();