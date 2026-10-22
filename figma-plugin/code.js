// Unseen — Figma library builder
// ---------------------------------------------------------------------------
// Creates the variable collections, all variables, text styles, effect styles
// and the page skeleton. Idempotent: run it again after a token change and it
// updates values in place instead of duplicating anything.
//
// Install: Figma desktop → Plugins → Development → Import plugin from manifest
//          → pick figma-plugin/manifest.json. Then run "Unseen — Build library".
// ---------------------------------------------------------------------------

/* global UNSEEN_TOKENS, figma */

const DATA = UNSEEN_TOKENS;
const COLOR_COLLECTION = 'Unseen — Color';
const SCALE_COLLECTION = 'Unseen — Scale';
const PAGES = [
  '00 · Cover',
  '01 · Foundations/Color',
  '02 · Foundations/Type',
  '03 · Foundations/Shape',
  '04 · Components',
  '05 · Patterns',
  '06 · Screens',
  '07 · Handoff',
];

/* ------------------------------------------------------------------ helpers */

const rgb = c => ({ r: c.r, g: c.g, b: c.b });
const camel = s =>
  s
    .replace(/[^a-zA-Z0-9/ ]/g, '')
    .split(/[\s/]+/)
    .map((part, i) => (i === 0 ? part.toLowerCase() : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()))
    .join('');

const weightToFont = w => {
  const name = { 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold' }[w] ?? 'Regular';
  return { family: 'Geist', style: name };
};

/** Geist may not be installed; fall back to Inter so the run never hard-fails. */
let FONT = { family: 'Geist', style: 'Regular' };
const resolved = new Map();

async function resolveFont(weight) {
  const want = weightToFont(weight);
  const key = `${want.family}/${want.style}`;
  if (resolved.has(key)) return resolved.get(key);
  let out = want;
  try {
    await figma.loadFontAsync(want);
  } catch {
    out = { family: 'Inter', style: want.style === 'ExtraBold' ? 'ExtraBold' : want.style };
    try {
      await figma.loadFontAsync(out);
    } catch {
      out = { family: 'Inter', style: 'Regular' };
      await figma.loadFontAsync(out);
    }
  }
  resolved.set(key, out);
  return out;
}

async function getOrCreateCollection(name, modeNames) {
  const existing = figma.variables.getLocalVariableCollections().find(c => c.name === name);
  if (existing) {
    // add any missing modes
    for (const m of modeNames) if (!existing.modes.some(x => x.name === m)) existing.addMode(m);
    return existing;
  }
  const collection = figma.variables.createVariableCollection(name);
  // the first mode is created automatically and is called "Mode 1"
  collection.renameMode(collection.modes[0].modeId, modeNames[0]);
  for (const m of modeNames.slice(1)) collection.addMode(m);
  return collection;
}

function modeId(collection, name) {
  const found = collection.modes.find(m => m.name === name);
  if (!found) throw new Error(`Mode "${name}" missing on ${collection.name}`);
  return found.modeId;
}

/* -------------------------------------------------------------- build steps */

async function buildColorVariables() {
  const collection = await getOrCreateCollection(COLOR_COLLECTION, DATA.modes);
  const light = modeId(collection, 'Light');
  const dark = modeId(collection, 'Dark');
  const existing = new Map(
    figma.variables
      .getLocalVariables()
      .filter(v => v.variableCollectionId === collection.id)
      .map(v => [v.name, v]),
  );

  let created = 0;
  let updated = 0;
  for (const token of DATA.colors) {
    let variable = existing.get(token.name);
    if (!variable) {
      variable = figma.variables.createVariable(token.name, collection, 'COLOR');
      created++;
    } else {
      updated++;
    }
    variable.description = token.description ?? '';
    variable.scopes = token.name.startsWith('palette/') ? ['ALL_FILLS', 'STROKE_COLOR'] : ['ALL_SCOPES'];
    variable.setValueForMode(light, rgb(token.light));
    variable.setValueForMode(dark, rgb(token.dark));
  }
  return { created, updated, total: DATA.colors.length };
}

function buildScaleVariables() {
  const collection = figma.variables.getLocalVariableCollections().find(c => c.name === SCALE_COLLECTION);
  const target =
    collection ??
    (() => {
      const c = figma.variables.createVariableCollection(SCALE_COLLECTION);
      c.renameMode(c.modes[0].modeId, 'Default');
      return c;
    })();
  const mode = modeId(target, 'Default');
  const existing = new Map(
    figma.variables
      .getLocalVariables()
      .filter(v => v.variableCollectionId === target.id)
      .map(v => [v.name, v]),
  );

  let created = 0;
  for (const token of DATA.scale) {
    let variable = existing.get(token.name);
    if (!variable) {
      variable = figma.variables.createVariable(token.name, target, 'FLOAT');
      created++;
    }
    variable.description = token.description ?? '';
    variable.setValueForMode(mode, token.value);
  }
  return { created, total: DATA.scale.length };
}

async function buildTextStyles() {
  const existing = new Map(figma.getLocalTextStyles().map(s => [s.name, s]));
  let created = 0;

  for (const t of DATA.typography) {
    const style = existing.get(`Unseen/${t.name}`) ?? figma.createTextStyle();
    if (!existing.has(`Unseen/${t.name}`)) created++;
    style.name = `Unseen/${t.name}`;
    const font = await resolveFont(t.weight);
    style.fontName = font;
    style.fontSize = parseFloat(t.size);
    const lh = parseFloat(String(t.lineHeight));
    style.lineHeight =
      String(t.lineHeight).includes('%') || lh > 4
        ? { unit: 'PIXELS', value: lh }
        : { unit: 'PERCENT', value: Math.round(lh * 100) };
    const tracking = parseFloat(t.tracking);
    style.letterSpacing = { unit: 'PERCENT', value: Number.isFinite(tracking) ? tracking * 100 : 0 };
    style.description = `${t.size} / ${t.lineHeight} · weight ${t.weight}`;
  }
  return { created, total: DATA.typography.length };
}

function buildEffectStyles() {
  const existing = new Map(figma.getLocalEffectStyles().map(s => [s.name, s]));
  let created = 0;
  for (const s of DATA.shadows) {
    const style = existing.get(`Unseen/${s.name}`) ?? figma.createEffectStyle();
    if (!existing.has(`Unseen/${s.name}`)) created++;
    style.name = `Unseen/${s.name}`;
    style.effects = [dropShadowFromCss(s.value)];
  }
  return { created, total: DATA.shadows.length };
}

/** Parse the first `0 Xpx Ypx rgba(...)` / hex shadow in a CSS shadow string. */
function dropShadowFromCss(css) {
  const match = /(-?\d+(?:\.\d+)?)px\s+(-?\d+(?:\.\d+)?)px\s+(-?\d+(?:\.\d+)?)px\s+(rgba?\([^)]+\)|#[0-9a-f]{3,8})/i.exec(css);
  if (!match) {
    return { type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.12 }, offset: { x: 0, y: 8 }, radius: 24, visible: true, blendMode: 'NORMAL' };
  }
  const [, x, y, blur, color] = match;
  return {
    type: 'DROP_SHADOW',
    color: parseColor(color),
    offset: { x: parseFloat(x), y: parseFloat(y) },
    radius: parseFloat(blur),
    spread: 0,
    visible: true,
    blendMode: 'NORMAL',
  };
}

function parseColor(value) {
  if (value.startsWith('#')) {
    const hex = value.replace('#', '');
    const full = hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex.slice(0, 6);
    return {
      r: parseInt(full.slice(0, 2), 16) / 255,
      g: parseInt(full.slice(2, 4), 16) / 255,
      b: parseInt(full.slice(4, 6), 16) / 255,
      a: 1,
    };
  }
  const nums = value.replace(/rgba?\(|\)/g, '').split(',').map(v => parseFloat(v.trim()));
  return { r: nums[0] / 255, g: nums[1] / 255, b: nums[2] / 255, a: nums[3] ?? 1 };
}

function buildPages() {
  let created = 0;
  const first = figma.currentPage;
  if (!first.name.startsWith('00 ·')) {
    first.name = PAGES[0];
  }
  for (const name of PAGES.slice(1)) {
    if (!figma.root.children.some(p => p.name === name)) {
      const page = figma.createPage();
      page.name = name;
      created++;
    }
  }
  return { created, total: PAGES.length };
}

/** Cover page content, so the file is not blank on first open. */
async function buildCover() {
  const page = figma.root.children.find(p => p.name === PAGES[0]);
  if (!page) return { skipped: true };
  if (page.children.some(n => n.name === 'Unseen · Cover')) return { skipped: true };

  figma.currentPage = page;
  const frame = figma.createFrame();
  frame.name = 'Unseen · Cover';
  frame.resize(1200, 720);
  frame.x = 0;
  frame.y = 0;
  frame.fills = [{ type: 'SOLID', color: { r: 0.027, g: 0.027, b: 0.051 } }];
  frame.cornerRadius = 24;

  const title = figma.createText();
  title.fontName = await resolveFont(800);
  title.characters = 'Unseen';
  title.fontSize = 96;
  title.fills = [{ type: 'SOLID', color: { r: 0.957, g: 0.961, b: 0.98 } }];
  title.letterSpacing = { unit: 'PERCENT', value: -4 };
  title.x = 64;
  title.y = 88;
  frame.appendChild(title);

  const sub = figma.createText();
  sub.fontName = await resolveFont(400);
  sub.characters = 'AI design system · 111 components · 20 screens · light + dark';
  sub.fontSize = 20;
  sub.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.68 } }];
  sub.x = 64;
  sub.y = 200;
  frame.appendChild(sub);

  const note = figma.createText();
  note.fontName = await resolveFont(400);
  note.characters =
    'Variables: Unseen — Color (Light / Dark) and Unseen — Scale.\nText styles: Unseen/*. Effect styles: Unseen/shadow/*.\nSource of truth: tokens/unseen.tokens.json · docs/figma-handoff.md';
  note.fontSize = 14;
  note.fills = [{ type: 'SOLID', color: { r: 0.45, g: 0.45, b: 0.55 } }];
  note.x = 64;
  note.y = 260;
  frame.appendChild(note);

  return { created: true };
}

/* -------------------------------------------------------------------- main */

async function main() {
  const steps = [];
  try {
    steps.push(['Color variables', await buildColorVariables()]);
    steps.push(['Scale variables', buildScaleVariables()]);
    steps.push(['Text styles', await buildTextStyles()]);
    steps.push(['Effect styles', buildEffectStyles()]);
    steps.push(['Pages', buildPages()]);
    steps.push(['Cover', await buildCover()]);

    const summary = steps.map(([label, r]) => `${label}: ${r.created ?? 0} created${r.total ? ` / ${r.total}` : ''}`).join('\n');
    figma.closePlugin(`Unseen library built\n\n${summary}\n\nNext: bind components to these variables (see docs/figma-handoff.md §5).`);
  } catch (error) {
    figma.closePlugin(`Unseen build failed: ${error.message}`);
  }
}

main();
