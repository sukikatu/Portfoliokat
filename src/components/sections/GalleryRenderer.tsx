import { useInView } from '../../hooks/useInView';
import type { PortfolioSection } from '../../types/portfolio';

interface Props {
  section: PortfolioSection;
}

export default function GalleryRenderer({ section }: Props) {
  const { ref, isVisible } = useInView();
  const cols = section.settings.columns || 3;

  if (!section.images?.length) return null;

  const gridClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
  }[cols] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div
      ref={ref}
      className={`py-8 lg:py-16 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ backgroundColor: section.settings.bg_color || 'transparent' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {section.title && (
          <h3 className="text-2xl sm:text-3xl font-bold text-charcoal mb-8">{section.title}</h3>
        )}
        <div className={`grid ${gridClass} gap-4 lg:gap-6`}>
          {section.images.map((url, i) => (
            <div
              key={i}
              className="rounded-xl lg:rounded-2xl overflow-hidden aspect-video transition-all duration-500"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <img src={url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
