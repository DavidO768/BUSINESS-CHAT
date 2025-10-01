# Supabase Database Setup for Gabstep Business Chat

This document contains the SQL schema needed to set up your Supabase database for the Gabstep Business Chat application.

## Setup Instructions

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Copy and paste the SQL schema below
4. Run the query
5. Copy your project URL and anon key
6. Create a `.env` file in the project root with:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## SQL Schema

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  profile_picture TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  is_blocked BOOLEAN DEFAULT FALSE,
  is_muted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Messages table
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT,
  file_url TEXT,
  file_type TEXT,
  reply_to UUID REFERENCES messages(id) ON DELETE SET NULL,
  edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Chat settings table
CREATE TABLE chat_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  is_chat_muted BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default chat settings
INSERT INTO chat_settings (id, is_chat_muted) VALUES (1, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
  ON profiles FOR SELECT 
  USING (NOT is_blocked);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- RLS Policies for messages
CREATE POLICY "Messages are viewable by authenticated users" 
  ON messages FOR SELECT 
  TO authenticated
  USING (
    recipient_id IS NULL OR 
    recipient_id = auth.uid() OR 
    sender_id = auth.uid()
  );

CREATE POLICY "Authenticated users can insert messages" 
  ON messages FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages" 
  ON messages FOR UPDATE 
  TO authenticated
  USING (auth.uid() = sender_id);

CREATE POLICY "Users can delete their own messages" 
  ON messages FOR DELETE 
  TO authenticated
  USING (auth.uid() = sender_id);

-- RLS Policies for chat_settings
CREATE POLICY "Everyone can view chat settings" 
  ON chat_settings FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can update chat settings" 
  ON chat_settings FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

-- Create storage bucket for chat files
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-files', 'chat-files', TRUE);

-- Storage policies
CREATE POLICY "Anyone can upload files" 
  ON storage.objects FOR INSERT 
  TO authenticated
  WITH CHECK (bucket_id = 'chat-files');

CREATE POLICY "Anyone can view files" 
  ON storage.objects FOR SELECT 
  TO authenticated
  USING (bucket_id = 'chat-files');

CREATE POLICY "Users can delete their own files" 
  ON storage.objects FOR DELETE 
  TO authenticated
  USING (bucket_id = 'chat-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_settings_updated_at BEFORE UPDATE ON chat_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Realtime Subscriptions

The application uses Supabase Realtime for live updates. Make sure to enable Realtime for these tables in your Supabase dashboard:

1. Go to Database → Replication
2. Enable replication for:
   - `profiles`
   - `messages`
   - `chat_settings`

## Authentication

The app uses Supabase Auth with email/password. No additional configuration needed - it's enabled by default.

## Admin Account

To create an admin account:
1. Sign up with username "admin"
2. Enter the passcode: `Gabstep@768`
3. The account will be created with admin privileges

## Notes

- Profile pictures and chat files are stored as base64 in the database for simplicity. For production, consider using Supabase Storage.
- The schema includes proper foreign key relationships and cascading deletes.
- RLS policies ensure data security and proper access control.
- Admins can mute/block users and control chat settings.
