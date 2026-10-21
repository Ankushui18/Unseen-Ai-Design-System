import { useState } from 'react';
import { AlertTriangle, ArrowLeft, CloudOff, Compass, FileQuestion, Lock, RefreshCw, Search, ServerCrash, ShieldX, WifiOff, Wrench } from 'lucide-react';
import { PageHeader, Section } from '../components/layout/Page';
import { Button } from '../components/ui/Button';
import { Badge, GradientBadge, Kbd, StatusDot } from '../components/ui/Badge';
import { EmptyState, Skeleton } from '../components/ui/Feedback';
import { Skeleton as Sk } from '../components/ui/Feedback';
import { Alert } from '../components/ui/Feedback';
import { Field, Input } from '../components/ui/Field';
import { Segmented } from '../components/ui/Controls';
import { cn } from '@/lib/utils';

type StateKind = '404' | '500' | '403' | 'offline' | 'maintenance' | 'ratelimit';

function StatePreview({ kind }: { kind: StateKind }) {
  const config = {
    '404': {
      code: '404',
      icon: Compass,
      title: 'This page took a different route.',
      body: 'The model or page you’re looking for was renamed, moved, or never existed. Check the URL, or jump back to the dashboard.',
      tone: 'brand' as const,
      actions: (
        <>
          <Button size="sm" iconLeft={<ArrowLeft className="h-3.5 w-3.5" />}>Back to dashboard</Button>
          <Button size="sm" variant="secondary" iconLeft={<Search className="h-3.5 w-3.5" />}>Search models</Button>
        </>
      ),
    },
    '500': {
      code: '500',
      icon: ServerCrash,
      title: 'We hit an error on our side.',
      body: 'The request failed before reaching a model. Your tokens were not billed. Incident INC-4821 is being investigated.',
      tone: 'danger' as const,
      actions: (
        <>
          <Button size="sm" iconLeft={<RefreshCw className="h-3.5 w-3.5" />}>Retry request</Button>
          <Button size="sm" variant="secondary">View status page</Button>
        </>
      ),
    },
    '403': {
      code: '403',
      icon: ShieldX,
      title: 'Your role can’t do that.',
      body: 'Editing billing requires the owner or admin role. Ask a workspace owner to upgrade your access, or switch workspaces.',
      tone: 'warning' as const,
      actions: (
        <>
          <Button size="sm" variant="secondary" iconLeft={<Lock className="h-3.5 w-3.5" />}>Request access</Button>
          <Button size="sm" variant="ghost">Switch workspace</Button>
        </>
      ),
    },
    offline: {
      code: 'OFFLINE',
      icon: WifiOff,
      title: 'You’re offline.',
      body: 'Changes are queued locally and will sync when the connection returns. Drafts are safe.',
      tone: 'neutral' as const,
      actions: (
        <>
          <Button size="sm" iconLeft={<CloudOff className="h-3.5 w-3.5" />}>Work offline</Button>
          <Button size="sm" variant="secondary">Retry connection</Button>
        </>
      ),
    },
    maintenance: {
      code: 'MAINT',
      icon: Wrench,
      title: 'Scheduled maintenance.',
      body: 'We’re upgrading the router between 02:00 and 02:20 UTC. In-flight requests complete normally; new ones queue for up to 3 minutes.',
      tone: 'brand' as const,
      actions: (
        <>
          <Button size="sm">Notify me when done</Button>
          <Button size="sm" variant="secondary">Read the changelog</Button>
        </>
      ),
    },
    ratelimit: {
      code: '429',
      icon: AlertTriangle,
      title: 'Rate limit reached.',
      body: 'You’ve used 2,000 of 2,000 requests this minute. The window resets in 12 seconds — or upgrade for 5× the limit.',
      tone: 'warning' as const,
      actions: (
        <>
          <Button size="sm" iconLeft={<RefreshCw className="h-3.5 w-3.5" />}>Retry in 12s</Button>
          <Button size="sm" variant="secondary">Upgrade plan</Button>
        </>
      ),
    },
  }[kind];

  const Icon = config.icon;
  const toneRing = {
    brand: 'bg-brand-soft text-brand',
    danger: 'bg-danger-soft text-danger',
    warning: 'bg-warning-soft text-warning',
    neutral: 'bg-surface-3 text-muted',
  }[config.tone];

  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-surface">
      <div className="pointer-events-none absolute inset-0 ds-dotted opacity-[0.5]" />
      <div className="relative flex flex-col items-center px-5 py-8 text-center">
        <div className="flex items-center gap-2">
          <span className={cn('grid h-11 w-11 place-items-center rounded-xl', toneRing)}>
            <Icon className="h-5 w-5" />
          </span>
          <span className="font-mono text-[26px] font-extrabold tracking-tight text-ink">{config.code}</span>
        </div>
        <h3 className="mt-3 text-[15px] font-bold tracking-[-0.01em] text-ink">{config.title}</h3>
        <p className="mt-1.5 max-w-sm text-[11px] leading-5 text-muted">{config.body}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">{config.actions}</div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 border-t border-line pt-3 text-[9px] text-faint">
          <span className="font-mono">req_9f82b41c</span>
          <span>·</span>
          <span>trace available for 30 days</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1"><StatusDot tone="success" /> API healthy</span>
        </div>
      </div>
    </div>
  );
}

export function StatesPage() {
  const [kind, setKind] = useState<StateKind>('404');
  const [loading, setLoading] = useState(true);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Product screen · states"
        title="Empty, error & loading"
        description="The screens nobody designs until they ship. Every state has a message, an action and a way back — plus a trace id when something fails."
        meta={
          <>
            <Badge tone="neutral" variant="outline">6 error states</Badge>
            <Badge tone="neutral" variant="outline">3 loading patterns</Badge>
            <Badge tone="neutral" variant="outline">5 empty variants</Badge>
          </>
        }
        actions={
          <Segmented
            value={loading ? 'loading' : 'loaded'}
            onChange={v => setLoading(v === 'loading')}
            size="sm"
            options={[
              { value: 'loading', label: 'Loading' },
              { value: 'loaded', label: 'Loaded' },
            ]}
          />
        }
      />

      <Section
        index="01"
        title="Full-page states"
        description="Centred, branded, never a dead end"
        aside={
          <div className="flex flex-wrap items-center gap-1">
            {(['404', '500', '403', 'offline', 'maintenance', 'ratelimit'] as StateKind[]).map(item => (
              <button
                key={item}
                onClick={() => setKind(item)}
                className={cn(
                  'rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold transition',
                  kind === item ? 'bg-inverse text-on-inverse' : 'text-muted hover:text-ink',
                )}
              >
                {item}
              </button>
            ))}
          </div>
        }
      >
        <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
          <StatePreview kind={kind} />

          <div className="space-y-3">
            <div className="rounded-xl border border-line bg-surface p-3.5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Anatomy</span>
                <Badge tone="neutral" variant="outline">{kind}</Badge>
              </div>
              <ol className="space-y-2">
                {[
                  ['Icon + code', 'One visual anchor, 44px, semantic tone.'],
                  ['Title', 'Plain language, no blame, ≤ 60 characters.'],
                  ['Body', 'What happened + what it means for the user’s data.'],
                  ['Actions', 'Primary recovery path, then a secondary escape.'],
                  ['Trace', 'Request id so support can find the exact run.'],
                ].map(([label, desc], i) => (
                  <li key={label} className="flex items-start gap-2">
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand-soft font-mono text-[8px] font-bold text-brand">{i + 1}</span>
                    <span className="text-[10px] leading-4 text-muted">
                      <strong className="font-semibold text-ink-soft">{label}</strong> — {desc}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <Alert tone="brand" title="Copy rules">
              Say what happened, not “Oops”. Never blame the user. Always offer a way forward, and never show a raw stack trace.
            </Alert>
            <div className="flex items-center justify-between rounded-lg border border-line bg-surface-2 px-3 py-2 text-[10px] text-muted">
              <span>Error copy reviewed by support</span>
              <span className="font-mono text-[9px] text-faint">v2.0</span>
            </div>
          </div>
        </div>
      </Section>

      <div className="grid gap-4 xl:grid-cols-2">
        <Section index="02" title="Loading" description="Skeletons that match the final layout">
          <div className="space-y-4">
            <div className="rounded-lg border border-line bg-surface-2 p-3">
              <div className="flex items-center gap-2.5">
                <Sk className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Sk className="h-2.5 w-28" />
                  <Sk className="h-2 w-40" />
                </div>
                <Sk className="h-5 w-14" />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <Sk className="h-12" />
                <Sk className="h-12" />
                <Sk className="h-12" />
              </div>
              <div className="mt-2 space-y-1.5">
                <Sk className="h-2 w-full" />
                <Sk className="h-2 w-4/5" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-line bg-surface p-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-line-strong border-t-brand" />
                  <span className="text-[10px] text-muted">Spinner · inline action</span>
                </div>
              </div>
              <div className="rounded-lg border border-line bg-surface p-2.5">
                <div className="flex items-center gap-2">
                  <span className="flex gap-0.5">
                    {[0, 1, 2].map(i => (
                      <span key={i} className="h-1.5 w-1.5 rounded-full bg-brand ds-pulse" style={{ animationDelay: `${i * 160}ms` }} />
                    ))}
                  </span>
                  <span className="text-[10px] text-muted">Typing · generation</span>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-line bg-surface p-3">
              <div className="mb-2 flex items-center justify-between text-[10px]">
                <span className="font-semibold text-ink-soft">Long-running job</span>
                <span className="font-mono text-faint">62%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
                <div className="h-full w-[62%] rounded-full bg-[linear-gradient(90deg,#38AEFA,#0272C6)]" />
              </div>
              <p className="mt-1.5 text-[9.5px] text-faint">Fine-tune · est. 4 min remaining · safe to close this tab</p>
            </div>
            <Button size="sm" variant="secondary" onClick={() => setLoading(l => !l)}>
              Toggle skeleton demo
            </Button>
          </div>
        </Section>

        <Section index="03" title="Empty states" description="Teach the product, don’t apologise">
          <div className="space-y-3">
            {loading ? (
              <>
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </>
            ) : (
              <>
                <EmptyState
                  icon={<FileQuestion className="h-5 w-5" />}
                  title="No datasets yet"
                  description="Upload a golden set to start evaluating prompts against real answers."
                  action={<Button size="sm">Upload dataset</Button>}
                />
                <EmptyState
                  tone="amber"
                  icon={<Search className="h-5 w-5" />}
                  title="No runs match these filters"
                  description="Try widening the date range or clearing the model filter."
                  action={<Button size="sm" variant="outline">Clear filters</Button>}
                />
                <EmptyState
                  tone="neutral"
                  icon={<Lock className="h-5 w-5" />}
                  title="Audit log is empty"
                  description="Events appear here once your workspace has activity. Retention: 12 months."
                  action={<Button size="sm" variant="secondary">Read about audit logs</Button>}
                />
              </>
            )}
          </div>
        </Section>
      </div>

      <Section index="04" title="Inline states" description="Partial failures inside a working page">
        <div className="grid gap-3 lg:grid-cols-3">
          <div className="rounded-lg border border-danger/25 bg-danger-soft p-3">
            <div className="flex items-center gap-2 text-[10.5px] font-semibold text-danger">
              <ServerCrash className="h-3.5 w-3.5" /> Chart failed to load
            </div>
            <p className="mt-1 text-[9.5px] leading-4 text-danger/80">Metrics service timed out after 8s. The rest of the page is unaffected.</p>
            <Button size="xs" variant="secondary" className="mt-2">Retry chart</Button>
          </div>
          <div className="rounded-lg border border-warning/30 bg-warning-soft p-3">
            <div className="flex items-center gap-2 text-[10.5px] font-semibold text-warning">
              <AlertTriangle className="h-3.5 w-3.5" /> Stale data
            </div>
            <p className="mt-1 text-[9.5px] leading-4 text-warning/80">Last successful sync was 14 minutes ago. Values may lag.</p>
            <Button size="xs" variant="secondary" className="mt-2">Refresh now</Button>
          </div>
          <div className="rounded-lg border border-line bg-surface-2 p-3">
            <div className="flex items-center gap-2 text-[10.5px] font-semibold text-ink-soft">
              <CloudOff className="h-3.5 w-3.5 text-muted" /> Offline queue
            </div>
            <p className="mt-1 text-[9.5px] leading-4 text-muted">3 edits saved locally. They’ll sync automatically when you reconnect.</p>
            <div className="mt-2 flex items-center gap-1.5 font-mono text-[9px] text-faint">
              <StatusDot tone="warning" /> queued · 3
            </div>
          </div>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <div className="rounded-lg border border-line bg-surface p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-faint">Form-level error summary</div>
            <Field label="Webhook URL" error="Must be HTTPS and respond within 10s.">
              <Input invalid defaultValue="http://internal.hook" />
            </Field>
            <div className="mt-2 flex items-center gap-2 text-[9.5px] text-faint">
              <Kbd>⌘</Kbd>
              <Kbd>⏎</Kbd>
              to revalidate
            </div>
          </div>
          <div className="rounded-lg border border-line bg-surface p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-faint">Permission wall</div>
            <div className="flex items-start gap-2.5 rounded-md bg-surface-2 p-2.5">
              <Lock className="mt-0.5 h-3.5 w-3.5 text-muted" />
              <div>
                <div className="text-[10.5px] font-semibold text-ink">Billing is owner-only</div>
                <p className="text-[9.5px] leading-4 text-muted">You’re an editor. Ask Rania to enable billing access.</p>
              </div>
              <GradientBadge className="ml-auto">RBAC</GradientBadge>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
