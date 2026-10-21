import {
  Blocks,
  BookOpen,
  Gauge,
  LayoutGrid,
  MessageSquare,
  Palette,
  Settings2,
  Sparkles,
  Wand2,
  type LucideIcon,
} from 'lucide-react';

export type PageKey =
  | 'overview'
  | 'foundations'
  | 'components'
  | 'ai-patterns'
  | 'dashboard'
  | 'copilot'
  | 'settings'
  | 'templates'
  | 'guidelines';

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
      { key: 'components', label: 'Components', description: '42 production-ready UI primitives', icon: Blocks },
      { key: 'ai-patterns', label: 'AI patterns', description: 'Chat, prompts, streaming, agents, keys', icon: Sparkles },
    ],
  },
  {
    label: 'Product screens',
    items: [
      { key: 'dashboard', label: 'Dashboard', description: 'Usage, models and cost analytics', icon: Gauge },
      { key: 'copilot', label: 'Copilot', description: 'Chat playground with parameters', icon: MessageSquare },
      { key: 'settings', label: 'Settings', description: 'Profile, workspace, keys and billing', icon: Settings2 },
      { key: 'templates', label: 'Templates', description: 'Sign in, onboarding and empty states', icon: Wand2 },
    ],
  },
  {
    label: 'Resources',
    items: [
      { key: 'guidelines', label: 'Guidelines', description: 'Usage rules, accessibility and changelog', icon: BookOpen },
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
