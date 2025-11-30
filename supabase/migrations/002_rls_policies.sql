-- Enable Row Level Security on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Categories: Public read, admin write
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Categories are insertable by authenticated users" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Categories are updatable by authenticated users" ON categories
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Brands: Public read, admin write
CREATE POLICY "Brands are viewable by everyone" ON brands
  FOR SELECT USING (true);

CREATE POLICY "Brands are insertable by authenticated users" ON brands
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Brands are updatable by authenticated users" ON brands
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Products: Public read active products, admin write
CREATE POLICY "Active products are viewable by everyone" ON products
  FOR SELECT USING (status = 'Active' OR auth.role() = 'authenticated');

CREATE POLICY "Products are insertable by authenticated users" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Products are updatable by authenticated users" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Products are deletable by authenticated users" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Product Images: Public read, admin write
CREATE POLICY "Product images are viewable by everyone" ON product_images
  FOR SELECT USING (true);

CREATE POLICY "Product images are insertable by authenticated users" ON product_images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Product images are updatable by authenticated users" ON product_images
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Product images are deletable by authenticated users" ON product_images
  FOR DELETE USING (auth.role() = 'authenticated');

-- Product Specifications: Public read, admin write
CREATE POLICY "Product specifications are viewable by everyone" ON product_specifications
  FOR SELECT USING (true);

CREATE POLICY "Product specifications are insertable by authenticated users" ON product_specifications
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Product specifications are updatable by authenticated users" ON product_specifications
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Product specifications are deletable by authenticated users" ON product_specifications
  FOR DELETE USING (auth.role() = 'authenticated');

-- Product Features: Public read, admin write
CREATE POLICY "Product features are viewable by everyone" ON product_features
  FOR SELECT USING (true);

CREATE POLICY "Product features are insertable by authenticated users" ON product_features
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Product features are updatable by authenticated users" ON product_features
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Product features are deletable by authenticated users" ON product_features
  FOR DELETE USING (auth.role() = 'authenticated');

-- Product Tags: Public read, admin write
CREATE POLICY "Product tags are viewable by everyone" ON product_tags
  FOR SELECT USING (true);

CREATE POLICY "Product tags are insertable by authenticated users" ON product_tags
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Product tags are updatable by authenticated users" ON product_tags
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Product tags are deletable by authenticated users" ON product_tags
  FOR DELETE USING (auth.role() = 'authenticated');

-- Profiles: Users can read and update their own profile
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Addresses: Users can manage their own addresses
CREATE POLICY "Users can view their own addresses" ON addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses" ON addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses" ON addresses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses" ON addresses
  FOR DELETE USING (auth.uid() = user_id);

-- Carts: Users can manage their own cart
CREATE POLICY "Users can view their own cart" ON carts
  FOR SELECT USING (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "Users can insert their own cart" ON carts
  FOR INSERT WITH CHECK (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "Users can update their own cart" ON carts
  FOR UPDATE USING (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "Users can delete their own cart" ON carts
  FOR DELETE USING (auth.uid() = user_id OR session_id IS NOT NULL);

-- Cart Items: Users can manage their own cart items
CREATE POLICY "Users can view their own cart items" ON cart_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE carts.id = cart_items.cart_id 
      AND (carts.user_id = auth.uid() OR carts.session_id IS NOT NULL)
    )
  );

CREATE POLICY "Users can insert their own cart items" ON cart_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE carts.id = cart_items.cart_id 
      AND (carts.user_id = auth.uid() OR carts.session_id IS NOT NULL)
    )
  );

CREATE POLICY "Users can update their own cart items" ON cart_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE carts.id = cart_items.cart_id 
      AND (carts.user_id = auth.uid() OR carts.session_id IS NOT NULL)
    )
  );

CREATE POLICY "Users can delete their own cart items" ON cart_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE carts.id = cart_items.cart_id 
      AND (carts.user_id = auth.uid() OR carts.session_id IS NOT NULL)
    )
  );

-- Wishlists: Users can manage their own wishlist
CREATE POLICY "Users can view their own wishlist" ON wishlists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wishlist" ON wishlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wishlist" ON wishlists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishlist" ON wishlists
  FOR DELETE USING (auth.uid() = user_id);

-- Wishlist Items: Users can manage their own wishlist items
CREATE POLICY "Users can view their own wishlist items" ON wishlist_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM wishlists 
      WHERE wishlists.id = wishlist_items.wishlist_id 
      AND wishlists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own wishlist items" ON wishlist_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM wishlists 
      WHERE wishlists.id = wishlist_items.wishlist_id 
      AND wishlists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own wishlist items" ON wishlist_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM wishlists 
      WHERE wishlists.id = wishlist_items.wishlist_id 
      AND wishlists.user_id = auth.uid()
    )
  );

-- Orders: Users can view their own orders
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order Items: Users can view their own order items
CREATE POLICY "Users can view their own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Reviews: Public read, users can manage their own reviews
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
