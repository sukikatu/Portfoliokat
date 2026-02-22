import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SectionRenderer from '../components/sections/SectionRenderer';
import type { Project, PortfolioSection } from '../types/portfolio';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [sections, setSections] = useState<PortfolioSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [projectRes, sectionsRes] = await Promise.all([
        supabase.from('projects').select('*').eq('slug', slug).maybeSingle(),
        supabase.from('portfolio_sections').select('*').eq('parent', slug).order('display_order'),
      ]);
      setProject(projectRes.data);
      setSections((sectionsRes.data as PortfolioSection[]) || []);
      setLoading(false);
      setTimeout(() => setLoaded(true), 100);
    }
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-8 h-8 border-2 border-charcoal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream gap-4">
        <h1 className="text-2xl font-bold text-charcoal">Project not found</h1>
        <Link
          to="/"
          className="text-sm text-neutral-500 hover:text-charcoal transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to portfolio
        </Link>
      </div>
    );
  }

  const paragraphs = project.long_description.split('. ').reduce<string[]>((acc, sentence, i) => {
    const chunkIndex = Math.floor(i / 3);
    acc[chunkIndex] = (acc[chunkIndex] || '') + sentence + '. ';
    return acc;
  }, []);

  const hasImages = project.images && project.images.length > 0;
  const hasThumbnail = !!project.thumbnail_url;

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        <div
          className={`transition-all duration-700 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-charcoal transition-colors duration-300 mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to portfolio
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          <div
            className={`flex-1 transition-all duration-700 delay-150 ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-3">
              {project.number} / {project.category}
            </p>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-charcoal mb-6 leading-tight">
              {project.title}
            </h1>

            <p className="text-lg text-neutral-600 leading-relaxed mb-8">
              {project.description}
            </p>

            <div className="flex items-center gap-8 mb-12 pb-12 border-b border-neutral-200">
              <div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-charcoal text-charcoal" />
                  <span className="text-3xl font-bold text-charcoal">{project.stat_value_1}</span>
                </div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">
                  {project.stat_label_1}
                </span>
              </div>
              <div className="w-px h-12 bg-neutral-200" />
              <div>
                <span className="text-3xl font-bold text-charcoal">{project.stat_value_2}</span>
                <br />
                <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">
                  {project.stat_label_2}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-medium">
                Case Study
              </h3>
              {paragraphs.map((p, i) => (
                <p key={i} className="text-neutral-600 leading-relaxed">
                  {p.trim()}
                </p>
              ))}
            </div>
          </div>

          <div
            className={`lg:w-[400px] shrink-0 lg:sticky lg:top-28 lg:self-start transition-all duration-700 delay-300 ${
              loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            {hasThumbnail ? (
              <div className="rounded-3xl overflow-hidden">
                <img src={project.thumbnail_url} alt={project.title} className="w-full h-auto object-cover" />
              </div>
            ) : (
              <div
                className="rounded-3xl p-10 lg:p-14 flex items-center justify-center min-h-[300px]"
                style={{ backgroundColor: project.bg_color }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/30 mx-auto mb-3" />
                  <p className="text-[10px] uppercase tracking-wider text-charcoal/50">Project Preview</p>
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <span className="inline-block bg-neutral-100 text-neutral-500 text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-full">
                {project.category}
              </span>
              <span className="inline-block bg-neutral-100 text-neutral-500 text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-full flex items-center gap-1">
                <ExternalLink className="w-2.5 h-2.5" />
                Live Project
              </span>
            </div>
          </div>
        </div>

        {hasImages && (
          <div className="mt-16 lg:mt-24">
            <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-medium mb-8">
              Project Gallery
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              {project.images.map((url, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <img src={url} alt="" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {sections.length > 0 && (
        <div className="bg-cream">
          <SectionRenderer sections={sections} />
        </div>
      )}
    </div>
  );
}
