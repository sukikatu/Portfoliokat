/*
  # Create Portfolio Schema

  1. New Tables
    - `profile` - Personal info, headline, contact details, methodology quote, CTA text
    - `projects` - Case study entries with stats and colors
    - `skills` - Marquee scrolling skill names
    - `methodology_items` - Three methodology pillars with bullet points

  2. Security
    - Enable RLS on all tables
    - Public read access for portfolio display
    - Authenticated write access for admin management
*/

CREATE TABLE IF NOT EXISTS profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  role_title text NOT NULL DEFAULT '',
  headline text NOT NULL DEFAULT '',
  headline_accent text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  job_title text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  experience text NOT NULL DEFAULT '',
  specialization text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  linkedin_url text NOT NULL DEFAULT '',
  twitter_url text NOT NULL DEFAULT '',
  github_url text NOT NULL DEFAULT '',
  methodology_quote text NOT NULL DEFAULT '',
  methodology_description text NOT NULL DEFAULT '',
  cta_headline text NOT NULL DEFAULT '',
  cta_accent text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read profile"
  ON profile FOR SELECT
  TO anon, authenticated
  USING (id IS NOT NULL);

CREATE POLICY "Authenticated users can update profile"
  ON profile FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert profile"
  ON profile FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  number text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  long_description text NOT NULL DEFAULT '',
  stat_label_1 text NOT NULL DEFAULT '',
  stat_value_1 text NOT NULL DEFAULT '',
  stat_label_2 text NOT NULL DEFAULT '',
  stat_value_2 text NOT NULL DEFAULT '',
  bg_color text NOT NULL DEFAULT '#e8f5e9',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read projects"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (id IS NOT NULL);

CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read skills"
  ON skills FOR SELECT
  TO anon, authenticated
  USING (id IS NOT NULL);

CREATE POLICY "Authenticated users can insert skills"
  ON skills FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update skills"
  ON skills FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete skills"
  ON skills FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE TABLE IF NOT EXISTS methodology_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  items text[] NOT NULL DEFAULT '{}',
  display_order integer NOT NULL DEFAULT 0
);

ALTER TABLE methodology_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read methodology_items"
  ON methodology_items FOR SELECT
  TO anon, authenticated
  USING (id IS NOT NULL);

CREATE POLICY "Authenticated users can insert methodology_items"
  ON methodology_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update methodology_items"
  ON methodology_items FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete methodology_items"
  ON methodology_items FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);
