import { useState } from 'react';
import { ArrowRight, Bot, Check, CircleStop, Clock, GitBranch, Play, Plus, RefreshCw, ShieldCheck, Sparkles, Wrench, Zap } from 'lucide-react';
import { PageHeader, Section, SurfacePanel } from '../components/layout/Page';
import { Button, IconButton } from '../components/ui/Button';
import { Badge, GradientBadge, StatusDot } from '../components/ui/Badge';
import { Segmented } from '../components/ui/Controls';
import { TokenMeter } from '../components/ui/AI';
import { GuardrailBanner, RunTrace, ToolCallCard, TokenCounter } from '../components/ui/AIExtra';
import { KeyValue, StatCard, Timeline } from '../components/ui/DataDisplay';
import { Progress } from '../components/ui/Feedback';
import { Gauge, MiniBars } from '../components/ui/Charts';
import { cn } from '@/lib/utils';

const runs = [
  { id: 'run_9f82', name: 'Weekly revenue digest', status: 'succeeded', started: '07:00', duration: '1m 42s', steps: 6, tokens: '18.4K', cost: '$0.11', trigger: 'schedule' },
  { id: 'run_9f81', name: 'Support escalation triage', status: 'succeeded', started: '06:12', duration: '48s', steps: 4, tokens: '6.2K', cost: '$0.04', trigger: 'webhook' },
  { id: 'run_9f80', name: 'Competitor pricing scan', status: 'running', started: '06:00', duration: '2m 10s', steps: 5, tokens: '42.1K', cost: '$0.18', trigger: 'schedule' },
  { id: 'run_9f7f', name: 'Churn risk sweep', status: 'failed', started: '05:30', duration: '22s', steps: 2, tokens: '3.4K', cost: '$0.02', trigger: 'manual' },
  { id: 'run_9f7e', name: 'Invoice anomaly check', status: 'succeeded', started: '04:00', duration: '36s', steps: 3, tokens: '4.8K', cost: '$0.03', trigger: 'schedule' },
];

const trace = [
  { id: 's1', label: 'Fetch billing exports', kind: 'tool' as const, duration: '840ms' },
  { id: 's2', label: 'Aggregate by workspace', kind: 'tool' as const, duration: '312ms' },
  { id: 's3', label: 'Guard: PII redaction', kind: 'guard' as const, duration: '6ms' },
  { id: 's4', label: 'Draft digest · gpt-4o', kind: 'llm' as const, duration: '18.2s', tokens: '12.4K' },
  { id: 's5', label: 'Human approval', kind: 'human' as const, duration: '52s' },
  { id: 's6', label: 'Post to #revenue', kind: 'tool' as const, duration: '204ms' },
];

export function AgentsPage() {
  const [filter, setFilter] = useState<'all' | 'running' | 'failed'>('all');
  const [selected, setSelected] = useState(runs[0].id);
  const visible = runs.filter(run => (filter === 'all' ? true : filter === 'failed' ? run.status === 'failed' : run.status === 'running'));

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Product screen · agents"
        title="Agent runs"
        description="Long-running workflows with observable steps: every tool call, guardrail and human approval is a first-class row you can inspect and replay."
        meta={
          <>
            <Badge tone="success" variant="soft"><StatusDot tone="success" pulse /> 3 healthy</Badge>
            <Badge tone="danger" variant="soft">1 failed</Badge>
            <Badge tone="neutral" variant="outline">6 workflows</Badge>
          </>
        }
        actions={
          <>
            <Button variant="secondary" iconLeft={<RefreshCw className="h-4 w-4" />}>Replay last</Button>
            <Button iconLeft={<Plus className="h-4 w-4" />}>New workflow</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Runs today" value="148" delta="+12%" data={[12, 16, 14, 20, 18, 24, 22, 28]} tone="brand" icon={<Zap className="h-3.5 w-3.5" />} />
        <StatCard label="Success rate" value="96.6%" delta="+1.2%" data={[92, 93, 94, 93, 95, 96, 95, 97]} tone="success" icon={<Check className="h-3.5 w-3.5" />} />
        <StatCard label="Avg duration" value="52s" delta="−9%" trend="up" data={[70, 66, 68, 60, 58, 54, 56, 52]} tone="pink" icon={<Clock className="h-3.5 w-3.5" />} />
        <StatCard label="Cost / run" value="$0.06" delta="+2%" data={[3, 4, 3, 5, 4, 6, 5, 6]} tone="amber" footer="budget $0.10" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[.95fr_1.4fr]">
        <Section
          index="01"
          title="Runs"
          description={undefined}
          flush
          aside={
            <div className="flex items-center gap-1">
              {(['all', 'running', 'failed'] as const).map(item => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[9.5px] font-semibold capitalize transition',
                    filter === item ? 'bg-inverse text-on-inverse' : 'text-muted hover:text-ink',
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          }
        >
          <div className="divide-y divide-line">
            {visible.map(run => (
              <button
                key={run.id}
                onClick={() => setSelected(run.id)}
                className={cn(
                  'flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition',
                  selected === run.id ? 'bg-brand-soft/60' : 'hover:bg-surface-2',
                )}
              >
                <span
                  className={cn(
                    'grid h-6 w-6 shrink-0 place-items-center rounded-md',
                    run.status === 'succeeded' ? 'bg-success-soft text-success' : run.status === 'running' ? 'bg-brand-soft text-brand' : 'bg-danger-soft text-danger',
                  )}
                >
                  {run.status === 'succeeded' ? <Check className="h-3 w-3" strokeWidth={3} /> : run.status === 'running' ? <Sparkles className="h-3 w-3" /> : <CircleStop className="h-3 w-3" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[11px] font-semibold text-ink">{run.name}</span>
                  <span className="block font-mono text-[9px] text-faint">{run.id} · {run.trigger} · {run.started}</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block font-mono text-[9.5px] text-ink-soft">{run.duration}</span>
                  <span className="block font-mono text-[8.5px] text-faint">{run.cost}</span>
                </span>
                <ArrowRight className={cn('h-3 w-3 shrink-0', selected === run.id ? 'text-brand' : 'text-faint')} />
              </button>
            ))}
          </div>
          <div className="border-t border-line bg-surface-2/60 px-3 py-2 text-[9.5px] text-faint">
            Showing {visible.length} of {runs.length} · retention 30 days
          </div>
        </Section>

        <div className="space-y-4">
          <Section
            index="02"
            title="Trace"
            description={`${selected} · 6 steps · 1m 42s`}
            aside={
              <div className="flex items-center gap-1">
                <Button size="xs" variant="ghost" iconLeft={<GitBranch className="h-3 w-3" />}>Replay</Button>
                <Button size="xs" variant="secondary" iconLeft={<CircleStop className="h-3 w-3" />}>Cancel</Button>
              </div>
            }
          >
            <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
              <div className="space-y-3">
                <RunTrace steps={trace} />
                <div className="rounded-lg border border-line bg-surface-2 p-2.5">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-faint">Progress</span>
                    <span className="font-mono text-[9.5px] text-ink">6 / 6</span>
                  </div>
                  <Progress value={100} tone="success" size="sm" />
                  <div className="mt-2 flex items-center justify-between text-[9px] text-faint">
                    <span>started 07:00:02</span>
                    <span>finished 07:01:44</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <ToolCallCard name="stripe.listCharges" args={'{ "range": "last_week", "expand": ["customer"] }'} result={'{ "count": 482, "currency": "usd" }'} duration="840ms" />
                <ToolCallCard name="sql.aggregate" args={'{ "group_by": "workspace", "metric": "mrr" }'} result={'{ "rows": 12, "cached": true }'} duration="312ms" />
                <ToolCallCard name="slack.postMessage" args={'{ "channel": "#revenue", "blocks": 4 }'} result={'{ "ok": true, "ts": "1729501302.44" }'} duration="204ms" />
              </div>
            </div>
          </Section>

          <div className="grid gap-4 sm:grid-cols-3">
            <SurfacePanel label="Run health">
              <div className="flex items-center justify-around gap-2">
                <Gauge value={100} label="steps ok" size={96} tone="success" />
                <Gauge value={0} label="retries" size={96} tone="pink" />
              </div>
            </SurfacePanel>
            <SurfacePanel label="Context">
              <TokenCounter tokens={18400} limit={32000} breakdown={[{ label: 'tools', value: 46, tone: 'brand' }, { label: 'docs', value: 38, tone: 'pink' }, { label: 'summary', value: 16, tone: 'amber' }]} />
              <div className="mt-2 space-y-1 text-[9.5px] text-muted">
                <div className="flex justify-between"><span>Messages</span><span className="font-mono text-ink">14</span></div>
                <div className="flex justify-between"><span>Memory reads</span><span className="font-mono text-ink">3</span></div>
              </div>
            </SurfacePanel>
            <SurfacePanel label="Schedule">
              <div className="text-[10.5px] leading-5 text-muted">
                <div className="flex items-center gap-1.5 font-semibold text-ink"><Clock className="h-3 w-3 text-brand" /> Mondays 07:00</div>
                <div className="mt-1 font-mono text-[9.5px]">Asia/Kolkata · next run in 6d</div>
                <div className="mt-2 flex items-center gap-1">
                  <MiniBars values={[8, 9, 8, 10, 9, 11, 10]} height={16} tone="success" />
                  <span className="font-mono text-[8.5px] text-faint">7 runs</span>
                </div>
              </div>
            </SurfacePanel>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
        <Section index="03" title="Guardrails" description="Policy enforced before external side effects">
          <div className="space-y-3">
            <GuardrailBanner
              tone="success"
              title="All guardrails passed"
              rule="6 checks · 0 violations"
              description="PII redacted on 3 tool inputs, prompt-injection scan clean, spend under the $0.10/run cap."
              action={<Button size="xs" variant="secondary">View policy</Button>}
            />
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                { label: 'PII redaction', detail: '3 fields masked', ok: true },
                { label: 'Prompt injection', detail: 'no hits', ok: true },
                { label: 'Spend cap', detail: '$0.11 / $0.10', ok: false },
                { label: 'Tool allowlist', detail: '3 of 3 approved', ok: true },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 rounded-lg border border-line bg-surface-2 px-2.5 py-2">
                  <span className={cn('grid h-5 w-5 place-items-center rounded-full', item.ok ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning')}>
                    {item.ok ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : '!'}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[10.5px] font-medium text-ink">{item.label}</div>
                    <div className="font-mono text-[9px] text-faint">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-line bg-surface p-3">
              <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-faint">
                <ShieldCheck className="h-3 w-3 text-success" /> Human in the loop
              </div>
              <Timeline
                items={[
                  { id: 'a', title: 'Approval requested', time: '07:01:10', description: 'Draft digest posted to #revenue-approvals', tone: 'warning' as const },
                  { id: 'b', title: 'Approved by Sara Chen', time: '07:02:02', description: 'No edits · 52s to respond', tone: 'success' as const },
                  { id: 'c', title: 'Posted to #revenue', time: '07:02:04', tone: 'success' as const },
                ]}
              />
            </div>
          </div>
        </Section>

        <Section index="04" title="Workflows" description="Reusable agent definitions">
          <div className="space-y-2">
            {[
              { name: 'Weekly revenue digest', steps: 6, tools: ['stripe', 'sql', 'slack'], tone: 'success' as const, badge: 'live' },
              { name: 'Support escalation triage', steps: 4, tools: ['zendesk', 'linear'], tone: 'success' as const, badge: 'live' },
              { name: 'Competitor pricing scan', steps: 5, tools: ['web', 'sheets'], tone: 'brand' as const, badge: 'running' },
              { name: 'Churn risk sweep', steps: 7, tools: ['bigquery', 'salesforce', 'email'], tone: 'danger' as const, badge: 'failed' },
            ].map(workflow => (
              <div key={workflow.name} className="flex items-center gap-2.5 rounded-lg border border-line bg-surface p-2.5 transition hover:border-brand/35">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-surface-3 text-muted">
                  <Bot className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-[11px] font-semibold text-ink">{workflow.name}</span>
                    <StatusDot tone={workflow.tone} pulse={workflow.badge === 'running'} />
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1">
                    <span className="font-mono text-[8.5px] text-faint">{workflow.steps} steps</span>
                    {workflow.tools.map(tool => (
                      <span key={tool} className="inline-flex items-center gap-0.5 rounded-sm bg-surface-3 px-1 py-0.5 font-mono text-[8px] text-muted">
                        <Wrench className="h-2 w-2" /> {tool}
                      </span>
                    ))}
                  </div>
                </div>
                <IconButton label={`Run ${workflow.name}`} size="xs" variant="ghost"><Play className="h-3 w-3" /></IconButton>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg border border-dashed border-line-strong p-2.5 text-center">
            <Button size="xs" variant="ghost" iconLeft={<Plus className="h-3 w-3" />}>New workflow from template</Button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <SurfacePanel label="Queue">
              <KeyValue columns={1} items={[{ label: 'Waiting', value: '2' }, { label: 'Running', value: '1' }]} />
            </SurfacePanel>
            <SurfacePanel label="Concurrency">
              <TokenMeter used={3} total={10} label="slots" />
            </SurfacePanel>
          </div>
        </Section>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-[#0F0F1E] px-4 py-3 text-white">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-[linear-gradient(140deg,#0E91F0,#F72685)]">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <div>
            <div className="text-[11px] font-semibold">Agents eat tokens fast — cap them per run.</div>
            <div className="text-[9.5px] text-white/50">Spend caps and max-step limits stop runaway loops before they bill you.</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <GradientBadge>best practice</GradientBadge>
          <Button size="xs" variant="secondary" className="border-white/15 bg-white/10 text-white hover:bg-white/15 dark:bg-white/10 dark:text-white">Set caps</Button>
        </div>
      </div>
    </div>
  );
}
