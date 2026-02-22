import Hero from '../components/Hero';
import SkillsMarquee from '../components/SkillsMarquee';
import CaseStudyCard from '../components/CaseStudyCard';
import Methodology from '../components/Methodology';
import Footer from '../components/Footer';
import SectionRenderer from '../components/sections/SectionRenderer';
import type { Profile, Project, Skill, MethodologyItem, PortfolioSection } from '../types/portfolio';

interface HomeProps {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  methodology: MethodologyItem[];
  sections: PortfolioSection[];
}

export default function Home({ profile, projects, skills, methodology, sections }: HomeProps) {
  return (
    <>
      <Hero profile={profile} />
      <SkillsMarquee skills={skills} />
      <div id="work">
        {projects.map((project, index) => (
          <CaseStudyCard key={project.id} project={project} index={index} />
        ))}
      </div>
      {sections.length > 0 && <SectionRenderer sections={sections} />}
      <Methodology profile={profile} items={methodology} />
      <Footer profile={profile} />
    </>
  );
}
