import { useState } from 'react';
import {
  ArrowUpRight,
  Bot,
  Calendar,
  Clock,
  Download,
  Filter,
  Gauge,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { PageHeader } from '../components/layout/Page';
import { Button, IconButton } from '../components/ui/Button';
import { Badge, GradientBadge, StatusDot } from '../components/ui/Badge';
import { Field, Input, Select, Textarea } from '../components/ui/Field';
import { Segmented } from '../components/ui/Controls';
import { Progress, ProgressRing } from '../components/ui/Feedback';
import { Modal, Tooltip } from '../components/ui/Overlay';
import { Avatar, AvatarStack } from '../components/ui/Avatar';
import { AreaChart, BarChart, Sparkline, TokenMeter } from '../components/ui/AI';
import { cn } from '@/lib/utils';

const periods = {
  '24h': { data: [22, 30, 26, 38, 34, 46, 42, 58, 54, 66, 62, 74], labels: ['00:00', '06:00', '12:00', '18:00'], requests: '1,284,392', tokens: '48.2M', spend: '$1,824.50', delta: '+12.4%' },
  '7d': { data: [28, 34, 30, 42, 38, 50, 46, 58, 52, 64, 60, 72, 66, 78], labels: ['Mon', 'Wed', 'Fri', 'Sun'], requests: '8.42M', tokens: '312M', spend: '$11,284', delta: '+8.1%' },
  '30d': { data: [18, 24, 22, 30, 28, 36, 34, 44, 40, 52, 48, 60, 56, 68], labels: ['Oct 1', 'Oct 10', 'Oct 20', 'Oct 21'], requests: '34.8M', tokens: '1.28B', spend: '$46,912', delta: '+21.6%' },
};

const models = [
  { name: 'GPT-4o Production', provider: 'OpenAI', status: 'Live', requests: '1.28M', latency: '412ms', error: '0.4%', cost: '$1,824', share: 72 },
  { name: 'Claude 3.5 Sonnet', provider: 'Anthropic', status: 'Live', requests: '642K', latency: '508ms', error: '0.2%', cost: '$642', share: 44 },
  { name: 'Vision Classifier', provider: 'OpenAI', status: 'Degraded', requests: '318K', latency: '1.2s', error: '3.8%', cost: '$218', share: 26 },
  { name: 'Llama 3.1 70B', provider: 'Self-hosted', status: 'Paused', requests: '84K', latency: '248ms', error: '0.1%', cost: '$96', share: 12 },
];

const activity = [
  { who: 'Marcus Ng', action: 'deployed', target: 'gpt-4o-prod v2.4', time: '12m', initials: 'MN', tone: 'blue' as const },
  { who: 'Copilot', action: 'flagged a latency regression in', target: 'eu-central-1', time: '38m', initials: 'AI', tone: 'pink' as const },
  { who: 'Jules Laurent', action: 'rotated the key for', target: 'support-copilot', time: '1h', initials: 'JL', tone: 'amber' as const },
  { who: 'Sara Chen', action: 'raised the budget to', target: '$2,500 / mo', time: '3h', initials: 'SC', tone: 'mint' as const },
];

export function DashboardPage() {
  const [period, setPeriod] = useState<'24h' | '7d' | '30d'>('7d');
  const [modalOpen, setModalOpen] = useState(false);
  const [range, setRange] = useState<'all' | 'live' | 'attention'>('all');
  const data = periods[period];

  const visibleModels = models.filter(m =>
    range === 'all' ? true : range === 'live' ? m.status === 'Live' : m.status !== 'Live',
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Product screen · analytics"
        title="Dashboard"
        description="A shipped analytics surface: KPI cards, usage trends, model health and an activity feed — all token-driven and dark-mode ready."
        meta={
          <>
            <Badge tone="success" variant="soft"><StatusDot tone="success" pulse /> All systems operational</Badge>
            <Badge tone="neutral" variant="outline">1440 × 960 target</Badge>
            <Badge tone="neutral" variant="outline">Dense layout · 4px grid</Badge>
          </>
        }
        actions={
          <>
            <Button variant="secondary" iconLeft={<Download className="h-4 w-4" />}>Export</Button>
            <Button iconLeft={<Plus className="h-4 w-4" />} onClick={() => setModalOpen(true)}>New model</Button>
          </>
        }
      />

      <div className="overflow-hidden rounded-[22px] border border-line bg-canvas shadow-card">
        {/* app chrome */}
        <div className="flex items-center gap-3 border-b border-line bg-surface px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-danger/50" />
            <span className="h-2 w-2 rounded-full bg-amber/60" />
            <span className="h-2 w-2 rounded-full bg-success/50" />
          </div>
          <span className="hidden items-center gap-1.5 rounded-md border border-line bg-surface-2 px-2 py-1 font-mono text-[9.5px] text-faint sm:flex">
            app.unseen.ai/dashboard
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <AvatarStack
              size="xs"
              people={[
                { id: '1', initials: 'RK', tone: 'pink' },
                { id: '2', initials: 'MN', tone: 'blue' },
                { id: '3', initials: 'JL', tone: 'amber' },
              ]}
            />
            <Avatar initials="RK" size="sm" tone="ink" status="online" ring />
          </div>
        </div>

        <div className="grid lg:grid-cols-[188px_1fr]">
          {/* in-app nav */}
          <aside className="hidden border-r border-line bg-surface/60 p-3 lg:block">
            <div className="flex items-center gap-2 rounded-lg bg-brand-soft px-2.5 py-2 text-brand-strong dark:text-brand">
              <Gauge className="h-3.5 w-3.5" />
              <span className="text-[11.5px] font-semibold">Overview</span>
            </div>
            {[
              { icon: Bot, label: 'Models' },
              { icon: Sparkles, label: 'Playground' },
              { icon: TrendingUp, label: 'Usage' },
              { icon: Zap, label: 'Agents' },
              { icon: Filter, label: 'Logs' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="mt-0.5 flex items-center gap-2 rounded-lg px-2.5 py-2 text-muted transition hover:bg-surface-2 hover:text-ink">
                  <Icon className="h-3.5 w-3.5" />
                  <span className="text-[11.5px] font-medium">{item.label}</span>
                </div>
              );
            })}
            <div className="mt-5 border-t border-line pt-3">
              <div className="px-2 text-[9px] font-bold uppercase tracking-[0.14em] text-faint">Workspace</div>
              <div className="mt-2 space-y-1">
                <TokenMeter used={72000} total={100000} label="Tokens" />
                <div className="pt-2">
                  <Progress value={64} label="Requests" size="sm" />
                </div>
              </div>
              <Button size="xs" variant="secondary" className="mt-3 w-full">Upgrade plan</Button>
            </div>
          </aside>

          <div className="min-w-0 p-4 sm:p-5 lg:p-6">
            {/* screen header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-[10.5px] text-muted">
                  <Calendar className="h-3 w-3" /> Tuesday, 21 October 2026
                </div>
                <h2 className="mt-1 text-[22px] font-extrabold tracking-[-0.03em] text-ink">
                  Good morning, Rania.
                </h2>
                <p className="mt-1 text-[12px] text-muted">Here’s what your models did while you were away.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative hidden sm:block">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-faint" />
                  <input
                    placeholder="Search models…"
                    className="h-8 w-40 rounded-lg border border-line bg-surface pl-8 pr-2 text-[11.5px] text-ink outline-none transition placeholder:text-faint focus:border-brand focus:ring-2 focus:ring-brand/15"
                  />
                </div>
                <Segmented
                  value={period}
                  onChange={setPeriod}
                  size="sm"
                  options={[
                    { value: '24h', label: '24h' },
                    { value: '7d', label: '7d' },
                    { value: '30d', label: '30d' },
                  ]}
                />
              </div>
            </div>

            {/* kpis */}
            <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
              {[
                { label: 'Requests', value: data.requests, delta: data.delta, data: data.data, tone: 'brand' as const, icon: Zap },
                { label: 'Tokens', value: data.tokens, delta: '+9.2%', data: [...data.data].reverse(), tone: 'pink' as const, icon: Sparkles },
                { label: 'Spend', value: data.spend, delta: '+3.1%', data: data.data.map(v => v * 0.8), tone: 'amber' as const, icon: TrendingUp },
                { label: 'p95 latency', value: '412ms', delta: '−8%', data: [42, 38, 44, 36, 40, 32, 34, 30, 28, 32, 26, 24], tone: 'success' as const, icon: Clock },
              ].map(kpi => {
                const Icon = kpi.icon;
                return (
                  <div key={kpi.label} className="group rounded-xl border border-line bg-surface p-3.5 transition hover:border-brand/30 hover:shadow-card">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-faint">{kpi.label}</span>
                      <Icon className="h-3.5 w-3.5 text-faint transition group-hover:text-brand" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-1.5">
                      <span className="font-mono text-[18px] font-extrabold tracking-tight text-ink tabular-nums">{kpi.value}</span>
                      <span className="text-[9.5px] font-semibold text-success">{kpi.delta}</span>
                    </div>
                    <div className="mt-1 -mb-1">
                      <Sparkline data={kpi.data} tone={kpi.tone} height={30} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* chart + limits */}
            <div className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_1fr]">
              <div className="rounded-xl border border-line bg-surface p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-[12px] font-semibold text-ink">Token usage</div>
                    <div className="text-[10.5px] text-muted">Input + output across all models</div>
                  </div>
                  <div className="flex items-center gap-3 text-[9.5px]">
                    <span className="inline-flex items-center gap-1.5 text-muted">
                      <span className="h-1.5 w-3 rounded-full bg-brand" /> input
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-muted">
                      <span className="h-1.5 w-3 rounded-full bg-pink" /> output
                    </span>
                    <IconButton label="Chart options" size="xs" variant="ghost">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </IconButton>
                  </div>
                </div>
                <div className="mt-3">
                  <AreaChart data={data.data} height={150} labels={data.labels} />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3 border-t border-line pt-3">
                  {[
                    { label: 'Cached reads', value: '38%' },
                    { label: 'Avg / request', value: '1,842 tok' },
                    { label: 'Peak hour', value: '14:00 UTC' },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="text-[9px] uppercase tracking-wider text-faint">{item.label}</div>
                      <div className="mt-0.5 font-mono text-[11.5px] font-semibold text-ink">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-line bg-surface p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[12px] font-semibold text-ink">Budget</div>
                      <div className="text-[10.5px] text-muted">Resets in 6 days</div>
                    </div>
                    <Badge tone="warning" variant="soft">82%</Badge>
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <ProgressRing value={73} size={84} stroke={8} label="used" />
                    <div className="flex-1 space-y-2">
                      <div>
                        <div className="flex justify-between text-[10px] text-muted"><span>Spend</span><span className="font-mono text-ink-soft">$1,824</span></div>
                        <Progress value={73} size="sm" />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-muted"><span>Requests</span><span className="font-mono text-ink-soft">1.28M</span></div>
                        <Progress value={82} tone="pink" size="sm" />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-muted"><span>Storage</span><span className="font-mono text-ink-soft">12 GB</span></div>
                        <Progress value={24} tone="success" size="sm" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-line bg-[linear-gradient(150deg,var(--ds-surface),var(--ds-brand-soft))] p-4">
                  <div className="flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-lg bg-[linear-gradient(140deg,#0E91F0,#F72685)] text-white">
                      <Sparkles className="h-3 w-3" />
                    </span>
                    <span className="text-[11.5px] font-semibold text-ink">Copilot insight</span>
                    <GradientBadge className="ml-auto">AI</GradientBadge>
                  </div>
                  <p className="mt-2.5 text-[11px] leading-5 text-ink-soft">
                    Vision Classifier is 3.4× slower than its 7-day baseline. Two retries are already scheduled.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button size="xs">Investigate</Button>
                    <Button size="xs" variant="ghost" iconRight={<ArrowUpRight className="h-3 w-3" />}>Dismiss</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* models + activity */}
            <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
              <div className="overflow-hidden rounded-xl border border-line bg-surface">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
                  <div>
                    <div className="text-[12px] font-semibold text-ink">Models</div>
                    <div className="text-[10.5px] text-muted">4 deployments · 3 regions</div>
                  </div>
                  <div className="flex items-center gap-1">
                    {(['all', 'live', 'attention'] as const).map(item => (
                      <button
                        key={item}
                        onClick={() => setRange(item)}
                        className={cn(
                          'rounded-md px-2 py-1 text-[10px] font-semibold capitalize transition',
                          range === item ? 'bg-surface-3 text-ink' : 'text-faint hover:text-ink',
                        )}
                      >
                        {item}
                      </button>
                    ))}
                    <IconButton label="More options" size="xs" variant="ghost"><MoreHorizontal className="h-3.5 w-3.5" /></IconButton>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left">
                    <thead className="bg-surface-2 text-[9px] font-bold uppercase tracking-[0.1em] text-faint">
                      <tr>
                        <th className="px-4 py-2">Model</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Requests</th>
                        <th className="px-3 py-2">Latency</th>
                        <th className="px-3 py-2">Errors</th>
                        <th className="px-4 py-2 text-right">Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {visibleModels.map(row => (
                        <tr key={row.name} className="transition hover:bg-surface-2/70">
                          <td className="px-4 py-3">
                            <div className="text-[11.5px] font-semibold text-ink">{row.name}</div>
                            <div className="text-[9.5px] text-faint">{row.provider}</div>
                          </td>
                          <td className="px-3 py-3">
                            <Badge tone={row.status === 'Live' ? 'success' : row.status === 'Degraded' ? 'warning' : 'neutral'} variant="soft">
                              <StatusDot tone={row.status === 'Live' ? 'success' : row.status === 'Degraded' ? 'warning' : 'neutral'} pulse={row.status === 'Live'} />
                              {row.status}
                            </Badge>
                          </td>
                          <td className="px-3 py-3 font-mono text-[10.5px] tabular-nums text-ink-soft">{row.requests}</td>
                          <td className="px-3 py-3 font-mono text-[10.5px] tabular-nums text-ink-soft">{row.latency}</td>
                          <td className={cn('px-3 py-3 font-mono text-[10.5px] tabular-nums', Number.parseFloat(row.error) > 2 ? 'text-danger' : 'text-ink-soft')}>{row.error}</td>
                          <td className="px-4 py-3 text-right font-mono text-[10.5px] tabular-nums text-ink-soft">{row.cost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between border-t border-line bg-surface-2/60 px-4 py-2.5">
                  <span className="font-mono text-[9.5px] text-faint">showing {visibleModels.length} of {models.length}</span>
                  <Button size="xs" variant="ghost" iconRight={<ArrowUpRight className="h-3 w-3" />}>All models</Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-line bg-surface p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-[12px] font-semibold text-ink">Recent activity</div>
                    <Tooltip content="Only workspace events">
                      <span className="cursor-help text-[10px] text-faint">last 24h</span>
                    </Tooltip>
                  </div>
                  <div className="mt-3 space-y-3">
                    {activity.map(item => (
                      <div key={item.who + item.time} className="flex items-start gap-2.5">
                        <Avatar initials={item.initials} tone={item.tone} size="xs" className="mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10.5px] leading-4 text-muted">
                            <span className="font-semibold text-ink-soft">{item.who}</span> {item.action}{' '}
                            <span className="font-medium text-ink">{item.target}</span>
                          </p>
                        </div>
                        <span className="shrink-0 font-mono text-[9px] text-faint">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-line bg-surface p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-[12px] font-semibold text-ink">Request volume</div>
                    <span className="font-mono text-[9.5px] text-faint">per hour</span>
                  </div>
                  <div className="mt-3">
                    <BarChart data={[32, 48, 41, 60, 54, 78, 66, 92, 84, 98, 71, 56]} labels={['0', '6', '12', '18']} highlight={7} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create a model"
        description="Spin up a deployment from a preset, then tune it in the playground."
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={() => setModalOpen(false)}>Create model</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Model name" required>
            <Input placeholder="Support Copilot v2" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Base model">
              <Select defaultValue="gpt-4o">
                <option value="gpt-4o">GPT-4o · OpenAI</option>
                <option value="claude">Claude 3.5 · Anthropic</option>
                <option value="llama">Llama 3.1 · self-hosted</option>
              </Select>
            </Field>
            <Field label="Region">
              <Select defaultValue="iad">
                <option value="iad">us-east-1</option>
                <option value="fra">eu-central-1</option>
              </Select>
            </Field>
          </div>
          <Field label="Description" hint="Visible to your whole workspace.">
            <Textarea placeholder="What should this model do?" />
          </Field>
          <div className="flex items-center justify-between rounded-lg border border-line bg-surface-2 px-3 py-2 text-[11px]">
            <span className="text-muted">Estimated cost at 1M requests / month</span>
            <span className="font-mono font-semibold text-ink">$1,420</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
