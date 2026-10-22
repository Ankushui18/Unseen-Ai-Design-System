import { useState } from 'react';
import { ArrowUpRight, Download, Filter, RefreshCw, TrendingUp, Users, Zap } from 'lucide-react';
import { PageHeader, Section, SurfacePanel } from '../components/layout/Page';
import { Button, IconButton } from '../components/ui/Button';
import { Badge, StatusDot } from '../components/ui/Badge';
import { Field, Select } from '../components/ui/Field';
import { AreaChart, Sparkline, TokenMeter } from '../components/ui/AI';
import { ChartCard, Donut, Funnel, Gauge, Heatmap, Legend, MiniBars, Scatter, StackedBar } from '../components/ui/Charts';
import { DataBar, KeyValue, Pagination, StatCard, Table, TableHead, TableToolbar, Td, Th, Tr } from '../components/ui/DataDisplay';
import { SegmentedTabs } from '../components/ui/Navigation';
import { TokenCounter } from '../components/ui/AIExtra';

const modelUsage = [
  { label: 'GPT-4o', value: 62, tone: 'brand' as const },
  { label: 'Claude 3.5', value: 21, tone: 'pink' as const },
  { label: 'Gemini 1.5', value: 11, tone: 'amber' as const },
  { label: 'Llama 3.1', value: 6, tone: 'violet' as const },
];

const heatmapValues = [
  [2, 4, 6, 9, 14, 12, 8, 10, 18, 24, 20, 16],
  [1, 3, 8, 12, 18, 22, 19, 24, 28, 32, 26, 20],
  [3, 5, 9, 16, 24, 30, 26, 32, 38, 42, 34, 27],
  [2, 6, 12, 20, 28, 36, 32, 40, 46, 52, 44, 33],
  [4, 8, 15, 24, 34, 42, 38, 46, 52, 58, 50, 38],
  [3, 7, 13, 21, 30, 38, 34, 41, 47, 52, 45, 35],
  [1, 2, 5, 9, 14, 17, 15, 18, 22, 26, 21, 16],
];

const cohorts = [
  { id: 'pro-us', name: 'Pro · us-east', workspace: 'Enterprise', sessions: '42,180', retention: 92, spend: '$842.10', trend: [12, 18, 15, 22, 26, 24, 31] },
  { id: 'pro-eu', name: 'Pro · eu-central', workspace: 'Enterprise', sessions: '28,442', retention: 88, spend: '$612.40', trend: [9, 12, 14, 13, 18, 21, 24] },
  { id: 'team-us', name: 'Team · us-east', workspace: 'Self-serve', sessions: '19,860', retention: 74, spend: '$318.20', trend: [6, 8, 7, 11, 10, 14, 16] },
  { id: 'free-eu', name: 'Free · eu-central', workspace: 'Self-serve', sessions: '9,412', retention: 41, spend: '$52.80', trend: [4, 3, 5, 4, 6, 5, 7] },
  { id: 'scale-ap', name: 'Scale · ap-south', workspace: 'Enterprise', sessions: '6,204', retention: 96, spend: '$198.00', trend: [3, 4, 6, 5, 8, 9, 11] },
];

export function AnalyticsPage() {
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [page, setPage] = useState(1);
  const [metric, setMetric] = useState<'requests' | 'tokens' | 'spend'>('requests');

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Product screen · analytics"
        title="Usage analytics"
        description="The deep-dive report: composition, retention, quality and cost — eight chart types built from tokens, all keyboard- and screen-reader-labelled."
        meta={
          <>
            <Badge tone="brand" variant="soft">8 chart types</Badge>
            <Badge tone="neutral" variant="outline">Inline vs. expanded states</Badge>
            <Badge tone="success" variant="soft"><StatusDot tone="success" /> data fresh · 2m</Badge>
          </>
        }
        actions={
          <>
            <SegmentedTabs
              value={range}
              onChange={setRange}
              options={[
                { value: '7d', label: '7d' },
                { value: '30d', label: '30d' },
                { value: '90d', label: '90d' },
              ]}
            />
            <Button variant="secondary" iconLeft={<RefreshCw className="h-4 w-4" />}>Refresh</Button>
            <Button iconLeft={<Download className="h-4 w-4" />}>Export CSV</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Requests" value="8.42M" delta="+12.4%" data={[18, 24, 21, 30, 28, 36, 34, 44, 40, 52]} tone="brand" icon={<Zap className="h-3.5 w-3.5" />} footer="vs 7.49M last period" />
        <StatCard label="Active seats" value="1,284" delta="+8.1%" data={[12, 14, 13, 18, 17, 21, 24, 22, 27, 30]} tone="pink" icon={<Users className="h-3.5 w-3.5" />} footer="92% of 1,400 licensed" />
        <StatCard label="Cost / 1K req" value="$0.22" delta="−4.2%" trend="up" data={[28, 26, 27, 24, 23, 22, 21, 22, 20, 19]} tone="amber" icon={<TrendingUp className="h-3.5 w-3.5" />} footer="↓ cheaper than last period" />
        <StatCard label="p95 latency" value="412ms" delta="−8%" trend="up" data={[42, 39, 41, 36, 38, 33, 34, 31, 29, 27]} tone="success" icon={<Filter className="h-3.5 w-3.5" />} footer="SLO target 500ms" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <ChartCard
          title="Volume by model"
          description="Requests split across the four production deployments"
          action={
            <div className="flex items-center gap-1">
              {(['requests', 'tokens', 'spend'] as const).map(item => (
                <button
                  key={item}
                  onClick={() => setMetric(item)}
                  className={`rounded-md px-2 py-1 text-[10px] font-semibold capitalize transition ${
                    metric === item ? 'bg-surface-3 text-ink' : 'text-faint hover:text-ink'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          }
          legend={<Legend items={modelUsage.map(m => ({ label: m.label, tone: m.tone, value: `${m.value}%` }))} />}
        >
          <div className="flex flex-wrap items-center gap-6">
            <Donut segments={modelUsage} centerValue="8.42M" centerLabel="requests" />
            <div className="min-w-[180px] flex-1 space-y-2.5">
              {modelUsage.map(model => (
                <div key={model.label}>
                  <div className="flex items-baseline justify-between text-[10.5px]">
                    <span className="font-medium text-ink-soft">{model.label}</span>
                    <span className="font-mono text-[10px] text-muted">{model.value}%</span>
                  </div>
                  <div className="mt-1">
                    <StackedBar segments={[{ label: model.label, value: model.value, tone: model.tone }]} height={6} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <ChartCard title="SLO attainment" description="Rolling 30-day">
            <div className="flex items-center justify-around gap-3">
              <Gauge value={94} label="availability" sublabel="target 99.9%" tone="brand" />
              <Gauge value={88} label="latency p95" sublabel="target 500ms" tone="success" />
            </div>
          </ChartCard>
          <ChartCard title="Cost mix" description="Where the budget goes">
            <StackedBar
              height={12}
              segments={[
                { label: 'Chat', value: 58, tone: 'brand' },
                { label: 'Embeddings', value: 18, tone: 'pink' },
                { label: 'Vision', value: 15, tone: 'amber' },
                { label: 'Agents', value: 9, tone: 'violet' },
              ]}
            />
            <div className="mt-3 space-y-2">
              <KeyValue
                columns={1}
                items={[
                  { label: 'Chat completions', value: '$1,058', mono: true },
                  { label: 'Embeddings', value: '$328', mono: true },
                  { label: 'Vision', value: '$274', mono: true },
                  { label: 'Agent runs', value: '$164', mono: true },
                ]}
              />
            </div>
          </ChartCard>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1.05fr]">
        <Section index="01" title="Request heatmap" description="Hour × day density, last 7 days">
          <Heatmap
            rows={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
            columns={['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22']}
            values={heatmapValues}
            labels
          />
          <div className="mt-3 flex items-center justify-between">
            <span className="font-mono text-[9.5px] text-faint">peak: Thu 18:00 · 58K req/h</span>
            <span className="flex items-center gap-1.5 text-[9.5px] text-faint">
              low
              {[12, 30, 50, 70, 90].map(v => (
                <span
                  key={v}
                  className="h-2.5 w-4 rounded-sm"
                  style={{ background: `color-mix(in oklab, var(--ds-brand) ${v}%, var(--ds-surface-3))` }}
                />
              ))}
              high
            </span>
          </div>
        </Section>

        <Section index="02" title="Activation funnel" description="Signup → first production call">
          <Funnel
            steps={[
              { label: 'Signed up', value: 12480 },
              { label: 'Created a model', value: 9420 },
              { label: 'First test call', value: 7180 },
              { label: 'Deployed to prod', value: 4210 },
              { label: 'Still active at day 30', value: 3180 },
            ]}
          />
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-3">
            {[
              { label: 'Signup → prod', value: '33.7%' },
              { label: 'Median time', value: '2.4 days' },
              { label: 'Best cohort', value: 'Scale · AP' },
            ].map(item => (
              <div key={item.label}>
                <div className="text-[9px] uppercase tracking-wider text-faint">{item.label}</div>
                <div className="mt-0.5 font-mono text-[11px] font-semibold text-ink">{item.value}</div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <ChartCard title="Token throughput" description="Input vs. output, 14 days" legend={<Legend items={[{ label: 'input', tone: 'brand' }, { label: 'output', tone: 'pink' }]} />}>
          <div className="relative">
            <AreaChart data={[26, 32, 29, 38, 35, 44, 41, 52, 48, 58, 54, 66, 62, 74]} height={132} />
            <div className="pointer-events-none absolute inset-0">
              <AreaChart data={[14, 18, 16, 22, 20, 26, 24, 30, 28, 34, 32, 39, 37, 44]} height={132} tone="pink" showGrid={false} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-4 border-t border-line pt-2.5">
            <TokenCounter tokens={48200} limit={100000} breakdown={[{ label: 'input', value: 62, tone: 'brand' }, { label: 'output', value: 24, tone: 'pink' }, { label: 'cache', value: 14, tone: 'amber' }]} />
            <div className="flex-1">
              <TokenMeter used={72000} total={100000} label="Monthly quota" />
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Embedding space" description="Prompt clusters, PCA-reduced" action={<Badge tone="neutral" variant="outline">2,048 points</Badge>}>
          <Scatter
            height={188}
            points={[
              ...Array.from({ length: 22 }, (_, i) => ({ x: 18 + (i % 6) * 3.4, y: 22 + Math.floor(i / 6) * 5, tone: 'brand' as const, label: 'support' })),
              ...Array.from({ length: 16 }, (_, i) => ({ x: 58 + (i % 5) * 3.2, y: 34 + Math.floor(i / 5) * 5.5, tone: 'pink' as const, label: 'billing' })),
              ...Array.from({ length: 13 }, (_, i) => ({ x: 30 + (i % 4) * 3.6, y: 66 + Math.floor(i / 4) * 4.5, tone: 'amber' as const, label: 'product' })),
              ...Array.from({ length: 9 }, (_, i) => ({ x: 70 + (i % 3) * 3.5, y: 70 + Math.floor(i / 3) * 5, tone: 'violet' as const, label: 'churn' })),
            ]}
          />
          <div className="mt-2">
            <Legend items={[{ label: 'support', tone: 'brand' }, { label: 'billing', tone: 'pink' }, { label: 'product', tone: 'amber' }, { label: 'churn risk', tone: 'violet' }]} />
          </div>
        </ChartCard>
      </div>

      <Section index="03" title="Cohorts" description="Segment performance, sortable" flush>
        <TableToolbar
          search=""
          onSearch={() => undefined}
          placeholder="Search cohorts…"
          count="5 segments"
          filters={<Badge tone="neutral" variant="outline">All plans</Badge>}
          actions={<IconButton label="Export cohort" size="sm" variant="ghost"><Download className="h-3.5 w-3.5" /></IconButton>}
        />
        <Table>
          <TableHead>
            <tr>
              <Th>Segment</Th>
              <Th>Plan</Th>
              <Th align="right" sortable active>Sessions</Th>
              <Th align="right">7-day retention</Th>
              <Th align="right">Spend</Th>
              <Th align="right">Trend</Th>
            </tr>
          </TableHead>
          <tbody>
            {cohorts.map(cohort => (
              <Tr key={cohort.id}>
                <Td className="font-semibold text-ink">{cohort.name}</Td>
                <Td><Badge tone={cohort.workspace === 'Enterprise' ? 'brand' : 'neutral'} variant="soft">{cohort.workspace}</Badge></Td>
                <Td align="right" mono>{cohort.sessions}</Td>
                <Td align="right"><DataBar value={cohort.retention} tone={cohort.retention > 80 ? 'success' : cohort.retention > 60 ? 'brand' : 'amber'} /></Td>
                <Td align="right" mono>{cohort.spend}</Td>
                <Td align="right"><span className="inline-block w-16"><MiniBars values={cohort.trend} height={18} /></span></Td>
              </Tr>
            ))}
          </tbody>
        </Table>
        <Pagination page={page} pages={4} onChange={setPage} total="1–5 of 18 segments" />
      </Section>

      <div className="grid gap-4 lg:grid-cols-3">
        <SurfacePanel label="Top prompts">
          <ol className="space-y-2">
            {[
              ['Summarise this ticket', '18.4K'],
              ['Draft customer reply', '12.1K'],
              ['Explain the chart', '9.8K'],
            ].map(([label, count], i) => (
              <li key={label} className="flex items-center gap-2 text-[10.5px]">
                <span className="font-mono text-[9px] text-faint">0{i + 1}</span>
                <span className="min-w-0 flex-1 truncate text-ink-soft">{label}</span>
                <span className="font-mono text-[9.5px] text-muted">{count}</span>
              </li>
            ))}
          </ol>
        </SurfacePanel>
        <SurfacePanel label="Error budget">
          <div className="flex items-center gap-3">
            <Gauge value={68} label="remaining" sublabel="2.1% of 3%" tone="amber" size={104} />
            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-between gap-3"><span className="text-muted">Allowed</span><span className="font-mono text-ink">3.0%</span></div>
              <div className="flex justify-between gap-3"><span className="text-muted">Consumed</span><span className="font-mono text-danger">0.9%</span></div>
              <div className="flex justify-between gap-3"><span className="text-muted">Burn rate</span><span className="font-mono text-ink">0.8×</span></div>
            </div>
          </div>
        </SurfacePanel>
        <SurfacePanel label="Quality signals">
          <div className="space-y-2.5">
            {[
              { label: 'Thumbs up rate', value: 94, tone: 'success' as const },
              { label: 'Grounded answers', value: 88, tone: 'brand' as const },
              { label: 'Guardrail trips', value: 12, tone: 'amber' as const },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-[10.5px]">
                  <span className="text-muted">{item.label}</span>
                  <span className="font-mono text-ink">{item.value}%</span>
                </div>
                <div className="mt-1">
                  <StackedBar height={5} segments={[{ label: item.label, value: item.value, tone: item.tone }]} />
                </div>
              </div>
            ))}
            <Button size="xs" variant="ghost" className="w-full" iconRight={<ArrowUpRight className="h-3 w-3" />}>Open quality report</Button>
          </div>
        </SurfacePanel>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="Segment">
          <Select defaultValue="all"><option value="all">All plans</option><option value="pro">Pro</option></Select>
        </Field>
        <Field label="Region">
          <Select defaultValue="all"><option value="all">All regions</option><option value="us">us-east-1</option></Select>
        </Field>
        <Field label="Model">
          <Select defaultValue="all"><option value="all">All models</option><option value="gpt">GPT-4o</option></Select>
        </Field>
        <Field label="Granularity">
          <Select defaultValue="hour"><option value="hour">Hourly</option><option value="day">Daily</option></Select>
        </Field>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface-2 px-3.5 py-2.5">
        <span className="flex items-center gap-2 text-[10.5px] text-muted">
          <Sparkline data={[8, 12, 10, 16, 14, 18, 17, 22, 20, 26]} height={20} className="w-16" />
          Requests trending up 12.4% week over week
        </span>
        <Button size="xs" variant="secondary" iconRight={<ArrowUpRight className="h-3 w-3" />}>Schedule this report</Button>
      </div>
    </div>
  );
}
