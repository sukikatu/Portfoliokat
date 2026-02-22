import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import PhoneMockup from './PhoneMockup';
import type { Project } from '../types/portfolio';

interface CaseStudyCardProps {
  project: Project;
  index: number;
}

export default function CaseStudyCard({ project, index }: CaseStudyCardProps) {
  const { ref, isVisible } = useInView({ threshold: 0.2 });
  const isEven = index % 2 === 0;
  const hasThumbnail = !!project.thumbnail_url;

  return (
    <div
      ref={ref}
      className="py-8 lg:py-16"
      style={{ backgroundColor: project.bg_color }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}
        >
          <div
            className={`flex-1 flex justify-center ${
              isVisible ? 'opacity-100 translate-x-0' : isEven ? 'opacity-0 -translate-x-12' : 'opacity-0 translate-x-12'
            } transition-all duration-[800ms] ease-out`}
          >
            {hasThumbnail ? (
              <div className="rounded-2xl lg:rounded-3xl overflow-hidden max-w-sm w-full shadow-lg">
                <img src={project.thumbnail_url} alt={project.title} className="w-full h-auto object-cover" />
              </div>
            ) : (
              <PhoneMockup variant={index === 0 ? 'dark' : 'light'} />
            )}
          </div>

          <div
            className={`flex-1 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } transition-all duration-[800ms] delay-200 ease-out`}
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-3">
              {project.number} / {project.category}
            </p>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal mb-4 leading-tight">
              {project.title}
            </h2>

            <p className="text-neutral-600 text-sm leading-relaxed mb-8 max-w-md">
              {project.description}
            </p>

            <div className="flex items-center gap-8 mb-8">
              <div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-charcoal text-charcoal" />
                  <span className="text-2xl font-bold text-charcoal">{project.stat_value_1}</span>
                </div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">
                  {project.stat_label_1}
                </span>
              </div>
              <div>
                <span className="text-2xl font-bold text-charcoal">{project.stat_value_2}</span>
                <br />
                <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">
                  {project.stat_label_2}
                </span>
              </div>
            </div>

            <Link
              to={`/project/${project.slug}`}
              className="inline-flex items-center gap-2 bg-charcoal text-white text-xs uppercase tracking-[0.15em] px-6 py-3 rounded-full hover:bg-neutral-700 transition-all duration-300 group hover:scale-105"
            >
              View Case Study
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
