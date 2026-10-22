import { useState } from 'react';
import {
  Boxes,
  Check,
  ChevronRight,
  Copy,
  Download,
  Filter,
  GitBranch,
  MoreHorizontal,
  Plus,
  Rocket,
  Settings,
  Sparkles,
  Trash2,
  Zap,
} from 'lucide-react';
import { PageHeader, Section, SurfacePanel } from '../components/layout/Page';
import { Button, IconButton } from '../components/ui/Button';
import { Badge, GradientBadge, StatusDot } from '../components/ui/Badge';
import { Field, Input, Select, Textarea } from '../components/ui/Field';
import { Switch } from '../components/ui/Controls';
import { Drawer, Tooltip } from '../components/ui/Overlay';
import { AreaChart, ModelCard, TokenMeter } from '../components/ui/AI';
import { KeyValue, StatCard, Table, TableHead, TableToolbar, Td, Th, Tr, DataBar, Timeline } from '../components/ui/DataDisplay';
import { ModelCompareTable } from '../components/ui/AIExtra';
import { SegmentedTabs } from '../components/ui/Navigation';
import { Progress } from '../components/ui/Feedback';
import { cn } from '@/lib/utils';

type Model = {
  id: string;
  name: string;
  provider: string;
  version: string;
  status: 'live' | 'staging' | 'paused';
  requests: string;
  latency: string;
  cost: string;
  context: string;
  traffic: number;
  region: string;
};

const models: Model[] = [
  { id: 'gpt-4o-prod', name: 'GPT-4o Production', provider: 'OpenAI', version: 'v2.4', status: 'live', requests: '1.28M', latency: '412ms', cost: '$1,824', context: '128K', traffic: 62, region: 'us-east-1' },
  { id: 'claude-support', name: 'Support Copilot', provider: 'Anthropic', version: 'v1.8', status: 'live', requests: '642K', latency: '508ms', cost: '$642', context: '200K', traffic: 21, region: 'eu-central-1' },
  { id: 'vision-cls', name: 'Vision Classifier', provider: 'OpenAI', version: 'v3.0-rc', status: 'staging', requests: '318K', latency: '1.2s', cost: '$218', context: '32K', traffic: 11, region: 'us-east-1' },
  { id: 'llama-local', name: 'Llama 3.1 70B', provider: 'Self-hosted', version: 'v1.2', status: 'paused', requests: '84K', latency: '248ms', cost: '$96', context: '128K', traffic: 6, region: 'ap-south-1' },
];

const versions = [
  { id: 'v24', title: 'v2.4 · prompt + router', time: '2h ago', description: 'Streaming pinned to us-east-1, temperature 0.3', tone: 'success' as const },
  { id: 'v23', title: 'v2.3 · fallback chain', time: 'yesterday', description: 'Claude 3.5 added as fallback on 529', tone: 'brand' as const },
  { id: 'v22', title: 'v2.2 · context window', time: '4d ago', description: 'Raised to 128K, caching enabled', tone: 'brand' as const },
  { id: 'v21', title: 'v2.1 · initial deploy', time: '3w ago', description: 'Promoted from staging after canary', tone: 'warning' as const },
];

export function ModelsPage() {
  const [view, setView] = useState<'table' | 'cards'>('table');
  const [filter, setFilter] = useState<'all' | 'live' | 'staging' | 'paused'>('all');
  const [selected, setSelected] = useState<Model | null>(null);
  const [query, setQuery] = useState('');

  const visible = models.filter(m => (filter === 'all' ? true : m.status === filter) && `${m.name} ${m.provider}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Product screen · models"
        title="Models"
        description="A deployment registry: provision, promote, compare and pause. Uses the same table, drawer and badge primitives as the rest of the system."
        meta={
          <>
            <Badge tone="success" variant="soft"><StatusDot tone="success" pulse /> 2 live</Badge>
            <Badge tone="neutral" variant="outline">4 deployments · 3 regions</Badge>
            <Badge tone="neutral" variant="outline">§ click any row</Badge>
          </>
        }
        actions={
          <>
            <SegmentedTabs
              value={view}
              onChange={setView}
              options={[
                { value: 'table', label: 'Table' },
                { value: 'cards', label: 'Cards' },
              ]}
            />
            <Button iconLeft={<Plus className="h-4 w-4" />}>New model</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Live deployments" value="2" delta="+1" tone="success" icon={<Rocket className="h-3.5 w-3.5" />} footer="zero-downtime rollouts" />
        <StatCard label="Requests / day" value="2.31M" delta="+9.4%" data={[20, 24, 22, 30, 28, 34, 32, 40]} tone="brand" icon={<Zap className="h-3.5 w-3.5" />} />
        <StatCard label="Avg p95" value="412ms" delta="−8%" trend="up" data={[42, 40, 41, 36, 37, 33, 31, 29]} tone="pink" />
        <StatCard label="Spend / mo" value="$2.78K" delta="+3.1%" data={[18, 20, 19, 22, 24, 23, 26, 28]} tone="amber" footer="budget $3.5K" />
      </div>

      <Section
        index="01"
        title="Registry"
        description={view === 'table' ? 'Sortable, filterable, keyboard navigable' : 'Card grid for visual scanning'}
        flush
        aside={
          <div className="flex items-center gap-1">
            {(['all', 'live', 'staging', 'paused'] as const).map(item => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={cn(
                  'rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize transition',
                  filter === item ? 'bg-inverse text-on-inverse' : 'text-muted hover:bg-surface-2 hover:text-ink',
                )}
              >
                {item}
              </button>
            ))}
          </div>
        }
      >
        {view === 'table' ? (
          <>
            <TableToolbar
              search={query}
              onSearch={setQuery}
              placeholder="Search models…"
              count={`${visible.length} of ${models.length}`}
              filters={<Badge tone="neutral" variant="outline"><Filter className="h-3 w-3" /> filters</Badge>}
              actions={
                <>
                  <Button size="xs" variant="ghost" iconLeft={<Download className="h-3 w-3" />}>Export</Button>
                  <Button size="xs" variant="secondary" iconLeft={<Plus className="h-3 w-3" />}>New</Button>
                </>
              }
            />
            <Table>
              <TableHead>
                <tr>
                  <Th>Model</Th>
                  <Th>Status</Th>
                  <Th>Region</Th>
                  <Th align="right">Requests</Th>
                  <Th align="right">p95</Th>
                  <Th align="right">Traffic</Th>
                  <Th align="right">Cost</Th>
                  <Th />
                </tr>
              </TableHead>
              <tbody>
                {visible.map(model => (
                  <Tr key={model.id} onClick={() => setSelected(model)}>
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-7 w-7 place-items-center rounded-md bg-surface-3 font-mono text-[9px] font-bold text-muted">
                          {model.provider.slice(0, 2).toUpperCase()}
                        </span>
                        <span>
                          <span className="block font-semibold text-ink">{model.name}</span>
                          <span className="font-mono text-[9.5px] text-faint">{model.provider} · {model.version} · {model.context}</span>
                        </span>
                      </div>
                    </Td>
                    <Td>
                      <Badge tone={model.status === 'live' ? 'success' : model.status === 'staging' ? 'warning' : 'neutral'} variant="soft">
                        <StatusDot tone={model.status === 'live' ? 'success' : model.status === 'staging' ? 'warning' : 'neutral'} pulse={model.status === 'live'} />
                        {model.status}
                      </Badge>
                    </Td>
                    <Td mono>{model.region}</Td>
                    <Td align="right" mono>{model.requests}</Td>
                    <Td align="right" mono>{model.latency}</Td>
                    <Td align="right"><DataBar value={model.traffic} tone={model.status === 'live' ? 'brand' : 'amber'} /></Td>
                    <Td align="right" mono>{model.cost}</Td>
                    <Td align="right">
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip content="Copy endpoint" side="left">
                          <IconButton label="Copy endpoint" size="xs" variant="ghost"><Copy className="h-3 w-3" /></IconButton>
                        </Tooltip>
                        <IconButton label="More" size="xs" variant="ghost"><MoreHorizontal className="h-3 w-3" /></IconButton>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
            {visible.length === 0 && <p className="px-4 py-10 text-center text-[11.5px] text-muted">No models match “{query}”.</p>}
          </>
        ) : (
          <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
            {visible.map(model => (
              <ModelCard
                key={model.id}
                name={model.name}
                provider={`${model.provider} · ${model.version}`}
                description={`${model.region} · ${model.context} context · ${model.latency} p95`}
                context={model.context}
                price={`${model.cost}/mo`}
                badge={model.status === 'live' ? <Badge tone="success" variant="soft">live</Badge> : <Badge tone="warning" variant="soft">{model.status}</Badge>}
                selected={selected?.id === model.id}
                onSelect={() => setSelected(model)}
              />
            ))}
          </div>
        )}
      </Section>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_1fr]">
        <Section index="02" title="Benchmark comparison" description="Same prompt, four providers">
          <ModelCompareTable
            models={[
              { name: 'GPT-4o', provider: 'OpenAI', best: true },
              { name: 'Claude 3.5', provider: 'Anthropic' },
              { name: 'Gemini 1.5', provider: 'Google' },
              { name: 'Llama 3.1', provider: 'Self-hosted' },
            ]}
            criteria={[
              { label: 'MMLU', values: ['88.7', '88.3', '85.9', '82.0'] },
              { label: 'HumanEval', values: ['90.2', '92.0', '84.1', '80.5'] },
              { label: 'p95 latency', values: ['412ms', '508ms', '684ms', '248ms'] },
              { label: 'Cost / 1M tok', values: ['$10.00', '$8.00', '$4.00', '$2.00'] },
              { label: 'Context', values: ['128K', '200K', '1M', '128K'] },
            ]}
          />
          <p className="mt-3 rounded-md bg-surface-2 px-2.5 py-2 text-[9.5px] leading-4 text-muted">
            Latency measured on the same 512-token prompt from us-east-1. Numbers are illustrative for layout purposes.
          </p>
        </Section>

        <Section index="03" title="Version history" description="Every deploy is reversible">
          <Timeline
            items={versions.map(v => ({ ...v, icon: <GitBranch className="h-3 w-3" /> }))}
          />
          <div className="mt-4 space-y-2 border-t border-line pt-3">
            <div className="flex items-center justify-between text-[10.5px]">
              <span className="text-muted">Rollback window</span>
              <span className="font-mono text-ink">30 days</span>
            </div>
            <div className="flex items-center justify-between text-[10.5px]">
              <span className="text-muted">Canary share</span>
              <span className="font-mono text-ink">10% → 100%</span>
            </div>
            <Progress value={100} size="sm" tone="success" />
          </div>
        </Section>
      </div>

      <Section index="04" title="Traffic distribution" description="Weighted routing across live deployments">
        <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-3">
            {models.filter(m => m.status !== 'paused').map(model => (
              <div key={model.id}>
                <div className="flex items-baseline justify-between text-[10.5px]">
                  <span className="font-medium text-ink-soft">{model.name}</span>
                  <span className="font-mono text-[10px] text-muted">{model.traffic}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-3">
                  <div className="h-full rounded-full bg-[linear-gradient(90deg,#38AEFA,#0272C6)]" style={{ width: `${model.traffic}%` }} />
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 rounded-md border border-line bg-surface-2 px-2.5 py-2 text-[10px] text-muted">
              <Sparkles className="h-3 w-3 text-brand" /> Auto-fallback: Claude 3.5 on 529 / timeout &gt; 8s
            </div>
          </div>
          <SurfacePanel label="Requests · last 14 days">
            <AreaChart data={[22, 28, 26, 34, 31, 40, 38, 46, 44, 54, 50, 58, 56, 64]} height={124} labels={['Oct 8', 'Oct 14', 'Oct 21']} />
            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-2.5">
              {[
                { label: 'Peak', value: '2.9M' },
                { label: 'Errors', value: '0.4%' },
                { label: 'Retries', value: '1.2%' },
              ].map(item => (
                <div key={item.label}>
                  <div className="text-[9px] uppercase tracking-wider text-faint">{item.label}</div>
                  <div className="font-mono text-[11px] font-semibold text-ink">{item.value}</div>
                </div>
              ))}
            </div>
          </SurfacePanel>
        </div>
      </Section>

      <Section index="05" title="Provision a model" description="The create flow, inline">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Model name" required><Input placeholder="Support Copilot v2" /></Field>
              <Field label="Base model">
                <Select defaultValue="gpt-4o">
                  <option value="gpt-4o">GPT-4o · OpenAI</option>
                  <option value="claude">Claude 3.5 · Anthropic</option>
                  <option value="gemini">Gemini 1.5 · Google</option>
                  <option value="llama">Llama 3.1 · self-hosted</option>
                </Select>
              </Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Region"><Select defaultValue="iad"><option value="iad">us-east-1</option><option value="fra">eu-central-1</option><option value="bom">ap-south-1</option></Select></Field>
              <Field label="Max context"><Select defaultValue="128"><option value="32">32K</option><option value="128">128K</option><option value="200">200K</option></Select></Field>
            </div>
            <Field label="Description" hint="Shown in the registry and to workspace members.">
              <Textarea defaultValue="Customer support assistant with citation-grounded replies." className="min-h-[72px]" />
            </Field>
            <div className="space-y-3 rounded-lg border border-line bg-surface-2 p-3">
              <Switch checked label="Stream responses by default" onChange={() => undefined} size="sm" />
              <Switch checked label="Enable prompt caching" description="Cuts input cost up to 60% on repeated system prompts." onChange={() => undefined} size="sm" />
              <Switch checked={false} label="Route through EU data boundary" onChange={() => undefined} size="sm" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-lg border border-brand/25 bg-brand-soft p-3">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-brand">
                <Boxes className="h-3 w-3" /> Estimated cost
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-mono text-xl font-extrabold text-ink">$1,420</span>
                <span className="text-[10px] text-muted">/ month</span>
              </div>
              <p className="mt-1 text-[10px] leading-4 text-muted">At 1M requests with average 1,842 tokens and 38% cache hit.</p>
              <div className="mt-2.5">
                <TokenMeter used={38} total={100} label="Cache hit rate" tone="pink" />
              </div>
            </div>
            <SurfacePanel label="Pre-flight checks">
              <ul className="space-y-2">
                {[
                  ['Provider quota available', true],
                  ['Region supports model', true],
                  ['Guardrails configured', true],
                  ['Budget alert set', false],
                ].map(([label, done]) => (
                  <li key={String(label)} className="flex items-center gap-2 text-[10.5px]">
                    <span className={cn('grid h-4 w-4 place-items-center rounded-full', done ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning')}>
                      {done ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : '!'}
                    </span>
                    <span className={done ? 'text-ink-soft' : 'text-warning'}>{label}</span>
                  </li>
                ))}
              </ul>
            </SurfacePanel>
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1" size="sm">Save draft</Button>
              <Button className="flex-1" size="sm" iconLeft={<Rocket className="h-3.5 w-3.5" />}>Deploy</Button>
            </div>
          </div>
        </div>
      </Section>

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name ?? 'Model'}
        description={selected ? `${selected.provider} · ${selected.version} · ${selected.region}` : undefined}
        footer={
          <>
            <Button size="sm" variant="danger" iconLeft={<Trash2 className="h-3.5 w-3.5" />}>Delete</Button>
            <Button size="sm" variant="secondary" iconLeft={<Settings className="h-3.5 w-3.5" />}>Configure</Button>
            <Button size="sm" iconLeft={<Rocket className="h-3.5 w-3.5" />}>Promote</Button>
          </>
        }
      >
        {selected && (
          <>
            <div className="flex items-center gap-2">
              <Badge tone={selected.status === 'live' ? 'success' : selected.status === 'staging' ? 'warning' : 'neutral'} variant="soft">
                <StatusDot tone={selected.status === 'live' ? 'success' : selected.status === 'staging' ? 'warning' : 'neutral'} pulse={selected.status === 'live'} />
                {selected.status}
              </Badge>
              <GradientBadge><Sparkles className="h-2.5 w-2.5" /> {selected.provider}</GradientBadge>
            </div>
            <KeyValue
              columns={1}
              items={[
                { label: 'Endpoint', value: `api.unseen.ai/v2/${selected.id}`, mono: true },
                { label: 'Context window', value: selected.context },
                { label: 'p95 latency', value: selected.latency },
                { label: 'Requests (30d)', value: selected.requests },
                { label: 'Spend (30d)', value: selected.cost },
                { label: 'Traffic share', value: `${selected.traffic}%` },
              ]}
            />
            <SurfacePanel label="Requests trend">
              <AreaChart data={[20, 24, 22, 30, 28, 34, 32, 40, 38, 44]} height={80} showGrid={false} />
            </SurfacePanel>
            <SurfacePanel label="Quick actions">
              <div className="grid gap-2">
                <Button size="xs" variant="secondary" iconLeft={<Copy className="h-3 w-3" />}>Copy API key</Button>
                <Button size="xs" variant="secondary" iconLeft={<GitBranch className="h-3 w-3" />}>View versions</Button>
                <Button size="xs" variant="secondary" iconLeft={<ChevronRight className="h-3 w-3" />}>Open in playground</Button>
              </div>
            </SurfacePanel>
          </>
        )}
      </Drawer>
    </div>
  );
}
