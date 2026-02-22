export interface Profile {
  id: string;
  name: string;
  subtitle: string;
  role_title: string;
  headline: string;
  headline_accent: string;
  description: string;
  job_title: string;
  location: string;
  experience: string;
  specialization: string;
  email: string;
  linkedin_url: string;
  twitter_url: string;
  github_url: string;
  methodology_quote: string;
  methodology_description: string;
  cta_headline: string;
  cta_accent: string;
  avatar_url: string;
  hero_image_url: string;
}

export interface Project {
  id: string;
  slug: string;
  category: string;
  number: string;
  title: string;
  description: string;
  long_description: string;
  stat_label_1: string;
  stat_value_1: string;
  stat_label_2: string;
  stat_value_2: string;
  bg_color: string;
  display_order: number;
  thumbnail_url: string;
  images: string[];
}

export interface Skill {
  id: string;
  name: string;
  display_order: number;
}

export interface MethodologyItem {
  id: string;
  number: string;
  title: string;
  items: string[];
  display_order: number;
}

export type SectionType = 'text_block' | 'full_image' | 'image_gallery' | 'two_column' | 'quote' | 'divider';

export interface SectionSettings {
  alignment?: 'left' | 'center' | 'right';
  bg_color?: string;
  columns?: number;
  image_position?: 'left' | 'right';
  spacing?: 'small' | 'medium' | 'large';
}

export interface PortfolioSection {
  id: string;
  section_type: SectionType;
  title: string | null;
  content: string | null;
  image_url: string | null;
  images: string[];
  display_order: number;
  parent: string;
  settings: SectionSettings;
  created_at?: string;
  updated_at?: string;
}
