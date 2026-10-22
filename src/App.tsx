import { useCallback, useEffect, useState } from 'react';
import { Shell } from './components/layout/Shell';
import { CommandPalette } from './components/layout/CommandPalette';
import { allNavItems, type PageKey } from './components/layout/nav';
import { Overview } from './pages/Overview';
import { Foundations } from './pages/Foundations';
import { Components } from './pages/Components';
import { AIPatterns } from './pages/AIPatterns';
import { DashboardPage } from './pages/DashboardPage';
import { CopilotPage } from './pages/CopilotPage';
import { SettingsPage } from './pages/SettingsPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { Guidelines } from './pages/Guidelines';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ModelsPage } from './pages/ModelsPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { DatasetsPage } from './pages/DatasetsPage';
import { AgentsPage } from './pages/AgentsPage';
import { DevelopersPage } from './pages/DevelopersPage';
import { TeamPage } from './pages/TeamPage';
import { StatesPage } from './pages/StatesPage';
import { TokensPage } from './pages/TokensPage';
import { ComponentDocsPage } from './pages/ComponentDocsPage';
import { MobilePage } from './pages/MobilePage';
import { AuthPage } from './pages/AuthPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { ComparePage } from './pages/ComparePage';
import { MotionPage } from './pages/MotionPage';

const pageKeys = allNavItems.map(item => item.key);
const themeStorageKey = 'unseen-ds-theme';

function readPage(): PageKey {
  const hash = window.location.hash.replace(/^#\/?/, '');
  return (pageKeys as string[]).includes(hash) ? (hash as PageKey) : 'overview';
}

function readTheme(): 'light' | 'dark' {
  const stored = window.localStorage.getItem(themeStorageKey);
  return stored === 'dark' ? 'dark' : 'light';
}

export default function App() {
  const [page, setPage] = useState<PageKey>(readPage);
  const [theme, setTheme] = useState<'light' | 'dark'>(readTheme);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  useEffect(() => {
    const onHashChange = () => setPage(readPage());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [page]);

  const navigate = useCallback((next: PageKey) => {
    if (window.location.hash !== `#/${next}`) {
      window.location.hash = `#/${next}`;
    }
    setPage(next);
  }, []);

  const toggleTheme = useCallback(() => setTheme(t => (t === 'light' ? 'dark' : 'light')), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(open => !open);
      }
      if (meta && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        toggleTheme();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleTheme]);

  return (
    <>
      <Shell
        page={page}
        onNavigate={navigate}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenSearch={() => setPaletteOpen(true)}
      >
        {page === 'overview' && <Overview onNavigate={navigate} />}
        {page === 'foundations' && <Foundations />}
        {page === 'components' && <Components />}
        {page === 'ai-patterns' && <AIPatterns />}
        {page === 'dashboard' && <DashboardPage />}
        {page === 'copilot' && <CopilotPage />}
        {page === 'settings' && <SettingsPage />}
        {page === 'templates' && <TemplatesPage />}
        {page === 'guidelines' && <Guidelines />}
        {page === 'analytics' && <AnalyticsPage />}
        {page === 'models' && <ModelsPage />}
        {page === 'playground' && <PlaygroundPage />}
        {page === 'datasets' && <DatasetsPage />}
        {page === 'agents' && <AgentsPage />}
        {page === 'developers' && <DevelopersPage />}
        {page === 'team' && <TeamPage />}
        {page === 'states' && <StatesPage />}
        {page === 'tokens' && <TokensPage />}
        {page === 'docs' && <ComponentDocsPage />}
        {page === 'auth' && <AuthPage />}
        {page === 'onboarding' && <OnboardingPage />}
        {page === 'compare' && <ComparePage />}
        {page === 'motion' && <MotionPage />}
        {page === 'mobile' && <MobilePage />}
      </Shell>
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={navigate}
        onToggleTheme={toggleTheme}
        theme={theme}
      />
    </>
  );
}
