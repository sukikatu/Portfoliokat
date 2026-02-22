import type { PortfolioSection } from '../../types/portfolio';

interface Props {
  section: PortfolioSection;
}

export default function DividerRenderer({ section }: Props) {
  const spacing = section.settings.spacing || 'medium';
  const py = { small: 'py-6', medium: 'py-12', large: 'py-20' }[spacing];

  return (
    <div className={py} style={{ backgroundColor: section.settings.bg_color || 'transparent' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <hr className="border-neutral-200" />
      </div>
    </div>
  );
}
