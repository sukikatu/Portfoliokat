import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Hexagon } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Selected Work', href: '/#work' },
    { label: 'Methodology', href: '/#methodology' },
    { label: 'Profile', href: '/#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <Hexagon className="w-5 h-5 text-charcoal transition-transform duration-300 group-hover:rotate-90" />
            <div>
              <span className="font-semibold text-charcoal text-sm tracking-tight">subkato</span>
              <span className="hidden sm:block text-[9px] uppercase tracking-[0.2em] text-neutral-400">
                Digital UX since
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              isHome ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs uppercase tracking-[0.15em] text-neutral-500 hover:text-charcoal transition-colors duration-300"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-xs uppercase tracking-[0.15em] text-neutral-500 hover:text-charcoal transition-colors duration-300"
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>

          <a
            href="/#contact"
            className="bg-charcoal text-white text-xs uppercase tracking-[0.15em] px-5 py-2.5 rounded-full hover:bg-neutral-700 transition-all duration-300 hover:scale-105"
          >
            Hire Me
          </a>
        </div>
      </div>
    </nav>
  );
}
