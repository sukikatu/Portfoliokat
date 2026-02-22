import { useInView } from '../../hooks/useInView';
import type { PortfolioSection } from '../../types/portfolio';

interface Props {
  section: PortfolioSection;
}

export default function ImageBlockRenderer({ section }: Props) {
  const { ref, isVisible } = useInView();

  if (!section.image_url) return null;

  return (
    <div
      ref={ref}
      className={`py-8 lg:py-16 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ backgroundColor: section.settings.bg_color || 'transparent' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="rounded-2xl lg:rounded-3xl overflow-hidden">
          <img
            src={section.image_url}
            alt={section.title || ''}
            className="w-full h-auto object-cover"
          />
        </div>
        {section.title && (
          <p className="text-sm text-neutral-500 mt-4 text-center">{section.title}</p>
        )}
      </div>
    </div>
  );
}
