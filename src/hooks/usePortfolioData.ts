import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile, Project, Skill, MethodologyItem, PortfolioSection } from '../types/portfolio';

interface PortfolioData {
  profile: Profile | null;
  projects: Project[];
  skills: Skill[];
  methodology: MethodologyItem[];
  sections: PortfolioSection[];
  loading: boolean;
  error: string | null;
}

export function usePortfolioData(): PortfolioData {
  const [data, setData] = useState<PortfolioData>({
    profile: null,
    projects: [],
    skills: [],
    methodology: [],
    sections: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchAll() {
      try {
        const [profileRes, projectsRes, skillsRes, methodologyRes, sectionsRes] = await Promise.all([
          supabase.from('profile').select('*').maybeSingle(),
          supabase.from('projects').select('*').order('display_order'),
          supabase.from('skills').select('*').order('display_order'),
          supabase.from('methodology_items').select('*').order('display_order'),
          supabase.from('portfolio_sections').select('*').eq('parent', 'home').order('display_order'),
        ]);

        if (profileRes.error) throw profileRes.error;
        if (projectsRes.error) throw projectsRes.error;
        if (skillsRes.error) throw skillsRes.error;
        if (methodologyRes.error) throw methodologyRes.error;
        if (sectionsRes.error) throw sectionsRes.error;

        setData({
          profile: profileRes.data,
          projects: projectsRes.data || [],
          skills: skillsRes.data || [],
          methodology: methodologyRes.data || [],
          sections: (sectionsRes.data as PortfolioSection[]) || [],
          loading: false,
          error: null,
        });
      } catch (err) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to load data',
        }));
      }
    }

    fetchAll();
  }, []);

  return data;
}
