import {
  Blocks,
  BookOpen,
  Bot,
  Boxes,
  ChartNoAxesColumn,
  Contrast,
  Database,
  FileCode2,
  FlaskConical,
  Gauge,
  KeyRound,
  LayoutGrid,
  MessageSquare,
  MoveRight,
  Palette,
  Settings2,
  Smartphone,
  Sparkles,
  Spline,
  SwatchBook,
  Terminal,
  TriangleAlert,
  Users,
  Wand2,
  type LucideIcon,
} from 'lucide-react';

export type PageKey =
  | 'overview'
  | 'foundations'
  | 'components'
  | 'ai-patterns'
  | 'docs'
  | 'tokens'
  | 'dashboard'
  | 'analytics'
  | 'models'
  | 'playground'
  | 'copilot'
  | 'datasets'
  | 'agents'
  | 'developers'
  | 'team'
  | 'settings'
  | 'templates'
  | 'auth'
  | 'onboarding'
  | 'compare'
  | 'motion'
  | 'mobile'
  | 'guidelines'
  | 'states';

export interface NavItem {
  key: PageKey;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: 'Design system',
    items: [
      { key: 'overview', label: 'Overview', description: 'System home, principles and quality bar', icon: LayoutGrid },
      { key: 'foundations', label: 'Foundations', description: 'Color, type, spacing, elevation, motion', icon: Palette },
      { key: 'components', label: 'Components', description: '111 production-ready UI primitives', icon: Blocks },
      { key: 'ai-patterns', label: 'AI patterns', description: 'Chat, prompts, streaming, agents, keys', icon: Sparkles },
      { key: 'compare', label: 'Light & dark', description: 'Side-by-side theme comparison with token diffs', icon: Contrast },
      { key: 'motion', label: 'Motion', description: 'Duration and easing tokens with live examples', icon: Spline },
      { key: 'docs', label: 'Component docs', description: 'Anatomy, props and accessibility per component', icon: FileCode2 },
      { key: 'tokens', label: 'Token export', description: 'CSS, JSON, Tailwind and Figma variable output', icon: SwatchBook },
    ],
  },
  {
    label: 'Product screens',
    items: [
      { key: 'dashboard', label: 'Dashboard', description: 'Usage, models and cost analytics', icon: Gauge },
      { key: 'analytics', label: 'Analytics', description: 'Traffic, spend and quality breakdowns', icon: ChartNoAxesColumn },
      { key: 'models', label: 'Models', description: 'Model registry, routing and deployment', icon: Boxes },
      { key: 'playground', label: 'Playground', description: 'Prompt A/B testing against two models', icon: FlaskConical },
      { key: 'copilot', label: 'Copilot', description: 'Chat playground with parameters', icon: MessageSquare },
      { key: 'datasets', label: 'Datasets', description: 'Golden sets, eval runs and human review', icon: Database },
      { key: 'agents', label: 'Agents', description: 'Run traces, tools and guardrails', icon: Bot },
      { key: 'developers', label: 'Developers', description: 'API reference, keys, logs and webhooks', icon: Terminal },
      { key: 'team', label: 'Team', description: 'Members, roles and audit log', icon: Users },
      { key: 'auth', label: 'Sign in', description: 'Sign in, sign up, reset and one-time code', icon: KeyRound },
      { key: 'onboarding', label: 'Onboarding', description: 'Five-step wizard with plan picker', icon: MoveRight },
      { key: 'settings', label: 'Settings', description: 'Profile, workspace, keys and billing', icon: Settings2 },
      { key: 'templates', label: 'Templates', description: 'Sign in, onboarding and empty states', icon: Wand2 },
      { key: 'mobile', label: 'Mobile', description: 'Responsive patterns for small viewports', icon: Smartphone },
    ],
  },
  {
    label: 'Resources',
    items: [
      { key: 'guidelines', label: 'Guidelines', description: 'Usage rules, accessibility and changelog', icon: BookOpen },
      { key: 'states', label: 'States', description: 'Empty, error, loading and permission states', icon: TriangleAlert },
    ],
  },
];

export const allNavItems: NavItem[] = navGroups.flatMap(g => g.items);

export const pageMeta: Record<PageKey, { title: string; group: string }> = navGroups.reduce(
  (acc, group) => {
    group.items.forEach(item => {
      acc[item.key] = { title: item.label, group: group.label };
    });
    return acc;
  },
  {} as Record<PageKey, { title: string; group: string }>,
);
