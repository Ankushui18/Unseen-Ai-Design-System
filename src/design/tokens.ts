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
      { name: '700', hex: '#C01069' },
      { name: '800', hex: '#A00E57' },
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
      { name: '700', hex: '#C45200' },
      { name: '800', hex: '#A0390C' },
      { name: '900', hex: '#83300E' },
    ],
  },
  {
    label: 'Green',
    token: 'green',
    steps: [
      { name: '50', hex: '#E9F9F1' },
      { name: '100', hex: '#CFF3E1' },
      { name: '200', hex: '#A0E7C6' },
      { name: '300', hex: '#6BD9A8' },
      { name: '400', hex: '#35C489' },
      { name: '500', hex: '#16A971' },
      { name: '600', hex: '#0C7D53' },
      { name: '700', hex: '#0A6A47' },
      { name: '800', hex: '#085539' },
      { name: '900', hex: '#063D29' },
    ],
  },
  {
    label: 'Red',
    token: 'red',
    steps: [
      { name: '50', hex: '#FDEEEE' },
      { name: '100', hex: '#FBD9DA' },
      { name: '200', hex: '#F6B4B6' },
      { name: '300', hex: '#EF8A8D' },
      { name: '400', hex: '#E45F63' },
      { name: '500', hex: '#D63A40' },
      { name: '600', hex: '#C62F34' },
      { name: '700', hex: '#A32629' },
      { name: '800', hex: '#832023' },
      { name: '900', hex: '#631A1C' },
    ],
  },
  {
    label: 'Violet',
    token: 'violet',
    steps: [
      { name: '50', hex: '#F1EFFF' },
      { name: '100', hex: '#E3DFFF' },
      { name: '200', hex: '#C7BFFF' },
      { name: '300', hex: '#A99CFF' },
      { name: '400', hex: '#8B78FA' },
      { name: '500', hex: '#6E5AEF' },
      { name: '600', hex: '#5B4BE0' },
      { name: '700', hex: '#4E3ECC' },
      { name: '800', hex: '#3E31A3' },
      { name: '900', hex: '#30267A' },
    ],
  },
  {
    label: 'Neutral',
    token: 'neutral',
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
  { name: 'brand (text)', token: '--ds-brand', light: '#0272C6', dark: '#38AEFA', use: 'Links, active icons, focus ring' },
  { name: 'brand-vivid', token: '--ds-brand-vivid', light: '#0E91F0', dark: '#38AEFA', use: 'Gradients, chart marks' },
  { name: 'brand-fill', token: '--ds-brand-fill', light: '#0272C6', dark: '#38AEFA', use: 'Solid button background' },
  { name: 'on-brand', token: '--ds-on-brand', light: '#FFFFFF', dark: '#061320', use: 'Text on brand fill' },
  { name: 'pink', token: '--ds-pink', light: '#C90F69', dark: '#FF56A0', use: 'AI / upgrade accents' },
  { name: 'amber', token: '--ds-amber', light: '#A9540A', dark: '#FF9A33', use: 'Attention text' },
  { name: 'amber-fill', token: '--ds-amber-fill', light: '#FF7A0D', dark: '#FF9A33', use: 'Attention fill (dark text)' },
  { name: 'success', token: '--ds-success', light: '#0B7A51', dark: '#4ADE9F', use: 'Live, healthy, complete' },
  { name: 'danger', token: '--ds-danger', light: '#B92B30', dark: '#FF7B7F', use: 'Destructive, failures' },
  { name: 'warning', token: '--ds-warning', light: '#8A5600', dark: '#FFC940', use: 'Rate limits, caution' },
  { name: 'violet', token: '--ds-violet', light: '#4E3ECC', dark: '#A394FF', use: 'Tools, agents, memory' },
  { name: 'ink', token: '--ds-ink', light: '#0F0F1E', dark: '#F4F5FA', use: 'Primary copy' },
  { name: 'muted', token: '--ds-muted', light: '#5E5E78', dark: '#A7A8BC', use: 'Secondary copy' },
  { name: 'faint', token: '--ds-faint', light: '#6C6C89', dark: '#8A8BA1', use: 'Metadata, captions' },
  { name: 'line', token: '--ds-line', light: '#E8E8F0', dark: '#23232F', use: 'Borders, dividers' },
  { name: 'surface', token: '--ds-surface', light: '#FFFFFF', dark: '#101019', use: 'Cards, panels' },
  { name: 'canvas', token: '--ds-canvas', light: '#F6F6FA', dark: '#07070D', use: 'Page background' },
];

export const breakpoints = [
  { name: 'xs', value: 0, note: 'Phones, single column' },
  { name: 'sm', value: 640, note: 'Large phones, 2-up cards' },
  { name: 'md', value: 768, note: 'Tablets portrait' },
  { name: 'lg', value: 1024, note: 'Sidebar appears' },
  { name: 'xl', value: 1280, note: 'Full data density' },
  { name: '2xl', value: 1536, note: 'Wide canvases' },
];

export const zIndexScale = [
  { name: 'base', value: 0, use: 'Page flow' },
  { name: 'raised', value: 10, use: 'Cards on hover' },
  { name: 'sticky', value: 20, use: 'Top bar, table heads' },
  { name: 'sidebar', value: 30, use: 'Persistent nav' },
  { name: 'dropdown', value: 40, use: 'Menus, popovers' },
  { name: 'overlay', value: 50, use: 'Scrims, drawers' },
  { name: 'modal', value: 60, use: 'Dialogs' },
  { name: 'toast', value: 70, use: 'Notifications' },
  { name: 'tooltip', value: 80, use: 'Always on top' },
];

export const easings = [
  { name: 'standard', value: 'cubic-bezier(.4,0,.2,1)', use: 'Most transitions' },
  { name: 'enter', value: 'cubic-bezier(.22,1,.36,1)', use: 'Elements appearing' },
  { name: 'exit', value: 'cubic-bezier(.4,0,1,1)', use: 'Elements leaving' },
  { name: 'spring', value: 'cubic-bezier(.34,1.56,.64,1)', use: 'Playful confirms' },
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
  { name: 'none', value: 0, use: 'Square edges, embedded media' },
  { name: 'sm', value: 4, use: 'Chips, checkboxes, dense inputs' },
  { name: 'md', value: 8, use: 'Buttons, inputs, menu items' },
  { name: 'lg', value: 12, use: 'Inner panels, list rows' },
  { name: 'xl', value: 16, use: 'Cards, popovers' },
  { name: '2xl', value: 24, use: 'Modals, drawers, shells' },
  { name: 'full', value: 9999, use: 'Pills, avatars, toggles' },
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
