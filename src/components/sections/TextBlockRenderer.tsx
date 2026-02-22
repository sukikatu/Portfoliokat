import { useInView } from '../../hooks/useInView';
import type { PortfolioSection } from '../../types/portfolio';

interface Props {
  section: PortfolioSection;
}

export default function TextBlockRenderer({ section }: Props) {
  const { ref, isVisible } = useInView();
  const align = section.settings.alignment || 'left';

  const alignClass = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  }[align];

  return (
    <div
      ref={ref}
      className={`max-w-4xl px-6 lg:px-8 py-12 lg:py-20 ${alignClass} transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ backgroundColor: section.settings.bg_color || 'transparent' }}
    >
      <div className="max-w-7xl mx-auto">
        {section.title && (
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mb-6 leading-tight">
            {section.title}
          </h2>
        )}
        {section.content && (
          <div className="text-neutral-600 leading-relaxed text-base sm:text-lg whitespace-pre-line">
            {section.content}
          </div>
        )}
      </div>
    </div>
  );
}
