### Community Posts Table
```sql
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can insert
CREATE POLICY "Authenticated users can insert" ON community_posts
  FOR INSERT TO authenticated WITH CHECK (true);

-- Policy: Anyone can view
CREATE POLICY "Anyone can view" ON community_posts
  FOR SELECT USING (true);

-- Policy: Users can delete their own posts
CREATE POLICY "Users can delete their own posts" ON community_posts
  FOR DELETE USING (auth.uid() = user_id);

-- Policy: Users can update their own posts
CREATE POLICY "Users can update their own posts" ON community_posts
  FOR UPDATE USING (auth.uid() = user_id);
```