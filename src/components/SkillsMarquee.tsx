import type { Skill } from '../types/portfolio';

interface SkillsMarqueeProps {
  skills: Skill[];
}

const sizes = [
  'text-3xl sm:text-4xl lg:text-5xl font-bold',
  'text-2xl sm:text-3xl lg:text-4xl font-light text-orange-300',
  'text-4xl sm:text-5xl lg:text-6xl font-bold',
  'text-3xl sm:text-4xl lg:text-5xl font-light opacity-60',
  'text-4xl sm:text-5xl lg:text-7xl font-bold',
];

export default function SkillsMarquee({ skills }: SkillsMarqueeProps) {
  if (!skills.length) return null;

  const items = [...skills, ...skills, ...skills, ...skills];

  return (
    <section className="bg-charcoal py-8 overflow-hidden">
      <div className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap">
        {items.map((skill, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span className={`text-white ${sizes[i % sizes.length]} px-4 sm:px-6`}>
              {skill.name}
            </span>
            <span className="text-orange-400 text-2xl mx-2 sm:mx-4">&#x2022;</span>
          </span>
        ))}
      </div>
    </section>
  );
}
