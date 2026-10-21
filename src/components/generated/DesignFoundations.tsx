import type { ReactNode } from 'react';
import { Paintbrush, Type, ArrowUpRight } from 'lucide-react';
interface ColorToken {
  name: string;
  hex: string;
}
interface SpacingToken {
  name: string;
  value: number;
}
interface RadiusToken {
  name: string;
  value: string;
}
interface TypeToken {
  name: string;
  size: string;
  weight: string;
  tracking?: string;
  sample: string;
}
const primary: ColorToken[] = [{
  name: 'primary-50',
  hex: '#EFF8FF'
}, {
  name: 'primary-100',
  hex: '#DBEFFE'
}, {
  name: 'primary-200',
  hex: '#BAE0FD'
}, {
  name: 'primary-300',
  hex: '#7DCBFC'
}, {
  name: 'primary-400',
  hex: '#38AEFA'
}, {
  name: 'primary-500',
  hex: '#0E91F0'
}, {
  name: 'primary-600',
  hex: '#0272C6'
}, {
  name: 'primary-700',
  hex: '#035B9E'
}, {
  name: 'primary-800',
  hex: '#074E84'
}, {
  name: 'primary-900',
  hex: '#0C3F6B'
}];
const pink: ColorToken[] = [{
  name: 'pink-50',
  hex: '#FFF0F7'
}, {
  name: 'pink-100',
  hex: '#FFE0EF'
}, {
  name: 'pink-200',
  hex: '#FFC0DF'
}, {
  name: 'pink-300',
  hex: '#FF91C1'
}, {
  name: 'pink-400',
  hex: '#FF56A0'
}, {
  name: 'pink-500',
  hex: '#F72685'
}, {
  name: 'pink-600',
  hex: '#E0156E'
}, {
  name: 'pink-700',
  hex: '#BC0C5A'
}, {
  name: 'pink-800',
  hex: '#9D0E4D'
}, {
  name: 'pink-900',
  hex: '#820F43'
}];
const amber: ColorToken[] = [{
  name: 'amber-50',
  hex: '#FFF8ED'
}, {
  name: 'amber-100',
  hex: '#FFEFD3'
}, {
  name: 'amber-200',
  hex: '#FFDBA5'
}, {
  name: 'amber-300',
  hex: '#FFC06D'
}, {
  name: 'amber-400',
  hex: '#FF9A33'
}, {
  name: 'amber-500',
  hex: '#FF7A0D'
}, {
  name: 'amber-600',
  hex: '#F45F03'
}, {
  name: 'amber-700',
  hex: '#CA4806'
}, {
  name: 'amber-800',
  hex: '#A0390C'
}, {
  name: 'amber-900',
  hex: '#83300E'
}];
const gray: ColorToken[] = [{
  name: 'gray-50',
  hex: '#F8F8FA'
}, {
  name: 'gray-100',
  hex: '#F0F0F4'
}, {
  name: 'gray-200',
  hex: '#E4E4EC'
}, {
  name: 'gray-300',
  hex: '#CDCDD9'
}, {
  name: 'gray-400',
  hex: '#A0A0B8'
}, {
  name: 'gray-500',
  hex: '#737390'
}, {
  name: 'gray-600',
  hex: '#575772'
}, {
  name: 'gray-700',
  hex: '#424260'
}, {
  name: 'gray-800',
  hex: '#2E2E4A'
}, {
  name: 'gray-900',
  hex: '#0F0F1E'
}];
const spacing: SpacingToken[] = [{
  name: 'space-1',
  value: 4
}, {
  name: 'space-2',
  value: 8
}, {
  name: 'space-3',
  value: 12
}, {
  name: 'space-4',
  value: 16
}, {
  name: 'space-5',
  value: 20
}, {
  name: 'space-6',
  value: 24
}, {
  name: 'space-8',
  value: 32
}, {
  name: 'space-10',
  value: 40
}, {
  name: 'space-12',
  value: 48
}, {
  name: 'space-16',
  value: 64
}, {
  name: 'space-20',
  value: 80
}, {
  name: 'space-24',
  value: 96
}];
const radii: RadiusToken[] = [{
  name: 'none',
  value: '0px'
}, {
  name: 'sm',
  value: '4px'
}, {
  name: 'md',
  value: '8px'
}, {
  name: 'lg',
  value: '12px'
}, {
  name: 'xl',
  value: '16px'
}, {
  name: '2xl',
  value: '24px'
}, {
  name: 'full',
  value: '9999px'
}];
const typeScale: TypeToken[] = [{
  name: 'Display XL',
  size: '60px',
  weight: '700',
  tracking: '-2px',
  sample: 'Intelligence at scale'
}, {
  name: 'Display L',
  size: '48px',
  weight: '700',
  sample: 'Build smarter AI'
}, {
  name: 'Heading 1',
  size: '36px',
  weight: '700',
  sample: 'Your AI workspace'
}, {
  name: 'Heading 2',
  size: '28px',
  weight: '600',
  sample: 'Model performance'
}, {
  name: 'Heading 3',
  size: '22px',
  weight: '600',
  sample: 'Data insights'
}, {
  name: 'Heading 4',
  size: '18px',
  weight: '600',
  sample: 'Active sessions'
}, {
  name: 'Body Large',
  size: '16px',
  weight: '400',
  sample: 'The model processes natural language inputs...'
}, {
  name: 'Body Medium',
  size: '14px',
  weight: '400',
  sample: 'Configure your API endpoints and rate limits'
}, {
  name: 'Body Small',
  size: '12px',
  weight: '400',
  sample: 'Last updated 2 minutes ago'
}, {
  name: 'Label',
  size: '11px',
  weight: '600',
  tracking: '0.08em',
  sample: 'TOKEN USAGE'
}];
const elevations = [{
  name: 'shadow-xs',
  css: '0 1px 2px rgba(15,15,30,.05)',
  className: 'shadow-[0_1px_2px_rgba(15,15,30,.05)]'
}, {
  name: 'shadow-sm',
  css: '0 2px 5px rgba(15,15,30,.08)',
  className: 'shadow-[0_2px_5px_rgba(15,15,30,.08)]'
}, {
  name: 'shadow-md',
  css: '0 8px 16px rgba(15,15,30,.10)',
  className: 'shadow-[0_8px_16px_rgba(15,15,30,.10)]'
}, {
  name: 'shadow-lg',
  css: '0 14px 28px rgba(15,15,30,.13)',
  className: 'shadow-[0_14px_28px_rgba(15,15,30,.13)]'
}, {
  name: 'shadow-xl',
  css: '0 22px 44px rgba(14,145,240,.18)',
  className: 'shadow-[0_22px_44px_rgba(14,145,240,.18)]'
}];
function SectionHeader({
  icon,
  eyebrow,
  title,
  note
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  note: string;
}) {
  return <header className="mb-7 flex items-end justify-between gap-6">
      <div>
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#E4E4EC] bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.12em] text-[#737390]">{eyebrow}</span>
        <h2 className="flex items-center gap-2 text-[28px] font-bold tracking-[-.03em] text-[#0F0F1E]">{title} <span className="text-[#0E91F0]">{icon}</span></h2>
      </div>
      <p className="hidden max-w-[280px] text-right text-xs leading-5 text-[#737390] md:block">{note}</p>
    </header>;
}
function SwatchRow({
  label,
  tokens
}: {
  label: string;
  tokens: ColorToken[];
}) {
  return <div className="mb-6">
      <div className="mb-3 flex items-center gap-2"><span className="text-xs font-semibold uppercase tracking-[.12em] text-[#575772]">{label}</span><span className="h-px flex-1 bg-[#E8E8EC]" /></div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-10">
        {tokens.map(token => <div key={token.name} className="group min-w-0"><div className="h-[72px] rounded-lg border border-black/5 transition-transform duration-200 group-hover:-translate-y-1" style={{
          backgroundColor: token.hex
        }} /><p className="mt-2 truncate text-[10px] font-semibold text-[#424260]">{token.name}</p><p className="text-[10px] text-[#A0A0B8]">{token.hex}</p></div>)}
      </div>
    </div>;
}
export function DesignFoundations() {
  return <main style={{
    backgroundImage: 'radial-gradient(#E4E4EC 0.7px, transparent 0.7px)',
    backgroundSize: '20px 20px'
  }} className="min-h-screen bg-[#F8F8FA] px-5 py-6 font-sans text-[#0F0F1E] sm:px-8 lg:px-14 lg:py-10">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-14 flex flex-col justify-between gap-8 border-b border-[#E4E4EC] pb-10 lg:flex-row lg:items-end">
          <div><span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#BAE0FD] bg-[#EFF8FF] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.1em] text-[#0272C6]"><span className="h-1.5 w-1.5 rounded-full bg-[#0E91F0]" />Design System v1.0</span><h1 className="text-5xl font-bold tracking-[-.055em] text-[#0F0F14] sm:text-7xl">Foundations</h1><p className="mt-4 text-base text-[#737390]">Core visual language for AI product interfaces</p></div>
          <nav aria-label="Design system categories" className="flex flex-wrap gap-2 lg:max-w-[360px] lg:justify-end"><span className="rounded-full bg-[#0F0F1E] px-3 py-2 text-xs font-medium text-white">Colors</span><span className="rounded-full border border-[#E4E4EC] bg-white px-3 py-2 text-xs text-[#575772]">Typography</span><span className="rounded-full border border-[#E4E4EC] bg-white px-3 py-2 text-xs text-[#575772]">Spacing</span><span className="rounded-full border border-[#E4E4EC] bg-white px-3 py-2 text-xs text-[#575772]">Grid</span></nav>
        </div>

        <section className="mb-10 rounded-2xl border border-[#E8E8EC] bg-white p-6 shadow-[0_8px_30px_rgba(15,15,30,.04)] sm:p-8 lg:p-10" aria-labelledby="colors-heading">
          <SectionHeader icon={<Paintbrush size={20} strokeWidth={1.8} />} eyebrow="Core palette" title="Color Palette" note="Vivid, accessible color families designed to bring intelligence and energy to every surface." />
          <h2 id="colors-heading" className="sr-only">Color Palette</h2>
          <SwatchRow label="Primary / blue-cyan" tokens={primary} /><SwatchRow label="Accent / pink-magenta" tokens={pink} /><SwatchRow label="Accent / orange-amber" tokens={amber} /><SwatchRow label="Neutral / gray" tokens={gray} />
          <div className="mt-9 grid gap-8 border-t border-[#E8E8EC] pt-8 lg:grid-cols-[1fr_1.3fr]">
            <div><div className="mb-4 flex items-center gap-2"><span className="text-xs font-semibold uppercase tracking-[.12em] text-[#575772]">Semantic colors</span><span className="h-px flex-1 bg-[#E8E8EC]" /></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[{
                name: 'Success',
                hex: '#22C55E'
              }, {
                name: 'Error',
                hex: '#EF4444'
              }, {
                name: 'Warning',
                hex: '#F59E0B'
              }, {
                name: 'Info',
                hex: '#3B82F6'
              }].map(item => <div key={item.name} className="rounded-xl border border-[#E8E8EC] p-3"><span className="mb-3 block h-8 rounded-md" style={{
                  backgroundColor: item.hex
                }} /><strong className="block text-xs text-[#2E2E4A]">{item.name}</strong><span className="text-[10px] text-[#A0A0B8]">{item.hex}</span></div>)}</div></div>
            <div><div className="mb-4 flex items-center gap-2"><span className="text-xs font-semibold uppercase tracking-[.12em] text-[#575772]">Gradient tokens</span><span className="h-px flex-1 bg-[#E8E8EC]" /></div><div className="space-y-3">{[{
                name: 'gradient-primary',
                value: 'linear-gradient(90deg, #38AEFA, #0272C6)'
              }, {
                name: 'gradient-accent',
                value: 'linear-gradient(90deg, #FF56A0, #F72685)'
              }, {
                name: 'gradient-vivid',
                value: 'linear-gradient(90deg, #38AEFA, #F72685, #FF9A33)'
              }].map(gradient => <div key={gradient.name} className="flex items-center gap-3"><span className="h-9 flex-1 rounded-lg" style={{
                  background: gradient.value
                }} /><code className="w-[120px] text-right text-[10px] text-[#737390]">{gradient.name}</code></div>)}</div></div>
          </div>
        </section>

        <section className="mb-10 grid gap-10 lg:grid-cols-[1.45fr_.75fr]" aria-labelledby="type-heading">
          <div className="rounded-2xl border border-[#E8E8EC] bg-white p-6 shadow-[0_8px_30px_rgba(15,15,30,.04)] sm:p-8"><SectionHeader icon={<Type size={20} strokeWidth={1.8} />} eyebrow="System hierarchy" title="Type Scale" note="A clear typographic rhythm for expressive AI experiences." /><h2 id="type-heading" className="sr-only">Type Scale</h2><div className="divide-y divide-[#F0F0F4]">{typeScale.map(item => <div key={item.name} className="grid grid-cols-[92px_1fr] items-baseline gap-4 py-4 sm:grid-cols-[120px_1fr_150px]"><span className="text-[10px] font-semibold uppercase tracking-[.08em] text-[#A0A0B8]">{item.name}</span><p className="truncate text-[#0F0F1E]" style={{
                fontSize: `clamp(${Math.min(parseInt(item.size), 24)}px, ${Math.min(parseInt(item.size) / 10, 3)}vw, ${item.size})`,
                fontWeight: item.weight,
                letterSpacing: item.tracking
              }}>{item.sample}</p><span className="hidden text-right font-mono text-[10px] text-[#A0A0B8] sm:block">{item.size} / {item.weight}</span></div>)}</div></div>
          <aside className="flex flex-col justify-between rounded-2xl bg-[#0F0F1E] p-7 text-white"><div><span className="text-[10px] font-bold uppercase tracking-[.15em] text-[#7DCBFC]">Font details</span><h3 className="mt-5 text-3xl font-bold tracking-[-.04em]">Inter</h3><p className="mt-3 text-sm leading-6 text-[#A0A0B8]">Neutral, precise, and engineered for legibility across product surfaces.</p></div><dl className="mt-10 space-y-4 border-t border-white/10 pt-5 text-xs"><div className="flex justify-between"><dt className="text-[#A0A0B8]">Heading tracking</dt><dd>-0.02em</dd></div><div className="flex justify-between"><dt className="text-[#A0A0B8]">Body line-height</dt><dd>1.6</dd></div><div className="flex justify-between"><dt className="text-[#A0A0B8]">Font weights</dt><dd>400 — 700</dd></div></dl></aside>
        </section>

        <section className="mb-10 rounded-2xl border border-[#E8E8EC] bg-white p-6 shadow-[0_8px_30px_rgba(15,15,30,.04)] sm:p-8 lg:p-10" aria-labelledby="spacing-heading"><SectionHeader icon={<span className="text-base">↔</span>} eyebrow="Layout rhythm" title="Spacing Scale" note="A generous, predictable rhythm that keeps interfaces calm and scannable." /><h2 id="spacing-heading" className="sr-only">Spacing Scale</h2><div className="overflow-x-auto pb-4"><div className="flex min-w-[840px] items-end gap-3">{spacing.map(item => <div key={item.name} className="flex w-14 flex-col items-center"><div className="w-full rounded-t-md bg-gradient-to-t from-[#0272C6] to-[#38AEFA]" style={{
                height: `${Math.max(item.value * .62, 8)}px`
              }} /><span className="mt-2 text-[10px] font-semibold text-[#424260]">{item.name}</span><span className="text-[10px] text-[#A0A0B8]">{item.value}px</span></div>)}</div></div><div className="mt-8 border-t border-[#E8E8EC] pt-8"><div className="mb-4 flex items-center gap-2"><span className="text-xs font-semibold uppercase tracking-[.12em] text-[#575772]">Border radius</span><span className="h-px flex-1 bg-[#E8E8EC]" /></div><div className="flex flex-wrap items-end gap-5">{radii.map(item => <div key={item.name} className="text-center"><div className="h-12 w-12 bg-gradient-to-br from-[#38AEFA] to-[#0272C6]" style={{
                borderRadius: item.value
              }} /><p className="mt-2 text-[10px] font-semibold text-[#424260]">{item.name}</p><p className="text-[10px] text-[#A0A0B8]">{item.value}</p></div>)}</div></div></section>

        <section className="mb-14 rounded-2xl border border-[#E8E8EC] bg-white p-6 shadow-[0_8px_30px_rgba(15,15,30,.04)] sm:p-8 lg:p-10" aria-labelledby="elevation-heading"><SectionHeader icon={<ArrowUpRight size={20} strokeWidth={1.8} />} eyebrow="Depth & layering" title="Elevation" note="Subtle depth cues help users understand what is actionable and what is foundational." /><h2 id="elevation-heading" className="sr-only">Elevation</h2><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{elevations.map(item => <div key={item.name} className={`flex min-h-[150px] flex-col justify-between rounded-xl border border-[#E8E8EC] bg-white p-5 ${item.className}`}><div className="h-2 w-2 rounded-full bg-[#38AEFA]" /><div><strong className="block text-sm text-[#2E2E4A]">{item.name}</strong><code className="mt-2 block text-[9px] leading-4 text-[#A0A0B8]">{item.css}</code></div></div>)}</div></section>
        <footer className="border-t border-[#E4E4EC] py-7 text-center text-xs text-[#A0A0B8]">AI Design System v1.0 · Built with Kigen + AlignUI reference quality</footer>
      </div>
    </main>;
}