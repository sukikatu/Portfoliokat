import { useEffect, useState } from 'react';
import { ChevronDown, Star } from 'lucide-react';
import type { Profile } from '../types/portfolio';

interface HeroProps {
  profile: Profile;
}

export default function Hero({ profile }: HeroProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const badges = [
    { label: 'CURRENT ROLE', value: profile.job_title },
    { label: 'LOCATION', value: profile.location },
    { label: 'EXPERIENCE', value: profile.experience },
    { label: 'FOCUS', value: profile.specialization },
  ];

  const hasHeroImage = !!profile.hero_image_url;
  const hasAvatar = !!profile.avatar_url;

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-cream">
      {hasHeroImage ? (
        <div className="absolute inset-0">
          <img src={profile.hero_image_url} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-cream/80 backdrop-blur-sm" />
        </div>
      ) : (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-40 animate-blob"
            style={{ background: 'radial-gradient(circle, #fde8d8 0%, transparent 70%)' }}
          />
          <div
            className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full opacity-30 animate-blob"
            style={{ background: 'radial-gradient(circle, #c8e6c9 0%, transparent 70%)', animationDelay: '2s' }}
          />
          <div
            className="absolute bottom-0 left-1/3 w-[450px] h-[450px] rounded-full opacity-30 animate-blob"
            style={{ background: 'radial-gradient(circle, #fef9e7 0%, transparent 70%)', animationDelay: '4s' }}
          />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16 w-full">
        <div
          className={`transition-all duration-700 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            {hasAvatar && (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              />
            )}
            <p className="text-[10px] uppercase tracking-[0.3em] text-orange-400 font-medium">
              <Star className="w-3 h-3 inline mr-1 -mt-0.5 fill-orange-400 text-orange-400" />
              {profile.role_title}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
          <div
            className={`transition-all duration-700 delay-150 ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold text-charcoal leading-[0.9] tracking-tight">
              {profile.headline}
            </h1>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-serif italic text-charcoal leading-[0.9] mt-1">
              {profile.headline_accent}
              <Star className="inline w-4 h-4 ml-2 -mt-8 fill-orange-400 text-orange-400" />
            </h1>
          </div>

          <div
            className={`max-w-xs transition-all duration-700 delay-300 ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="bg-white/60 backdrop-blur-sm border border-neutral-200/50 rounded-2xl p-5">
              <p className="text-sm text-neutral-600 leading-relaxed">
                {profile.description}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`flex justify-center mb-12 transition-all duration-700 delay-500 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <a href="#work" className="group">
            <ChevronDown className="w-6 h-6 text-neutral-400 transition-transform duration-300 group-hover:translate-y-1" />
          </a>
        </div>

        <div
          className={`flex flex-wrap gap-3 justify-center transition-all duration-700 delay-700 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {badges.map((badge, i) => (
            <div
              key={i}
              className="bg-white/70 backdrop-blur-sm border border-neutral-200/50 rounded-full px-5 py-3 hover:bg-white hover:shadow-sm transition-all duration-300"
            >
              <span className="block text-[9px] uppercase tracking-[0.2em] text-neutral-400 mb-0.5">
                {badge.label}
              </span>
              <span className="text-sm font-medium text-charcoal">{badge.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
