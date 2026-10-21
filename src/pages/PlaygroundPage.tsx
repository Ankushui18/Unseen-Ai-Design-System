import { useState } from 'react';
import { ArrowUp, Check, CircleStop, Copy, Play, Plus, Save, Sparkles, Wrench, X } from 'lucide-react';
import { PageHeader, Section, SurfacePanel } from '../components/layout/Page';
import { Button, IconButton } from '../components/ui/Button';
import { Badge, GradientBadge, Kbd, StatusDot } from '../components/ui/Badge';
import { Checkbox, Segmented, Slider, Switch } from '../components/ui/Controls';
import { Field, Input, Select } from '../components/ui/Field';
import { CodeBlock, PromptVariable, TypingDots } from '../components/ui/AI';
import { ConfidenceMeter, PromptCard, RunTrace, ToolCallCard, TokenCounter } from '../components/ui/AIExtra';
import { KeyValue } from '../components/ui/DataDisplay';
import { OptionCards } from '../components/ui/Advanced';
import { cn } from '@/lib/utils';

const promptLibrary = [
  { title: 'Support triage', description: 'Classifies a ticket, assigns a queue and drafts a first reply with citations.', model: 'GPT-4o', uses: '18.4K', tags: ['support', 'rag'] },
  { title: 'Revenue digest', description: 'Summarises weekly billing changes per workspace with deltas and risk callouts.', model: 'Claude 3.5', uses: '6.1K', tags: ['analytics'] },
  { title: 'SQL explainer', description: 'Turns a slow query plan into a plain-English diagnosis plus an index suggestion.', model: 'GPT-4o', uses: '3.9K', tags: ['dev'] },
  { title: 'Churn risk scan', description: 'Scores accounts from usage telemetry and lists the three strongest signals.', model: 'Llama 3.1', uses: '1.2K', tags: ['growth'] },
];

export function PlaygroundPage() {
  const [mode, setMode] = useState<'single' | 'compare'>('compare');
  const [draft, setDraft] = useState('Explain why streaming latency regressed after the router change, and give me the two safest mitigations.');
  const [running, setRunning] = useState(false);
  const [ranA, setRanA] = useState(true);
  const [ranB, setRanB] = useState(false);
  const [temperature, setTemperature] = useState(30);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [jsonMode, setJsonMode] = useState(false);
  const [tools, setTools] = useState(true);
  const [toolTarget, setToolTarget] = useState<'web' | 'db' | 'none'>('db');

  const run = () => {
    setRunning(true);
    setRanA(true);
    setRanB(false);
    window.setTimeout(() => {
      setRanB(true);
      setRunning(false);
    }, 1200);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Product screen · playground"
        title="Playground"
        description="Evaluate prompts against two models side by side, inspect tool calls and token cost, then save the winner as a preset."
        meta={
          <>
            <Badge tone="brand" variant="soft"><Sparkles className="h-3 w-3" /> A/B compare</Badge>
            <Badge tone="neutral" variant="outline">Tool calling</Badge>
            <Badge tone="neutral" variant="outline">JSON mode</Badge>
          </>
        }
        actions={
          <>
            <Segmented
              value={mode}
              onChange={setMode}
              size="sm"
              options={[
                { value: 'single', label: 'Single' },
                { value: 'compare', label: 'Compare' },
              ]}
            />
            <Button variant="secondary" iconLeft={<Save className="h-4 w-4" />}>Save preset</Button>
            <Button onClick={run} loading={running} iconLeft={<Play className="h-4 w-4" />}>Run</Button>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
        <div className="min-w-0 space-y-4">
          <Section index="01" title="Prompt" description="Shared across both runs" aside={<span className="font-mono text-[10px] text-faint">~412 tokens</span>}>
            <div className="rounded-lg border border-line bg-surface-2 p-3">
              <div className="mb-2 flex flex-wrap items-center gap-1.5">
                <PromptVariable name="workspace" value="production" />
                <PromptVariable name="range" value="24h" />
                <PromptVariable name="model" value="both" />
                <button className="ml-auto inline-flex items-center gap-1 rounded-sm bg-surface px-1.5 py-0.5 text-[9.5px] font-medium text-muted shadow-xs transition hover:text-ink">
                  <Plus className="h-2.5 w-2.5" /> variable
                </button>
              </div>
              <textarea
                value={draft}
                onChange={e => setDraft(e.target.value)}
                rows={4}
                className="w-full resize-none bg-transparent font-mono text-[11.5px] leading-6 text-ink outline-none placeholder:text-faint"
              />
              <div className="mt-2 flex items-center gap-2 border-t border-line pt-2">
                <Button size="xs" iconRight={<ArrowUp className="h-3 w-3" />} onClick={run}>Run both</Button>
                {running && <Button size="xs" variant="secondary" iconLeft={<CircleStop className="h-3 w-3" />} onClick={() => setRunning(false)}>Stop</Button>}
                <span className="ml-auto hidden items-center gap-1 text-[9.5px] text-faint sm:flex">
                  <Kbd>⌘</Kbd><Kbd>⏎</Kbd> run
                </span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Be concise', 'Show your reasoning', 'Cite sources', 'Return JSON'].map(chip => (
                <button key={chip} className="rounded-full border border-line bg-surface px-2.5 py-1 text-[10px] font-medium text-muted transition hover:border-brand/40 hover:bg-brand-soft hover:text-brand">
                  {chip}
                </button>
              ))}
            </div>
          </Section>

          <div className={cn('grid gap-4', mode === 'compare' ? 'lg:grid-cols-2' : '')}>
            {[
              {
                id: 'A',
                model: 'GPT-4o',
                provider: 'OpenAI',
                tone: 'brand',
                ran: ranA,
                latency: '1.2s',
                cost: '$0.0042',
                tokens: '812',
                answer:
                  'Latency regressed because the router shifted 18% of streaming traffic to eu-central, where the buffering proxy adds a round trip. Two safe mitigations: (1) pin streaming to us-east-1 while keeping non-streaming weighted, then re-test after 30 minutes; (2) lower the proxy buffer window from 200ms to 50ms so first-token latency recovers. Both are reversible and need no model change.',
              },
              {
                id: 'B',
                model: 'Claude 3.5',
                provider: 'Anthropic',
                tone: 'pink',
                ran: ranB,
                latency: '1.6s',
                cost: '$0.0031',
                tokens: '694',
                answer:
                  'The regression tracks the router change: p95 for streaming completions rose from 412ms to 470ms while non-streaming stayed flat. Safest mitigations are to revert the eu-central weight to 0 for streaming traffic, and to enable early-flush on the proxy so tokens reach the client sooner.',
              },
            ].map(runResult => (
              <div key={runResult.id} className="overflow-hidden rounded-xl border border-line bg-surface shadow-xs">
                <div className="flex items-center gap-2 border-b border-line px-3 py-2.5">
                  <span
                    className={cn(
                      'grid h-6 w-6 place-items-center rounded-md font-mono text-[9px] font-bold text-white',
                      runResult.tone === 'brand' ? 'bg-[linear-gradient(135deg,#38AEFA,#0272C6)]' : 'bg-[linear-gradient(135deg,#FF56A0,#F72685)]',
                    )}
                  >
                    {runResult.id}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-ink">
                      {runResult.model}
                      {runResult.ran && <Check className="h-3 w-3 text-success" strokeWidth={3} />}
                    </div>
                    <div className="font-mono text-[9px] text-faint">{runResult.provider}</div>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <IconButton label={`Copy ${runResult.id}`} size="xs" variant="ghost"><Copy className="h-3 w-3" /></IconButton>
                    <IconButton label={`Promote ${runResult.id}`} size="xs" variant="ghost"><Plus className="h-3 w-3" /></IconButton>
                  </div>
                </div>

                <div className="min-h-[168px] p-3">
                  {running && runResult.id === 'B' ? (
                    <div className="flex items-center gap-2 text-[11px] text-muted">
                      <TypingDots /> generating…
                    </div>
                  ) : runResult.ran ? (
                    <p className="text-[11.5px] leading-6 text-ink-soft">{runResult.answer}</p>
                  ) : (
                    <div className="grid h-[140px] place-items-center rounded-md border border-dashed border-line-strong">
                      <span className="text-[10.5px] text-faint">Run to compare {runResult.model}</span>
                    </div>
                  )}
                </div>

                {runResult.ran && (
                  <div className="space-y-2 border-t border-line bg-surface-2/60 px-3 py-2.5">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[9px] text-faint">
                      <span>{runResult.latency}</span>
                      <span>{runResult.tokens} tok</span>
                      <span>{runResult.cost}</span>
                      <span className="ml-auto inline-flex items-center gap-1 text-success"><StatusDot tone="success" /> 200</span>
                    </div>
                    <ConfidenceMeter value={runResult.id === 'A' ? 0.86 : 0.79} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <Section index="02" title="Trace" description="Model A · observable run">
            <div className="grid gap-4 lg:grid-cols-2">
              <SurfacePanel label="Steps">
                <RunTrace
                  steps={[
                    { id: '1', label: 'Prompt compiled', kind: 'llm', duration: '12ms', tokens: '412' },
                    { id: '2', label: 'metrics.query(24h)', kind: 'tool', duration: '84ms' },
                    { id: '3', label: 'Guardrail: prompt injection', kind: 'guard', duration: '3ms' },
                    { id: '4', label: 'gpt-4o completion', kind: 'llm', duration: '1.1s', tokens: '400' },
                    { id: '5', label: 'Citation resolver', kind: 'tool', duration: '22ms', status: 'warn' },
                  ]}
                />
              </SurfacePanel>
              <ToolCallCard
                name="metrics.query"
                args={`{ "range": "24h", "filter": "streaming", "group_by": "region" }`}
                result={`{ "us-east-1": { "p95": 412 }, "eu-central-1": { "p95": 470 } }`}
                duration="84ms"
              />
            </div>
          </Section>
        </div>

        {/* parameters rail */}
        <aside className="space-y-4">
          <div className="rounded-xl border border-line bg-surface p-3.5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Parameters</span>
              <Badge tone="neutral" variant="outline">preset</Badge>
            </div>
            <div className="space-y-3.5">
              <Slider label="Temperature" value={temperature} onChange={setTemperature} suffix="%" />
              <Slider label="Max tokens" value={maxTokens} onChange={setMaxTokens} min={256} max={4096} step={256} />
              <Field label="Stop sequences">
                <Input placeholder="\n\n, ###" className="h-8 text-[11px]" />
              </Field>
              <Field label="Response format">
                <Select defaultValue="text" className="h-8 text-[11px]">
                  <option value="text">Text</option>
                  <option value="json">JSON object</option>
                </Select>
              </Field>
            </div>
            <div className="mt-3.5 space-y-2.5 border-t border-line pt-3.5">
              <Switch checked={jsonMode} onChange={setJsonMode} label="JSON mode" size="sm" />
              <Switch checked={tools} onChange={setTools} label="Tool calling" size="sm" />
              <Checkbox checked label="Return token usage" />
            </div>
          </div>

          <div className="rounded-xl border border-line bg-surface p-3.5">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Tool</div>
            <OptionCards
              columns={2}
              value={toolTarget}
              onChange={setToolTarget}
              options={[
                { value: 'db', label: 'Database', description: 'read-only' },
                { value: 'web', label: 'Web search', description: 'cited' },
                { value: 'none', label: 'None', description: 'pure LLM' },
              ]}
            />
            {toolTarget !== 'none' && (
              <div className="mt-2 rounded-md border border-line bg-surface-2 p-2 font-mono text-[9px] leading-4 text-muted">
                <div className="flex items-center gap-1 text-violet"><Wrench className="h-2.5 w-2.5" /> {toolTarget === 'db' ? 'metrics.query' : 'web.search'}</div>
                <div className="mt-1">{toolTarget === 'db' ? '{ range, filter, group_by }' : '{ query, max_results }'}</div>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-line bg-surface p-3.5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Session</span>
              <span className="font-mono text-[9.5px] text-muted">$0.0073</span>
            </div>
            <TokenCounter
              tokens={1506}
              limit={16000}
              breakdown={[
                { label: 'prompt', value: 52, tone: 'brand' },
                { label: 'completion', value: 34, tone: 'pink' },
                { label: 'tools', value: 14, tone: 'amber' },
              ]}
            />
            <KeyValue
              className="mt-3"
              columns={1}
              items={[
                { label: 'Runs', value: '6', mono: true },
                { label: 'Avg latency', value: '1.4s', mono: true },
                { label: 'Winner', value: <Badge tone="brand" variant="soft">A</Badge> },
              ]}
            />
            <Button size="xs" variant="secondary" className="mt-3 w-full" iconLeft={<Save className="h-3 w-3" />}>Save as preset</Button>
          </div>
        </aside>
      </div>

      <Section index="03" title="Prompt library" description="Reusable starting points across the workspace">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {promptLibrary.map(prompt => (
            <PromptCard key={prompt.title} {...prompt} onUse={() => setDraft(prompt.description)} />
          ))}
        </div>
      </Section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section index="04" title="Structured output" description="JSON mode with schema validation">
          <CodeBlock
            title="response.json"
            language="json"
            code={`{
  "cause": "router shift to eu-central",
  "impact": { "p95_delta_ms": 58, "scope": "streaming" },
  "mitigations": [
    { "step": "pin streaming to us-east-1", "risk": "low" },
    { "step": "reduce proxy buffer 200ms -> 50ms", "risk": "low" }
  ],
  "confidence": 0.86
}`}
          />
          <div className="mt-2 flex items-center gap-2 text-[10px] text-success">
            <Check className="h-3 w-3" strokeWidth={3} /> Valid against <span className="font-mono">mitigation.schema.json</span>
          </div>
        </Section>
        <Section index="05" title="Failure mode" description="What a bad run looks like">
          <div className="rounded-lg border border-danger/25 bg-danger-soft p-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-danger">
              <X className="h-3.5 w-3.5" /> Schema validation failed
            </div>
            <p className="mt-1 text-[10.5px] leading-5 text-danger/80">
              <span className="font-mono">mitigations[0].risk</span> expected enum ["low","medium","high"], received "minor".
            </p>
            <div className="mt-2 flex gap-2">
              <Button size="xs" variant="secondary">Retry with repair</Button>
              <Button size="xs" variant="ghost">Edit schema</Button>
            </div>
          </div>
          <div className="mt-3 rounded-lg border border-warning/30 bg-warning-soft p-3 text-[10.5px] leading-5 text-warning">
            <strong className="font-semibold">Truncated output.</strong> The model hit max tokens at 1,024 — raise the limit or ask for a shorter answer.
          </div>
          <div className="mt-3">
            <GradientBadge><Sparkles className="h-2.5 w-2.5" /> Tip</GradientBadge>
            <p className="mt-1.5 text-[10.5px] leading-5 text-muted">
              Ask for a schema first, then fill it. Repair passes cost 40% less than a full regeneration.
            </p>
          </div>
        </Section>
      </div>
    </div>
  );
}
