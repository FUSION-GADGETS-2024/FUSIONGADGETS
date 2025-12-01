-- Enable wishlist auto-creation on signup
CREATE OR REPLACE FUNCTION create_wishlist_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO wishlists (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_user_created_wishlist
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_wishlist_for_user();