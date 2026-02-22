import { useInView } from '../../hooks/useInView';
import type { PortfolioSection } from '../../types/portfolio';

interface Props {
  section: PortfolioSection;
}

export default function TwoColumnRenderer({ section }: Props) {
  const { ref, isVisible } = useInView();
  const imageRight = (section.settings.image_position || 'right') === 'right';

  return (
    <div
      ref={ref}
      className={`py-12 lg:py-20 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ backgroundColor: section.settings.bg_color || 'transparent' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`flex flex-col ${imageRight ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}>
          <div className="flex-1">
            {section.title && (
              <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-6 leading-tight">
                {section.title}
              </h2>
            )}
            {section.content && (
              <p className="text-neutral-600 leading-relaxed text-base sm:text-lg whitespace-pre-line">
                {section.content}
              </p>
            )}
          </div>
          {section.image_url && (
            <div className="flex-1">
              <div className="rounded-2xl lg:rounded-3xl overflow-hidden">
                <img
                  src={section.image_url}
                  alt={section.title || ''}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
