import type { PortfolioSection } from '../../types/portfolio';
import TextBlockRenderer from './TextBlockRenderer';
import ImageBlockRenderer from './ImageBlockRenderer';
import GalleryRenderer from './GalleryRenderer';
import TwoColumnRenderer from './TwoColumnRenderer';
import QuoteRenderer from './QuoteRenderer';
import DividerRenderer from './DividerRenderer';

interface Props {
  sections: PortfolioSection[];
}

export default function SectionRenderer({ sections }: Props) {
  if (!sections.length) return null;

  return (
    <div>
      {sections.map((section) => {
        switch (section.section_type) {
          case 'text_block':
            return <TextBlockRenderer key={section.id} section={section} />;
          case 'full_image':
            return <ImageBlockRenderer key={section.id} section={section} />;
          case 'image_gallery':
            return <GalleryRenderer key={section.id} section={section} />;
          case 'two_column':
            return <TwoColumnRenderer key={section.id} section={section} />;
          case 'quote':
            return <QuoteRenderer key={section.id} section={section} />;
          case 'divider':
            return <DividerRenderer key={section.id} section={section} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
