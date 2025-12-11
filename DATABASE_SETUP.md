# ReFURRM Ai Studio - Database Setup Instructions

## Auto-Create User Profiles Trigger

This SQL code creates a database trigger that automatically creates a `user_profiles` record when a new user signs up.

### Instructions:
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Create a new query
4. Copy and paste the code below
5. Click "Run" to execute

---

## SQL Code

```sql
-- Create the function that will be triggered
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id,
    email,
    trial_start_date,
    trial_end_date,
    subscription_status,
    onboarding_completed
  )
  VALUES (
    NEW.id,
    NEW.email,
    NOW(),
    NOW() + INTERVAL '14 days',
    'trial',
    false
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

## What This Does:

1. **Creates a function** (`handle_new_user`) that:
   - Inserts a new row in `user_profiles` table
   - Sets the user's `id` and `email` from the auth.users table
   - Sets `trial_start_date` to the current timestamp
   - Sets `trial_end_date` to 14 days from now
   - Sets `subscription_status` to 'trial'
   - Sets `onboarding_completed` to false

2. **Creates a trigger** that:
   - Fires AFTER a new user is inserted into `auth.users`
   - Automatically calls the `handle_new_user()` function

---

## Testing:

After running this SQL, test by:
1. Creating a new user account via the signup page
2. Check the `user_profiles` table in Supabase
3. Verify the new profile was created with correct trial dates

---

## Contact Information

Support: support@refurrm.app
Phone: 479.446.6201

---

## Additional Database Tables

### Newsletter Subscribers Table
```sql
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (subscribe)
CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Policy: Admins can view all
CREATE POLICY "Admins can view all" ON newsletter_subscribers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Email Settings Table
```sql
CREATE TABLE email_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  from_name TEXT,
  enable_welcome_email BOOLEAN DEFAULT true,
  enable_order_confirmation BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE email_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can manage their own settings
CREATE POLICY "Users manage own email settings" ON email_settings
  FOR ALL USING (auth.uid() = user_id);
```

### Review Photos Storage Bucket
```sql
-- Create storage bucket for review photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('review-photos', 'review-photos', true);

-- Policy: Authenticated users can upload
CREATE POLICY "Authenticated users can upload review photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'review-photos');

-- Policy: Anyone can view
CREATE POLICY "Anyone can view review photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'review-photos');
```


### Payment Gateways Table
```sql
CREATE TABLE IF NOT EXISTS payment_gateways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- 'stripe' or 'paypal'
  test_mode BOOLEAN DEFAULT true,
  stripe_publishable_key TEXT,
  stripe_secret_key TEXT,
  stripe_webhook_secret TEXT,
  paypal_client_id TEXT,
  paypal_secret TEXT,
  paypal_webhook_id TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Enable RLS
ALTER TABLE payment_gateways ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own payment gateways
CREATE POLICY "Users can view own payment gateways"
  ON payment_gateways FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own payment gateways
CREATE POLICY "Users can insert own payment gateways"
  ON payment_gateways FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own payment gateways
CREATE POLICY "Users can update own payment gateways"
  ON payment_gateways FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own payment gateways
CREATE POLICY "Users can delete own payment gateways"
  ON payment_gateways FOR DELETE
  USING (auth.uid() = user_id);
```
```

### Orders and Inventory Tables
```sql
-- Add inventory and domain fields to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS track_inventory BOOLEAN DEFAULT true;

-- Add logo and domain fields to user_profiles table
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS store_logo_url TEXT,
ADD COLUMN IF NOT EXISTS custom_domain TEXT,
ADD COLUMN IF NOT EXISTS domain_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS theme_primary_color TEXT DEFAULT '#3b82f6',
ADD COLUMN IF NOT EXISTS theme_secondary_color TEXT DEFAULT '#8b5cf6';

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  payment_status TEXT DEFAULT 'pending',
  payment_provider TEXT,
  payment_intent_id TEXT,
  fulfillment_status TEXT DEFAULT 'pending',
  tracking_number TEXT,
  shipping_address JSONB,
  billing_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create inventory_history table
CREATE TABLE IF NOT EXISTS inventory_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  change_type TEXT NOT NULL,
  quantity_change INTEGER NOT NULL,
  previous_quantity INTEGER,
  new_quantity INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_history ENABLE ROW LEVEL SECURITY;

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

CREATE POLICY "Users can insert own order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

-- Inventory history policies
CREATE POLICY "Users can view own inventory history" ON inventory_history
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE products.id = inventory_history.product_id AND products.user_id = auth.uid())
  );

CREATE POLICY "Users can insert own inventory history" ON inventory_history
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM products WHERE products.id = inventory_history.product_id AND products.user_id = auth.uid())
  );
```

---

## Contact Information

Support: support@refurrm.app
Phone: 479.446.6201
