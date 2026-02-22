import { useInView } from '../hooks/useInView';
import type { Profile, MethodologyItem } from '../types/portfolio';

interface MethodologyProps {
  profile: Profile;
  items: MethodologyItem[];
}

export default function Methodology({ profile, items }: MethodologyProps) {
  const { ref: quoteRef, isVisible: quoteVisible } = useInView();
  const { ref: cardsRef, isVisible: cardsVisible } = useInView();

  const quoteParts = profile.methodology_quote.split('movie');

  return (
    <section id="methodology" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          ref={quoteRef}
          className={`mb-16 lg:mb-24 transition-all duration-700 ${
            quoteVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-mint-500 font-medium mb-6">
            Methodology
          </p>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal max-w-xl leading-tight">
              "{quoteParts[0]}
              <span className="font-serif italic text-mint-500">movie</span>
              {quoteParts[1] || '."'}
            </h2>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-xs lg:pt-2">
              {profile.methodology_description}
            </p>
          </div>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {items.map((item, i) => (
            <div
              key={item.id}
              className={`bg-mint-100/60 rounded-2xl p-6 lg:p-8 transition-all duration-700 ${
                cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: cardsVisible ? `${i * 150}ms` : '0ms' }}
            >
              <div className="w-10 h-10 rounded-full bg-mint-400 text-white flex items-center justify-center text-xs font-semibold mb-5">
                {item.number}
              </div>

              <h3 className="text-lg font-semibold text-charcoal mb-4">
                {item.title}
              </h3>

              <ul className="space-y-2">
                {item.items.map((point, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-neutral-500">
                    <span className="w-1 h-1 rounded-full bg-neutral-400 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
