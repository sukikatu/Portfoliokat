/*
  # Add Portfolio Sections (Page Builder) and Image Fields

  1. New Tables
    - `portfolio_sections`
      - `id` (uuid, primary key)
      - `section_type` (text) - type of block: text_block, full_image, image_gallery, two_column, quote, divider
      - `title` (text, nullable) - optional block title
      - `content` (text, nullable) - text content for the block
      - `image_url` (text, nullable) - single image URL
      - `images` (text array, nullable) - multiple image URLs for galleries
      - `display_order` (integer) - position in the page
      - `parent` (text) - which page/project this belongs to (e.g., 'home' or a project slug)
      - `settings` (jsonb) - layout options like alignment, background color, columns
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Modified Tables
    - `profile` - added `avatar_url` and `hero_image_url` columns
    - `projects` - added `thumbnail_url` and `images` columns

  3. Security
    - Enable RLS on `portfolio_sections`
    - Public read access for portfolio_sections (SELECT for anon and authenticated)
    - Authenticated-only write access for portfolio_sections (INSERT, UPDATE, DELETE)

  4. Storage
    - Create `portfolio-assets` bucket for image uploads
    - Public read access policy on the bucket
    - Authenticated write/delete policies on the bucket
*/

-- Create portfolio_sections table
CREATE TABLE IF NOT EXISTS portfolio_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_type text NOT NULL DEFAULT 'text_block',
  title text,
  content text,
  image_url text,
  images text[] DEFAULT '{}',
  display_order integer NOT NULL DEFAULT 0,
  parent text NOT NULL DEFAULT 'home',
  settings jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE portfolio_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view portfolio sections"
  ON portfolio_sections FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can create portfolio sections"
  ON portfolio_sections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update portfolio sections"
  ON portfolio_sections FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete portfolio sections"
  ON portfolio_sections FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Add image columns to profile
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profile' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE profile ADD COLUMN avatar_url text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profile' AND column_name = 'hero_image_url'
  ) THEN
    ALTER TABLE profile ADD COLUMN hero_image_url text DEFAULT '';
  END IF;
END $$;

-- Add image columns to projects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'thumbnail_url'
  ) THEN
    ALTER TABLE projects ADD COLUMN thumbnail_url text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'images'
  ) THEN
    ALTER TABLE projects ADD COLUMN images text[] DEFAULT '{}';
  END IF;
END $$;

-- Create storage bucket for portfolio assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read
CREATE POLICY "Public read access on portfolio-assets"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'portfolio-assets');

-- Storage policies: authenticated upload
CREATE POLICY "Authenticated users can upload portfolio assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-assets' AND auth.uid() IS NOT NULL);

-- Storage policies: authenticated update
CREATE POLICY "Authenticated users can update portfolio assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio-assets' AND auth.uid() IS NOT NULL)
  WITH CHECK (bucket_id = 'portfolio-assets' AND auth.uid() IS NOT NULL);

-- Storage policies: authenticated delete
CREATE POLICY "Authenticated users can delete portfolio assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-assets' AND auth.uid() IS NOT NULL);
