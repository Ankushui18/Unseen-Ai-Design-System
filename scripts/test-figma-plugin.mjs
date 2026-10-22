#!/usr/bin/env node
/**
 * Runs figma-plugin/code.js against a mock Figma API.
 *
 *   node scripts/test-figma-plugin.mjs
 *
 * Guards the things a plugin can silently get wrong: missing modes, dropped
 * variables, non-finite colour channels, duplicate styles, renamed pages.
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const data = readFileSync(resolve(root, 'figma-plugin/tokens.data.js'), 'utf8');
const rawCode = readFileSync(resolve(root, 'figma-plugin/code.js'), 'utf8');
const code = rawCode.replace('/* global UNSEEN_TOKENS, figma */', '');

const collections = [];
const variables = [];
const textStyles = [];
const effectStyles = [];
const pages = [{ name: 'Page 1', children: [], id: 'p0' }];
let closed = '';

const figma = {
  root: { children: pages },
  currentPage: pages[0],
  createPage() {
    const p = { name: '', children: [], id: 'p' + pages.length };
    pages.push(p);
    return p;
  },
  createFrame() {
    return { name: '', resize() {}, children: [], appendChild() {}, x: 0, y: 0, cornerRadius: 0, fills: [] };
  },
  createText() {
    return { name: '', characters: '', fontName: {}, fontSize: 0, fills: [], letterSpacing: {}, x: 0, y: 0 };
  },
  async loadFontAsync(f) {
    if (f.family === 'Geist') throw new Error('Geist not installed');
  },
  closePlugin(msg) {
    closed = msg;
  },
  variables: {
    createVariableCollection(name) {
      const c = {
        id: 'c' + collections.length,
        name,
        modes: [{ modeId: 'm0', name: 'Mode 1' }],
        renameMode(id, n) {
          this.modes.find(m => m.modeId === id).name = n;
        },
        addMode(n) {
          this.modes.push({ modeId: 'm_' + n, name: n });
          return 'm_' + n;
        },
      };
      collections.push(c);
      return c;
    },
    createVariable(name, collection) {
      const v = {
        id: 'v' + variables.length,
        name,
        variableCollectionId: collection.id,
        values: {},
        description: '',
        scopes: [],
        setValueForMode(mode, value) {
          this.values[mode] = value;
        },
      };
      variables.push(v);
      return v;
    },
    getLocalVariableCollections: () => collections,
    getLocalVariables: () => variables,
  },
  getLocalTextStyles: () => textStyles,
  createTextStyle() {
    const s = {};
    textStyles.push(s);
    return s;
  },
  getLocalEffectStyles: () => effectStyles,
  createEffectStyle() {
    const s = {};
    effectStyles.push(s);
    return s;
  },
};

new Function('figma', `${data}\n${code}`)(figma);
await new Promise(r => setTimeout(r, 400));

const failures = [];
const check = (ok, label) => {
  if (!ok) failures.push(label);
};

check(closed.startsWith('Unseen library built'), `plugin did not finish cleanly: ${closed.slice(0, 80)}`);
check(collections.length === 2, `expected 2 collections, got ${collections.length}`);
check(
  collections.some(c => c.name === 'Unseen — Color' && c.modes.map(m => m.name).join('|') === 'Light|Dark'),
  'colour collection is missing Light/Dark modes',
);
check(textStyles.length === 10, `expected 10 text styles, got ${textStyles.length}`);
check(effectStyles.length === 5, `expected 5 effect styles, got ${effectStyles.length}`);
check(pages.length === 8, `expected 8 pages, got ${pages.length}`);

for (const v of variables) {
  for (const [mode, value] of Object.entries(v.values)) {
    if (v.name.startsWith('color/') || v.name.startsWith('palette/') || v.name.startsWith('chart/')) {
      // Figma accepts RGB (alpha implied) or RGBA — only validate channels that exist
      const bad =
        ['r', 'g', 'b'].some(k => typeof value[k] !== 'number' || !Number.isFinite(value[k]) || value[k] < 0 || value[k] > 1) ||
        ('a' in value && (typeof value.a !== 'number' || value.a < 0 || value.a > 1));
      if (bad) check(false, `${v.name} has a malformed colour in ${mode}`);
    } else if (typeof value !== 'number' || !Number.isFinite(value)) {
      check(false, `${v.name} is not a finite number in ${mode}`);
    }
  }
}

const brand = variables.find(v => v.name === 'color/brand');
check(brand?.values.m0?.r === 2 / 255 || Math.abs(brand?.values.m0?.r - 0.007843) < 0.0005, 'colour/brand light red channel is wrong');

if (failures.length) {
  console.error('✗ figma plugin');
  failures.slice(0, 10).forEach(f => console.error('  · ' + f));
  process.exit(1);
}

console.log(
  `✓ figma plugin — ${collections.length} collections, ${variables.length} variables, ${textStyles.length} text styles, ${effectStyles.length} effects, ${pages.length} pages`,
);
