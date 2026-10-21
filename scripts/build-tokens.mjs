#!/usr/bin/env node
/**
 * Unseen design system — token pipeline.
 *
 *   node scripts/build-tokens.mjs
 *
 * Emits, from one source:
 *   tokens/unseen.tokens.json    Tokens Studio (W3C DTCG-ish) with Light/Dark sets
 *   tokens/figma-variables.json  Figma Variables REST payload (create/import)
 *   tokens/unseen.tokens.css     CSS custom properties for the same values
 *   tokens/CONTRAST.md           measured contrast + colour-vision report
 *   src/design/contrast-report.ts the same measurements, typed, for the docs UI
 *
 * src/index.css remains the runtime source for the app; `--check` verifies the
 * two stay in sync so the Figma file and the product cannot drift.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = (...p) => resolve(root, 'tokens', ...p);

/* ------------------------------------------------------------------ colour */

const ramps = {
  brand: {
    name: 'Blue',
    50: '#EFF8FF', 100: '#DBEFFE', 200: '#BAE0FD', 300: '#7DCBFC', 400: '#38AEFA',
    500: '#0E91F0', 600: '#0272C6', 700: '#035B9E', 800: '#074E84', 900: '#0C3F6B',
  },
  pink: {
    name: 'Pink',
    50: '#FFF0F7', 100: '#FFE0EF', 200: '#FFC0DF', 300: '#FF91C1', 400: '#FF56A0',
    500: '#F72685', 600: '#E0156E', 700: '#C01069', 800: '#A00E57', 900: '#820F43',
  },
  amber: {
    name: 'Amber',
    50: '#FFF8ED', 100: '#FFEFD3', 200: '#FFDBA5', 300: '#FFC06D', 400: '#FF9A33',
    500: '#FF7A0D', 600: '#F45F03', 700: '#C45200', 800: '#A0390C', 900: '#83300E',
  },
  green: {
    name: 'Green',
    50: '#E9F9F1', 100: '#CFF3E1', 200: '#A0E7C6', 300: '#6BD9A8', 400: '#35C489',
    500: '#16A971', 600: '#0C7D53', 700: '#0A6A47', 800: '#085539', 900: '#063D29',
  },
  red: {
    name: 'Red',
    50: '#FDEEEE', 100: '#FBD9DA', 200: '#F6B4B6', 300: '#EF8A8D', 400: '#E45F63',
    500: '#D63A40', 600: '#C62F34', 700: '#A32629', 800: '#832023', 900: '#631A1C',
  },
  violet: {
    name: 'Violet',
    50: '#F1EFFF', 100: '#E3DFFF', 200: '#C7BFFF', 300: '#A99CFF', 400: '#8B78FA',
    500: '#6E5AEF', 600: '#5B4BE0', 700: '#4E3ECC', 800: '#3E31A3', 900: '#30267A',
  },
  neutral: {
    name: 'Neutral',
    50: '#F8F8FA', 100: '#F0F0F4', 200: '#E4E4EC', 300: '#CDCDD9', 400: '#A0A0B8',
    500: '#737390', 600: '#575772', 700: '#424260', 800: '#2E2E4A', 900: '#0F0F1E',
  },
};

/**
 * Semantic colour. Every entry has a Light and a Dark value.
 * `on*` = foreground that is guaranteed to pass AA against the matching fill.
 */
const semantic = {
  // surfaces
  canvas:            { light: '#F6F6FA', dark: '#07070D', use: 'Page background' },
  'canvas-deep':     { light: '#EDEDF4', dark: '#04040A', use: 'Recessed background' },
  surface:           { light: '#FFFFFF', dark: '#101019', use: 'Cards, panels' },
  'surface-2':       { light: '#FBFBFD', dark: '#15151F', use: 'Nested panels' },
  'surface-3':       { light: '#F2F2F7', dark: '#1B1B27', use: 'Tracks, wells' },
  inverse:           { light: '#0F0F1E', dark: '#F5F6FA', use: 'Inverse surface' },
  'on-inverse':      { light: '#FFFFFF', dark: '#0F0F1E', use: 'Text on inverse' },

  // text — all ≥ 4.5:1 on surface and canvas
  ink:               { light: '#0F0F1E', dark: '#F4F5FA', use: 'Primary copy' },
  'ink-soft':        { light: '#3A3A55', dark: '#C9CAD9', use: 'Secondary headings' },
  muted:             { light: '#5E5E78', dark: '#A7A8BC', use: 'Body / helper copy' },
  faint:             { light: '#6C6C89', dark: '#8A8BA1', use: 'Metadata, captions' },

  // borders
  line:              { light: '#E8E8F0', dark: '#23232F', use: 'Borders, dividers' },
  'line-soft':       { light: '#F0F0F6', dark: '#1B1B25', use: 'Hairlines' },
  'line-strong':     { light: '#D5D5E2', dark: '#35354A', use: 'Input borders' },

  // brand — base is text-safe, -vivid is decorative, -fill is a solid with on-brand
  brand:             { light: '#0272C6', dark: '#38AEFA', use: 'Links, active icons, focus' },
  'brand-vivid':     { light: '#0E91F0', dark: '#38AEFA', use: 'Gradients, chart marks' },
  'brand-fill':      { light: '#0272C6', dark: '#38AEFA', use: 'Solid button background' },
  'brand-fill-hover':{ light: '#035B9E', dark: '#56BCFB', use: 'Solid hover' },
  'on-brand':        { light: '#FFFFFF', dark: '#061320', use: 'Text on brand fill' },
  'brand-soft':      { light: '#EAF6FF', dark: 'rgba(56,174,250,0.12)', use: 'Tinted background' },

  // pink
  pink:              { light: '#C90F69', dark: '#FF56A0', use: 'AI / upgrade accent' },
  'pink-vivid':      { light: '#F72685', dark: '#FF56A0', use: 'Gradients' },
  'pink-fill':       { light: '#C90F69', dark: '#FF56A0', use: 'Solid background' },
  'on-pink':         { light: '#FFFFFF', dark: '#1A0510', use: 'Text on pink fill' },
  'pink-soft':       { light: '#FFF0F7', dark: 'rgba(247,38,133,0.14)', use: 'Tinted background' },

  // amber
  amber:             { light: '#A9540A', dark: '#FF9A33', use: 'Attention text' },
  'amber-vivid':     { light: '#FF7A0D', dark: '#FF9A33', use: 'Gradients, badges' },
  'amber-fill':      { light: '#FF7A0D', dark: '#FF9A33', use: 'Solid background (dark text)' },
  'on-amber':        { light: '#0F0F1E', dark: '#1A1002', use: 'Text on amber fill' },
  'amber-soft':      { light: '#FFF3E6', dark: 'rgba(255,122,13,0.14)', use: 'Tinted background' },

  // green (success)
  green:             { light: '#0B7A51', dark: '#4ADE9F', use: 'Success text' },
  'green-vivid':     { light: '#16A971', dark: '#4ADE9F', use: 'Charts, dots' },
  'green-fill':      { light: '#0C7D53', dark: '#4ADE9F', use: 'Solid background' },
  'on-green':        { light: '#FFFFFF', dark: '#04170F', use: 'Text on green fill' },
  'green-soft':      { light: '#E7F9F1', dark: 'rgba(17,160,106,0.16)', use: 'Tinted background' },

  // red (danger)
  red:               { light: '#B92B30', dark: '#FF7B7F', use: 'Danger text' },
  'red-vivid':       { light: '#E5484D', dark: '#FF7B7F', use: 'Charts, dots' },
  'red-fill':        { light: '#C62F34', dark: '#FF7B7F', use: 'Destructive background' },
  'on-red':          { light: '#FFFFFF', dark: '#1C0507', use: 'Text on red fill' },
  'red-soft':        { light: '#FDEEEE', dark: 'rgba(229,72,77,0.16)', use: 'Tinted background' },

  // warning
  warning:           { light: '#8A5600', dark: '#FFC940', use: 'Caution text' },
  'warning-fill':    { light: '#D98A00', dark: '#FFC940', use: 'Solid background (dark text)' },
  'on-warning':      { light: '#0F0F1E', dark: '#1A1002', use: 'Text on warning fill' },
  'warning-soft':    { light: '#FFF6E0', dark: 'rgba(217,138,0,0.16)', use: 'Tinted background' },

  // violet
  violet:            { light: '#4E3ECC', dark: '#A394FF', use: 'Tool / agent accent' },
  'violet-vivid':    { light: '#7C6CF6', dark: '#A394FF', use: 'Charts, dots' },
  'violet-fill':     { light: '#5B4BE0', dark: '#A394FF', use: 'Solid background' },
  'on-violet':       { light: '#FFFFFF', dark: '#0E0A24', use: 'Text on violet fill' },
  'violet-soft':     { light: '#F1EFFF', dark: 'rgba(124,108,246,0.16)', use: 'Tinted background' },
};

/** Categorical chart palette — checked for CVD separation in tokens/CONTRAST.md */
const charts = {
  light: ['#0B6FB8', '#C45200', '#A8104F', '#0C7D53', '#5B4BE0', '#7A6A00', '#0E7490', '#6F6F8C'],
  dark: ['#7DCBFC', '#FFA45C', '#FF8DB8', '#6EE7B0', '#B7AAFF', '#FFD166', '#5EEAD4', '#9C9DB2'],
};

/* ------------------------------------------------------------------ scales */

const space = {
  0: '0px', 0.5: '2px', 1: '4px', 1.5: '6px', 2: '8px', 3: '12px', 4: '16px',
  5: '20px', 6: '24px', 8: '32px', 10: '40px', 12: '48px', 16: '64px', 20: '80px', 24: '96px',
};

const radius = { none: '0px', sm: '4px', md: '8px', lg: '12px', xl: '16px', '2xl': '24px', '3xl': '32px', full: '9999px' };

const size = {
  'control-xs': '28px', 'control-sm': '32px', 'control-md': '40px', 'control-lg': '44px',
  'touch-target': '44px', 'icon-sm': '16px', 'icon-md': '20px', 'icon-lg': '24px',
  'container-max': '1240px', 'sidebar': '248px', 'drawer': '400px', 'sheet': '80vh',
};

const breakpoint = { xs: '0px', sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px' };

const zIndex = {
  base: 0, raised: 10, sticky: 20, sidebar: 30, dropdown: 40, overlay: 50, modal: 60, toast: 70, tooltip: 80,
};

const shadow = {
  xs: ['0 1px 2px rgba(15,15,30,.05)', '0 1px 2px rgba(0,0,0,.5)'],
  card: ['0 1px 2px rgba(15,15,30,.04), 0 8px 24px -12px rgba(15,15,30,.12)', '0 1px 0 rgba(255,255,255,.03) inset, 0 18px 40px -24px rgba(0,0,0,.9)'],
  pop: ['0 2px 6px rgba(15,15,30,.06), 0 18px 44px -16px rgba(15,15,30,.22)', '0 1px 0 rgba(255,255,255,.04) inset, 0 24px 60px -22px rgba(0,0,0,.9)'],
  float: ['0 24px 70px -24px rgba(15,15,30,.35)', '0 40px 100px -30px rgba(0,0,0,.95)'],
  brand: ['0 10px 28px -12px rgba(2,114,198,.6)', '0 12px 32px -14px rgba(56,174,250,.55)'],
};

const motion = {
  duration: { instant: '90ms', fast: '150ms', base: '220ms', slow: '360ms', stream: '900ms' },
  easing: {
    standard: 'cubic-bezier(.4,0,.2,1)',
    enter: 'cubic-bezier(.22,1,.36,1)',
    exit: 'cubic-bezier(.4,0,1,1)',
    spring: 'cubic-bezier(.34,1.56,.64,1)',
    linear: 'linear',
  },
};

const typography = {
  Display: { size: '60px', lineHeight: '1.02', weight: 800, tracking: '-0.045em' },
  H1: { size: '40px', lineHeight: '1.08', weight: 700, tracking: '-0.035em' },
  H2: { size: '28px', lineHeight: '1.15', weight: 700, tracking: '-0.03em' },
  H3: { size: '20px', lineHeight: '1.3', weight: 600, tracking: '-0.02em' },
  H4: { size: '16px', lineHeight: '1.4', weight: 600, tracking: '-0.01em' },
  'Body L': { size: '16px', lineHeight: '1.65', weight: 400, tracking: '0' },
  'Body M': { size: '14px', lineHeight: '1.6', weight: 400, tracking: '0' },
  'Body S': { size: '13px', lineHeight: '1.55', weight: 400, tracking: '0' },
  Caption: { size: '11px', lineHeight: '1.45', weight: 500, tracking: '0.02em' },
  Overline: { size: '10px', lineHeight: '1.4', weight: 700, tracking: '0.16em' },
};

const font = { sans: 'Geist', mono: 'Geist Mono' };

/* --------------------------------------------------------------- emit: DTCG */

const dtcgColor = (hex, mode) => {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return { value: hex, type: 'color', description: mode }; // rgba() stays a string
  const [r, g, b] = m.slice(1).map(x => parseInt(x, 16));
  return { $value: { colorSpace: 'srgb', components: [r / 255, g / 255, b / 255], alpha: 1 }, $type: 'color' };
};

const tokensStudio = {
  $description: 'Unseen AI Design System — tokens. Import with Tokens Studio; map the light/dark sets to Figma Variable modes.',
  $themes: [
    {
      name: 'Light',
      selectedTokenSets: {
        'unseen/palette': 'source',
        'unseen/semantic/light': 'enabled',
        'unseen/scale': 'source',
        'unseen/chart/light': 'enabled',
      },
    },
    {
      name: 'Dark',
      selectedTokenSets: {
        'unseen/palette': 'source',
        'unseen/semantic/dark': 'enabled',
        'unseen/scale': 'source',
        'unseen/chart/dark': 'enabled',
      },
    },
  ],
};

const paletteSet = {};
for (const [key, ramp] of Object.entries(ramps)) {
  paletteSet[key] = {};
  for (const [step, hex] of Object.entries(ramp)) {
    if (step === 'name') continue;
    paletteSet[key][step] = dtcgColor(hex, key);
  }
}

const semanticSet = mode => {
  const set = {};
  for (const [name, def] of Object.entries(semantic)) set[name] = dtcgColor(def[mode], mode);
  return set;
};

const chartSet = mode => {
  const set = {};
  charts[mode].forEach((hex, i) => {
    set[`chart-${i + 1}`] = dtcgColor(hex, mode);
  });
  return set;
};

const scaleSet = {
  font: {
    family: { sans: { $value: font.sans, $type: 'fontFamily' }, mono: { $value: font.mono, $type: 'fontFamily' } },
    ...Object.fromEntries(
      Object.entries(typography).map(([k, v]) => [
        k.toLowerCase().replace(/\s+/g, '-'),
        {
          $type: 'typography',
          $value: { fontFamily: font.sans, fontSize: v.size, fontWeight: v.weight, lineHeight: v.lineHeight, letterSpacing: v.tracking },
        },
      ]),
    ),
  },
  radius: Object.fromEntries(Object.entries(radius).map(([k, v]) => [k, { $value: v, $type: 'dimension' }])),
  space: Object.fromEntries(Object.entries(space).map(([k, v]) => [k, { $value: v, $type: 'dimension' }])),
  size: Object.fromEntries(Object.entries(size).map(([k, v]) => [k, { $value: v, $type: 'dimension' }])),
  breakpoint: Object.fromEntries(Object.entries(breakpoint).map(([k, v]) => [k, { $value: v, $type: 'dimension' }])),
  'z-index': Object.fromEntries(Object.entries(zIndex).map(([k, v]) => [k, { $value: v, $type: 'number' }])),
  shadow: Object.fromEntries(Object.entries(shadow).map(([k, v]) => [k, { $value: v[0], $type: 'shadow' }])),
  motion: {
    duration: Object.fromEntries(Object.entries(motion.duration).map(([k, v]) => [k, { $value: v, $type: 'duration' }])),
    easing: Object.fromEntries(Object.entries(motion.easing).map(([k, v]) => [k, { $value: v, $type: 'cubicBezier' }])),
  },
};

const tokensStudioFile = {
  ...tokensStudio,
  unseen: {
    palette: paletteSet,
    semantic: { light: semanticSet('light'), dark: semanticSet('dark') },
    chart: { light: chartSet('light'), dark: chartSet('dark') },
    scale: scaleSet,
  },
};

/* --------------------------------------------------------- emit: Figma vars */

const hexToRgba = hex => {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (m) {
    const [r, g, b] = m.slice(1).map(x => parseInt(x, 16) / 255);
    return { r, g, b, a: 1 };
  }
  const rgba = /^rgba\(([^)]+)\)$/.exec(hex);
  if (rgba) {
    const [r, g, b, a] = rgba[1].split(',').map(s => Number(s.trim()));
    return { r: r / 255, g: g / 255, b: b / 255, a };
  }
  return { r: 0, g: 0, b: 0, a: 1 };
};

const figmaVariables = {
  $schema: 'figma-variables/1',
  variableCollections: [
    {
      name: 'Unseen — Color',
      modes: [{ name: 'Light', id: 'mode:light' }, { name: 'Dark', id: 'mode:dark' }],
      defaultModeId: 'mode:light',
    },
    {
      name: 'Unseen — Scale',
      modes: [{ name: 'Default', id: 'mode:default' }],
      defaultModeId: 'mode:default',
    },
  ],
  variables: [],
};

for (const [name, def] of Object.entries(semantic)) {
  figmaVariables.variables.push({
    name: `color/${name}`,
    collection: 'Unseen — Color',
    resolvedType: 'COLOR',
    scopes: ['ALL_SCOPES'],
    valuesByMode: { 'mode:light': hexToRgba(def.light), 'mode:dark': hexToRgba(def.dark) },
    description: def.use,
  });
}

charts.light.forEach((hex, i) => {
  figmaVariables.variables.push({
    name: `chart/${i + 1}`,
    collection: 'Unseen — Color',
    resolvedType: 'COLOR',
    scopes: ['ALL_SCOPES'],
    valuesByMode: { 'mode:light': hexToRgba(hex), 'mode:dark': hexToRgba(charts.dark[i]) },
    description: `Categorical series ${i + 1}`,
  });
});

for (const [name, hex] of Object.entries(ramps)) {
  for (const [step, value] of Object.entries(hex)) {
    if (step === 'name') continue;
    figmaVariables.variables.push({
      name: `palette/${name}/${step}`,
      collection: 'Unseen — Color',
      resolvedType: 'COLOR',
      scopes: ['ALL_FILLS', 'STROKE_COLOR'],
      valuesByMode: { 'mode:light': hexToRgba(value), 'mode:dark': hexToRgba(value) },
      description: `${hex.name} ${step}`,
    });
  }
}

const pushNumber = (name, value, type = 'FLOAT', description = '') =>
  figmaVariables.variables.push({
    name,
    collection: 'Unseen — Scale',
    resolvedType: type,
    scopes: type === 'FLOAT' ? ['ALL_SCOPES'] : ['TEXT_CONTENT'],
    valuesByMode: { 'mode:default': type === 'FLOAT' ? parseFloat(value) : value },
    description,
  });

for (const [k, v] of Object.entries(radius)) pushNumber(`radius/${k}`, v, 'FLOAT', 'Corner radius');
for (const [k, v] of Object.entries(space)) pushNumber(`space/${k}`, v, 'FLOAT', 'Spacing step');
for (const [k, v] of Object.entries(size)) pushNumber(`size/${k}`, v, 'FLOAT', 'Component dimension');
for (const [k, v] of Object.entries(breakpoint)) pushNumber(`breakpoint/${k}`, v, 'FLOAT', 'Responsive breakpoint');
for (const [k, v] of Object.entries(zIndex)) pushNumber(`z/${k}`, v, 'FLOAT', 'Stacking order');
for (const [k, v] of Object.entries(motion.duration)) pushNumber(`motion/duration/${k}`, v, 'FLOAT', 'Duration (ms)');
for (const [k, v] of Object.entries(typography)) {
  pushNumber(`type/${k.toLowerCase().replace(/\s+/g, '-')}/size`, v.size, 'FLOAT', 'Font size');
  pushNumber(`type/${k.toLowerCase().replace(/\s+/g, '-')}/weight`, v.weight, 'FLOAT', 'Font weight');
  pushNumber(`type/${k.toLowerCase().replace(/\s+/g, '-')}/line-height`, v.lineHeight, 'FLOAT', 'Line height multiplier');
}

/* ----------------------------------------------------------- emit: CSS file */

const cssVar = name => `--ds-${name}`;
const css = [
  '/* Generated by scripts/build-tokens.mjs — do not edit by hand. */',
  '/* Mirror of src/index.css; import only in standalone Figma-handoff mocks. */',
  '',
  ':root {',
  `  /* text + surface */`,
  ...['canvas', 'canvas-deep', 'surface', 'surface-2', 'surface-3', 'inverse', 'on-inverse', 'ink', 'ink-soft', 'muted', 'faint', 'line', 'line-soft', 'line-strong'].map(
    n => `  ${cssVar(n)}: ${semantic[n].light};`,
  ),
  ...Object.entries(semantic)
    .filter(([n]) => !['canvas', 'canvas-deep', 'surface', 'surface-2', 'surface-3', 'inverse', 'on-inverse', 'ink', 'ink-soft', 'muted', 'faint', 'line', 'line-soft', 'line-strong'].includes(n))
    .map(([n, d]) => `  ${cssVar(n)}: ${d.light};`),
  '',
  '  /* palette */',
  ...Object.entries(ramps).flatMap(([key, ramp]) =>
    Object.entries(ramp)
      .filter(([s]) => s !== 'name')
      .map(([step, hex]) => `  --ds-${key}-${step}: ${hex};`),
  ),
  '',
  '  /* shape + motion */',
  ...Object.entries(radius).map(([k, v]) => `  --ds-radius-${k}: ${v};`),
  ...Object.entries(space).map(([k, v]) => `  --ds-space-${k}: ${v};`),
  ...Object.entries(breakpoint).map(([k, v]) => `  --ds-breakpoint-${k}: ${v};`),
  ...Object.entries(zIndex).map(([k, v]) => `  --ds-z-${k}: ${v};`),
  ...Object.entries(motion.duration).map(([k, v]) => `  --ds-duration-${k}: ${v};`),
  ...Object.entries(motion.easing).map(([k, v]) => `  --ds-ease-${k}: ${v};`),
  '}',
  '',
  '.dark {',
  ...Object.entries(semantic).map(([n, d]) => `  ${cssVar(n)}: ${d.dark};`),
  ...charts.dark.map((hex, i) => `  ${cssVar(`chart-${i + 1}`)}: ${hex};`),
  '}',
  '',
].join('\n');

/* ------------------------------------------------------- contrast reporting */

const srgb = h => h.replace('#', '').match(/../g).map(x => parseInt(x, 16) / 255);
const lin = c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toLin = h => srgb(h).map(lin);
const fromLin = v =>
  '#' + v.map(c => Math.round(Math.max(0, Math.min(1, c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)) * 255).toString(16).padStart(2, '0')).join('');
const lum = h => {
  const [r, g, b] = toLin(h);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const x = lum(a);
  const y = lum(b);
  const [hi, lo] = x > y ? [x, y] : [y, x];
  return (hi + 0.05) / (lo + 0.05);
};

const LMS = [[0.31399022, 0.63951294, 0.04649755], [0.15537241, 0.75789446, 0.08670142], [0.01775239, 0.10944209, 0.87256922]];
const LMSi = [[5.47221206, -4.6419601, 0.16963708], [-1.1252419, 2.29317094, -0.1678952], [0.02980165, -0.19318073, 1.16364789]];
const mul = (m, v) => m.map(r => r.reduce((s, x, i) => s + x * v[i], 0));
const simulate = (hex, kind) => {
  const lms = mul(LMS, toLin(hex));
  const out =
    kind === 'protan'
      ? [lms[0], 1.05118294 * lms[1] - 0.05116099 * lms[2], lms[2]]
      : kind === 'deutan'
        ? [0.9513092 * lms[0] + 0.04866992 * lms[2], lms[1], lms[2]]
        : lms;
  return fromLin(mul(LMSi, out).map(c => Math.max(0, c)));
};
const lab = hex => {
  const [r, g, b] = toLin(hex);
  const X = (0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.95047;
  const Y = 0.2126729 * r + 0.7151522 * g + 0.072175 * b;
  const Z = (0.0193339 * r + 0.119192 * g + 0.9503041 * b) / 1.08883;
  const f = t => (t > 0.008856 ? t ** (1 / 3) : 7.787 * t + 16 / 116);
  return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
};
const deltaE = (a, b) => {
  const A = lab(a);
  const B = lab(b);
  return Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]);
};

const pairs = [
  ['ink on surface', 'ink', 'surface'],
  ['ink-soft on surface', 'ink-soft', 'surface'],
  ['muted on surface', 'muted', 'surface'],
  ['muted on canvas', 'muted', 'canvas'],
  ['faint on surface', 'faint', 'surface'],
  ['faint on canvas', 'faint', 'canvas'],
  ['brand (text) on surface', 'brand', 'surface'],
  ['brand on brand-soft', 'brand', 'brand-soft'],
  ['pink (text) on surface', 'pink', 'surface'],
  ['amber (text) on surface', 'amber', 'surface'],
  ['green (text) on surface', 'green', 'surface'],
  ['red (text) on surface', 'red', 'surface'],
  ['warning (text) on surface', 'warning', 'surface'],
  ['violet (text) on surface', 'violet', 'surface'],
  ['on-brand on brand-fill', 'on-brand', 'brand-fill'],
  ['on-pink on pink-fill', 'on-pink', 'pink-fill'],
  ['on-amber on amber-fill', 'on-amber', 'amber-fill'],
  ['on-green on green-fill', 'on-green', 'green-fill'],
  ['on-red on red-fill', 'on-red', 'red-fill'],
  ['on-warning on warning-fill', 'on-warning', 'warning-fill'],
  ['on-violet on violet-fill', 'on-violet', 'violet-fill'],
];

const fmt = n => n.toFixed(2).padStart(5);
const rows = [];
for (const mode of ['light', 'dark']) {
  rows.push(`\n### ${mode === 'light' ? 'Light' : 'Dark'} mode\n`);
  rows.push('| Pair | Ratio | AA body (4.5) | AA large (3.0) |');
  rows.push('| --- | ---: | :---: | :---: |');
  for (const [label, fg, bg] of pairs) {
    const f = semantic[fg]?.[mode];
    const b = semantic[bg]?.[mode];
    if (!f || !b || !/^#[0-9a-f]{6}$/i.test(f) || !/^#[0-9a-f]{6}$/i.test(b)) continue;
    const r = ratio(f, b);
    rows.push(`| ${label} | ${r.toFixed(2)} | ${r >= 4.5 ? '✓' : '—'} | ${r >= 3 ? '✓' : '—'} |`);
  }
}

const paletteReport = [];
for (const mode of ['light', 'dark']) {
  const set = charts[mode];
  const surface = semantic.surface[mode];
  const minC = Math.min(...set.map(c => ratio(c, surface)));
  paletteReport.push(`- **${mode}** — ${set.length} series · min contrast vs surface ${minC.toFixed(2)}:1`);
  for (const kind of ['protan', 'deutan']) {
    let min = Infinity;
    let worst = '';
    for (let i = 0; i < set.length; i++) {
      for (let j = i + 1; j < set.length; j++) {
        const d = deltaE(simulate(set[i], kind), simulate(set[j], kind));
        if (d < min) {
          min = d;
          worst = `${set[i]} / ${set[j]}`;
        }
      }
    }
    paletteReport.push(`  - ${kind}opia: min ΔE₇₆ ${min.toFixed(1)} (${worst}) — ${min >= 10 ? 'distinct' : 'TOO CLOSE'}`);
  }
}

const contrastMd = `# Unseen — contrast & colour-vision report

Generated by \`scripts/build-tokens.mjs\`. Re-run after changing any colour token.

Ratios use the WCAG 2.2 relative-luminance formula. **AA body** needs 4.5:1,
**AA large** (≥24px, or ≥18.66px bold) needs 3:1. Every foreground listed below
is a *text* token; decorative hues (\`-vivid\`, gradients, chart marks) are excluded
because they never carry text.

${rows.join('\n')}

## Chart palette

Categorical series are checked for pairwise separation under protanopia and
deuteranopia using a Viénot/Brettel LMS simulation and ΔE₇₆ ≥ 10 as the floor.

${paletteReport.join('\n')}

Series are also always paired with a legend label, so colour is never the only
channel.
`;

/* -------------------------------------------------------------------- write */

const tsReport = `/**
 * GENERATED by scripts/build-tokens.mjs — do not edit.
 * Rendered by the Foundations screen so documentation can never drift from
 * the measured values.
 */
export interface ContrastRow {
  pair: string;
  ratio: number;
  body: boolean;
  large: boolean;
}

export const contrastReport: { mode: 'light' | 'dark'; rows: ContrastRow[] }[] = ${JSON.stringify(
  ['light', 'dark'].map(mode => ({
    mode,
    rows: pairs
      .map(([label, fg, bg]) => {
        const f = semantic[fg]?.[mode];
        const b = semantic[bg]?.[mode];
        if (!f || !b || !/^#[0-9a-f]{6}$/i.test(f) || !/^#[0-9a-f]{6}$/i.test(b)) return null;
        const r = ratio(f, b);
        return { pair: label, ratio: Number(r.toFixed(2)), body: r >= 4.5, large: r >= 3 };
      })
      .filter(Boolean),
  })),
  null,
  2,
)};

export const chartReport = ${JSON.stringify(
  ['light', 'dark'].map(mode => {
    const set = charts[mode];
    const surface = semantic.surface[mode];
    const minContrast = Number(Math.min(...set.map(c => ratio(c, surface))).toFixed(2));
    const cvd = Object.fromEntries(
      ['protan', 'deutan'].map(kind => {
        let min = Infinity;
        for (let i = 0; i < set.length; i++)
          for (let j = i + 1; j < set.length; j++) min = Math.min(min, deltaE(simulate(set[i], kind), simulate(set[j], kind)));
        return [kind, Number(min.toFixed(1))];
      }),
    );
    return { mode, series: set.length, minContrast, cvd };
  }),
  null,
  2,
)} as { mode: 'light' | 'dark'; series: number; minContrast: number; cvd: { protan: number; deutan: number } }[];
`;
writeFileSync(resolve(root, 'src/design/contrast-report.ts'), tsReport);

mkdirSync(out(), { recursive: true });
writeFileSync(out('unseen.tokens.json'), JSON.stringify(tokensStudioFile, null, 2) + '\n');
writeFileSync(out('figma-variables.json'), JSON.stringify(figmaVariables, null, 2) + '\n');
writeFileSync(out('unseen.tokens.css'), css);
writeFileSync(out('CONTRAST.md'), contrastMd);

const varCount = figmaVariables.variables.length;
console.log(`tokens/unseen.tokens.json     ${Object.keys(semantic).length} semantic · ${Object.values(ramps).length} ramps`);
console.log(`tokens/figma-variables.json   ${varCount} variables, 2 collections`);
console.log(`tokens/unseen.tokens.css      ${css.split('\n').length} lines`);
console.log(`tokens/CONTRAST.md            ${pairs.length * 2} pairs checked`);

/* Fail the build if any AA body pair regresses. */
const failures = [];
for (const mode of ['light', 'dark']) {
  for (const [label, fg, bg] of pairs) {
    const f = semantic[fg]?.[mode];
    const b = semantic[bg]?.[mode];
    if (!f || !b || !/^#[0-9a-f]{6}$/i.test(f) || !/^#[0-9a-f]{6}$/i.test(b)) continue;
    const r = ratio(f, b);
    if (r < 4.5) failures.push(`${mode}: ${label} = ${r.toFixed(2)}`);
  }
}
if (failures.length) {
  console.error('\nContrast regressions:');
  failures.forEach(f => console.error('  ✗ ' + f));
  process.exitCode = 1;
} else {
  console.log('✓ all text pairs pass AA in both modes');
}
