import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Hexagon, User, FolderOpen, Zap, BookOpen, LayoutGrid, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ProfileEditor from './admin/ProfileEditor';
import ProjectsEditor from './admin/ProjectsEditor';
import SkillsEditor from './admin/SkillsEditor';
import MethodologyEditor from './admin/MethodologyEditor';
import PageBuilder from './admin/PageBuilder';

type Tab = 'profile' | 'projects' | 'skills' | 'methodology' | 'page-builder';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/admin/login');
      } else {
        setChecking(false);
      }
    });
  }, [navigate]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/admin/login');
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-8 h-8 border-2 border-charcoal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: typeof User }[] = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'projects', label: 'Projects', icon: FolderOpen },
    { key: 'skills', label: 'Skills', icon: Zap },
    { key: 'methodology', label: 'Methodology', icon: BookOpen },
    { key: 'page-builder', label: 'Page Builder', icon: LayoutGrid },
  ];

  const isWide = activeTab === 'page-builder';

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200">
        <div className={`${isWide ? 'max-w-[1600px]' : 'max-w-7xl'} mx-auto px-6 flex items-center justify-between h-14 transition-all`}>
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <Hexagon className="w-4 h-4 text-charcoal" />
              <span className="font-semibold text-charcoal text-sm">Admin</span>
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-charcoal text-xs uppercase tracking-[0.15em] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      <div className={`${isWide ? 'max-w-[1600px]' : 'max-w-7xl'} mx-auto px-6 py-8 transition-all`}>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-48 shrink-0">
            <nav className="flex lg:flex-col gap-1">
              {tabs.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    activeTab === key
                      ? 'bg-charcoal text-white'
                      : 'text-neutral-500 hover:bg-neutral-100 hover:text-charcoal'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className={`flex-1 bg-white border border-neutral-200 rounded-xl p-6 ${isWide ? 'overflow-hidden' : ''}`}>
            {activeTab === 'profile' && <ProfileEditor />}
            {activeTab === 'projects' && <ProjectsEditor />}
            {activeTab === 'skills' && <SkillsEditor />}
            {activeTab === 'methodology' && <MethodologyEditor />}
            {activeTab === 'page-builder' && <PageBuilder />}
          </div>
        </div>
      </div>
    </div>
  );
}
