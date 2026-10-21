/**
 * UNSEEN DESIGN SYSTEM — TOKEN SOURCE OF TRUTH
 * The values here mirror the CSS variables in src/index.css.
 * Docs consume this file; product UI should consume the CSS vars (Tailwind classes).
 */

export interface ColorStep {
  name: string;
  hex: string;
}

export interface TypeToken {
  name: string;
  size: number;
  weight: number;
  lineHeight: number;
  tracking: string;
  sample: string;
  usage: string;
}

export const ramps: { label: string; token: string; steps: ColorStep[] }[] = [
  {
    label: 'Blue',
    token: 'brand',
    steps: [
      { name: '50', hex: '#EFF8FF' },
      { name: '100', hex: '#DBEFFE' },
      { name: '200', hex: '#BAE0FD' },
      { name: '300', hex: '#7DCBFC' },
      { name: '400', hex: '#38AEFA' },
      { name: '500', hex: '#0E91F0' },
      { name: '600', hex: '#0272C6' },
      { name: '700', hex: '#035B9E' },
      { name: '800', hex: '#074E84' },
      { name: '900', hex: '#0C3F6B' },
    ],
  },
  {
    label: 'Pink',
    token: 'pink',
    steps: [
      { name: '50', hex: '#FFF0F7' },
      { name: '100', hex: '#FFE0EF' },
      { name: '200', hex: '#FFC0DF' },
      { name: '300', hex: '#FF91C1' },
      { name: '400', hex: '#FF56A0' },
      { name: '500', hex: '#F72685' },
      { name: '600', hex: '#E0156E' },
      { name: '700', hex: '#BC0C5A' },
      { name: '800', hex: '#9D0E4D' },
      { name: '900', hex: '#820F43' },
    ],
  },
  {
    label: 'Amber',
    token: 'amber',
    steps: [
      { name: '50', hex: '#FFF8ED' },
      { name: '100', hex: '#FFEFD3' },
      { name: '200', hex: '#FFDBA5' },
      { name: '300', hex: '#FFC06D' },
      { name: '400', hex: '#FF9A33' },
      { name: '500', hex: '#FF7A0D' },
      { name: '600', hex: '#F45F03' },
      { name: '700', hex: '#CA4806' },
      { name: '800', hex: '#A0390C' },
      { name: '900', hex: '#83300E' },
    ],
  },
  {
    label: 'Neutral',
    token: 'gray',
    steps: [
      { name: '50', hex: '#F8F8FA' },
      { name: '100', hex: '#F0F0F4' },
      { name: '200', hex: '#E4E4EC' },
      { name: '300', hex: '#CDCDD9' },
      { name: '400', hex: '#A0A0B8' },
      { name: '500', hex: '#737390' },
      { name: '600', hex: '#575772' },
      { name: '700', hex: '#424260' },
      { name: '800', hex: '#2E2E4A' },
      { name: '900', hex: '#0F0F1E' },
    ],
  },
];

export const semanticColors = [
  { name: 'brand / brand', token: '--ds-brand', light: '#0E91F0', dark: '#38AEFA', use: 'Primary actions, links, focus' },
  { name: 'brand-strong', token: '--ds-brand-strong', light: '#0272C6', dark: '#7DCBFC', use: 'Press states, gradient end' },
  { name: 'pink', token: '--ds-pink', light: '#F72685', dark: '#FF56A0', use: 'AI / upgrade accents' },
  { name: 'amber', token: '--ds-amber', light: '#FF7A0D', dark: '#FF9A33', use: 'Attention, usage alerts' },
  { name: 'success', token: '--ds-success', light: '#11A06A', dark: '#4ADE9F', use: 'Live, healthy, complete' },
  { name: 'danger', token: '--ds-danger', light: '#E5484D', dark: '#FF7B7F', use: 'Destructive, failures' },
  { name: 'warning', token: '--ds-warning', light: '#D98A00', dark: '#FFC940', use: 'Rate limits, caution' },
  { name: 'ink', token: '--ds-ink', light: '#0F0F1E', dark: '#F4F5FA', use: 'Primary copy' },
  { name: 'muted', token: '--ds-muted', light: '#6F6F8C', dark: '#8F90A6', use: 'Secondary copy' },
  { name: 'line', token: '--ds-line', light: '#E8E8F0', dark: '#23232F', use: 'Borders, dividers' },
  { name: 'surface', token: '--ds-surface', light: '#FFFFFF', dark: '#101019', use: 'Cards, panels' },
  { name: 'canvas', token: '--ds-canvas', light: '#F6F6FA', dark: '#07070D', use: 'Page background' },
];

export const typeScale: TypeToken[] = [
  { name: 'Display', size: 60, weight: 800, lineHeight: 1.02, tracking: '-0.045em', sample: 'Intelligence, shipped.', usage: 'Marketing hero' },
  { name: 'H1', size: 40, weight: 700, lineHeight: 1.08, tracking: '-0.035em', sample: 'Workspace overview', usage: 'Page titles' },
  { name: 'H2', size: 28, weight: 700, lineHeight: 1.15, tracking: '-0.03em', sample: 'Model performance', usage: 'Section headers' },
  { name: 'H3', size: 20, weight: 600, lineHeight: 1.3, tracking: '-0.02em', sample: 'Active sessions', usage: 'Card titles' },
  { name: 'H4', size: 16, weight: 600, lineHeight: 1.4, tracking: '-0.01em', sample: 'Token usage today', usage: 'Sub-headers, labels' },
  { name: 'Body L', size: 16, weight: 400, lineHeight: 1.65, tracking: '0', sample: 'The model processes natural language inputs at scale.', usage: 'Long-form copy' },
  { name: 'Body M', size: 14, weight: 400, lineHeight: 1.6, tracking: '0', sample: 'Configure endpoints, rate limits and retries.', usage: 'Default UI copy' },
  { name: 'Body S', size: 13, weight: 400, lineHeight: 1.55, tracking: '0', sample: 'Last updated 2 minutes ago', usage: 'Meta, helper text' },
  { name: 'Caption', size: 11, weight: 500, lineHeight: 1.45, tracking: '0.02em', sample: '1,284,392 requests', usage: 'Data labels, chips' },
  { name: 'Overline', size: 10, weight: 700, lineHeight: 1.4, tracking: '0.16em', sample: 'TOKEN USAGE', usage: 'Eyebrows, table heads' },
];

export const spacing = [
  { name: '0.5', value: 2 },
  { name: '1', value: 4 },
  { name: '1.5', value: 6 },
  { name: '2', value: 8 },
  { name: '3', value: 12 },
  { name: '4', value: 16 },
  { name: '5', value: 20 },
  { name: '6', value: 24 },
  { name: '8', value: 32 },
  { name: '10', value: 40 },
  { name: '12', value: 48 },
  { name: '16', value: 64 },
  { name: '20', value: 80 },
  { name: '24', value: 96 },
];

export const radii = [
  { name: 'xs', value: 6, use: 'Chips, inputs (dense)' },
  { name: 'sm', value: 8, use: 'Buttons, inputs' },
  { name: 'md', value: 10, use: 'Menu items, tabs' },
  { name: 'lg', value: 14, use: 'Cards' },
  { name: 'xl', value: 20, use: 'Panels, modals' },
  { name: '2xl', value: 28, use: 'Shells, hero blocks' },
  { name: 'full', value: 9999, use: 'Pills, avatars' },
];

export const shadows = [
  { name: 'shadow-xs', value: '0 1px 2px rgba(15,15,30,.05)', use: 'Inputs, chips' },
  { name: 'shadow-card', value: '0 1px 2px rgba(15,15,30,.04), 0 8px 24px -12px rgba(15,15,30,.12)', use: 'Cards' },
  { name: 'shadow-pop', value: '0 2px 6px rgba(15,15,30,.06), 0 18px 44px -16px rgba(15,15,30,.22)', use: 'Popovers, menus' },
  { name: 'shadow-float', value: '0 24px 70px -24px rgba(15,15,30,.35)', use: 'Modals, drawers' },
  { name: 'shadow-brand', value: '0 10px 28px -12px rgba(14,145,240,.6)', use: 'Primary CTA' },
];

export const motion = [
  { name: 'instant', duration: 90, easing: 'linear', use: 'Hover tints, icon swaps' },
  { name: 'fast', duration: 150, easing: 'cubic-bezier(.4,0,.2,1)', use: 'Buttons, toggles, tabs' },
  { name: 'base', duration: 220, easing: 'cubic-bezier(.22,1,.36,1)', use: 'Cards, popovers' },
  { name: 'slow', duration: 360, easing: 'cubic-bezier(.22,1,.36,1)', use: 'Drawers, page fade' },
  { name: 'stream', duration: 900, easing: 'linear', use: 'Caret blink, shimmer' },
];

export const gradients = [
  { name: 'gradient-brand', value: 'linear-gradient(135deg, #38AEFA 0%, #0272C6 100%)' },
  { name: 'gradient-ai', value: 'linear-gradient(100deg, #0E91F0 0%, #F72685 55%, #FF7A0D 100%)' },
  { name: 'gradient-pink', value: 'linear-gradient(135deg, #FF56A0 0%, #F72685 100%)' },
  { name: 'gradient-ember', value: 'linear-gradient(135deg, #FFC06D 0%, #FF7A0D 100%)' },
  { name: 'gradient-dusk', value: 'linear-gradient(160deg, #0F0F1E 0%, #1B1B33 100%)' },
];

export const colorHex: Record<string, string> = {
  brand: '#0E91F0',
  pink: '#F72685',
  amber: '#FF7A0D',
  success: '#11A06A',
  danger: '#E5484D',
  violet: '#7C6CF6',
  ink: '#0F0F1E',
  muted: '#6F6F8C',
};
