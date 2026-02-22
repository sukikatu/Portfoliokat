import { useInView } from '../../hooks/useInView';
import type { PortfolioSection } from '../../types/portfolio';

interface Props {
  section: PortfolioSection;
}

export default function QuoteRenderer({ section }: Props) {
  const { ref, isVisible } = useInView();

  return (
    <div
      ref={ref}
      className={`py-16 lg:py-24 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ backgroundColor: section.settings.bg_color || 'transparent' }}
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <div className="text-5xl lg:text-6xl text-mint-400 font-serif leading-none mb-4">"</div>
        {section.content && (
          <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal leading-tight mb-6">
            {section.content}
          </blockquote>
        )}
        {section.title && (
          <cite className="text-sm text-neutral-500 not-italic uppercase tracking-[0.15em]">
            {section.title}
          </cite>
        )}
      </div>
    </div>
  );
}
