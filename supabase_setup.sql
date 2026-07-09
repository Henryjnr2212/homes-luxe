-- Supabase Database Setup and Policies for Homes Luxe
-- Copy and paste this script into the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query) and run it.

-- 1. Create listings table
CREATE TABLE IF NOT EXISTS public.listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    region TEXT NOT NULL,
    price TEXT NOT NULL,
    img_url TEXT NOT NULL,
    img_path TEXT,
    beds INTEGER NOT NULL,
    baths NUMERIC NOT NULL,
    sqft TEXT NOT NULL,
    tag TEXT NOT NULL,
    shape TEXT CHECK (shape IN ('arch', 'rounded')) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    images TEXT[] DEFAULT '{}'::text[] NOT NULL,
    image_paths TEXT[] DEFAULT '{}'::text[] NOT NULL
);

-- Alter table to add images and image_paths columns if they don't exist (for existing databases)
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}'::text[] NOT NULL;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS image_paths TEXT[] DEFAULT '{}'::text[] NOT NULL;

-- Migrate existing single image rows to arrays
UPDATE public.listings SET images = ARRAY[img_url] WHERE images = '{}'::text[];
UPDATE public.listings SET image_paths = ARRAY[img_path] WHERE (image_paths = '{}'::text[] OR image_paths IS NULL) AND img_path IS NOT NULL;

-- 2. Create inquiries table
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'Lead' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Alter table to add status column if it doesn't exist (for existing databases)
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Lead' NOT NULL;

-- 3. Enable Row Level Security (RLS) on listings
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to listings
CREATE POLICY "Allow public read access to listings" 
ON public.listings FOR SELECT 
USING (true);

-- Allow full access to listings for both authenticated and anon roles 
-- (needed for admin actions, accommodating both Supabase Auth and hardcoded admin fallback credentials)
CREATE POLICY "Allow full access to listings for admin" 
ON public.listings FOR ALL 
USING (true) 
WITH CHECK (true);

-- 4. Enable Row Level Security on inquiries
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit contact inquiries
CREATE POLICY "Allow public insert to inquiries" 
ON public.inquiries FOR INSERT 
WITH CHECK (true);

-- Allow full access to inquiries for both authenticated and anon roles
CREATE POLICY "Allow full access to inquiries for admin" 
ON public.inquiries FOR ALL 
USING (true) 
WITH CHECK (true);


-- 5. Storage Policies for 'property-images' bucket
-- NOTE: Please go to the Supabase Dashboard -> Storage and create a new public bucket named "property-images" first.
-- Then run the policies below to enable public reading, uploading, and deleting of property photos:

INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow public read access to property-images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'property-images');

CREATE POLICY "Allow public upload to property-images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Allow public delete from property-images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'property-images');
