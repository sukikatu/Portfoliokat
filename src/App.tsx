import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { usePortfolioData } from './hooks/usePortfolioData';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function PortfolioLayout() {
  const { profile, projects, skills, methodology, sections, loading } = usePortfolioData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-8 h-8 border-2 border-charcoal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-neutral-500">Unable to load portfolio data.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Home profile={profile} projects={projects} skills={skills} methodology={methodology} sections={sections} />
    </>
  );
}

function ProjectLayout() {
  return (
    <>
      <Navbar />
      <ProjectDetail />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortfolioLayout />} />
        <Route path="/project/:slug" element={<ProjectLayout />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
