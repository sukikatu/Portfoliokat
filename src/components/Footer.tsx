import { Twitter, Github, Mail, Linkedin } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import type { Profile } from '../types/portfolio';

interface FooterProps {
  profile: Profile;
}

export default function Footer({ profile }: FooterProps) {
  const { ref, isVisible } = useInView();

  return (
    <footer id="contact" className="bg-charcoal text-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <div
          ref={ref}
          className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-8">
            Open for Opportunities
          </p>

          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-2">
            {profile.cta_headline}
          </h2>
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-serif italic text-mint-400 mb-12">
            {profile.cta_accent}
          </h2>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 bg-mint-400 text-charcoal text-xs uppercase tracking-[0.15em] px-6 py-3 rounded-full font-medium hover:bg-mint-300 transition-all duration-300 hover:scale-105"
            >
              <Mail className="w-3.5 h-3.5" />
              {profile.email}
            </a>
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-neutral-600 text-white text-xs uppercase tracking-[0.15em] px-6 py-3 rounded-full hover:border-neutral-400 transition-all duration-300 hover:scale-105"
            >
              <Linkedin className="w-3.5 h-3.5" />
              LinkedIn
            </a>
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-neutral-800">
            <div className="flex gap-4">
              <a
                href={profile.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-white transition-colors duration-300"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-white transition-colors duration-300"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
            <p className="text-[10px] text-neutral-600 uppercase tracking-wider">
              &copy; {new Date().getFullYear()} {profile.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
