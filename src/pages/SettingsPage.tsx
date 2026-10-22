import { useState } from 'react';
import {
  AlertTriangle,
  Bell,
  Building2,
  Check,
  CreditCard,
  Download,
  KeyRound,
  Plus,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
} from 'lucide-react';
import { PageHeader } from '../components/layout/Page';
import { Button, IconButton } from '../components/ui/Button';
import { Badge, GradientBadge, StatusDot } from '../components/ui/Badge';
import { Field, Input, Select, Textarea, CopyField } from '../components/ui/Field';
import { Checkbox, Segmented, Switch } from '../components/ui/Controls';
import { Avatar } from '../components/ui/Avatar';
import { Alert, Progress, Toast } from '../components/ui/Feedback';
import { Modal } from '../components/ui/Overlay';
import { TokenMeter } from '../components/ui/AI';
import { cn } from '@/lib/utils';

type Tab = 'profile' | 'workspace' | 'keys' | 'billing' | 'notifications';

const tabs: { key: Tab; label: string; icon: typeof UserRound }[] = [
  { key: 'profile', label: 'Profile', icon: UserRound },
  { key: 'workspace', label: 'Workspace', icon: Building2 },
  { key: 'keys', label: 'API keys', icon: KeyRound },
  { key: 'billing', label: 'Billing', icon: CreditCard },
  { key: 'notifications', label: 'Notifications', icon: Bell },
];

const keys = [
  { name: 'Production server', prefix: 'sk-live-9f82…4a6f', scope: 'Full access', created: 'Aug 12, 2026', used: '2 min ago', status: 'active' },
  { name: 'CI pipeline', prefix: 'sk-live-4c11…8b02', scope: 'Read + inference', created: 'Jul 04, 2026', used: '1 h ago', status: 'active' },
  { name: 'Local prototype', prefix: 'sk-test-71aa…c93e', scope: 'Sandbox', created: 'Jun 18, 2026', used: '12 d ago', status: 'idle' },
];

const invoices = [
  { id: 'INV-2026-10', date: 'Oct 01, 2026', amount: '$1,824.50', status: 'Paid' },
  { id: 'INV-2026-09', date: 'Sep 01, 2026', amount: '$1,642.00', status: 'Paid' },
  { id: 'INV-2026-08', date: 'Aug 01, 2026', amount: '$1,208.40', status: 'Paid' },
];

export function SettingsPage() {
  const [tab, setTab] = useState<Tab>('profile');
  const [saved, setSaved] = useState(false);
  const [keyModal, setKeyModal] = useState(false);
  const [created, setCreated] = useState(false);
  const [plan, setPlan] = useState<'monthly' | 'annual'>('annual');
  const [checks, setChecks] = useState({ product: true, security: false, usage: true });
  const [notifications, setNotifications] = useState({ email: true, slack: true, digest: false, incidents: true, marketing: false });

  const save = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Product screen · settings"
        title="Settings"
        description="Five dense panels that share one layout: a vertical nav, grouped fields, and a sticky save bar. Everything below is live — switch tabs and toggle the controls."
        meta={
          <>
            <Badge tone="success" variant="soft"><StatusDot tone="success" /> SSO enforced</Badge>
            <Badge tone="neutral" variant="outline">SOC 2 Type II</Badge>
            <Badge tone="neutral" variant="outline">Role: owner</Badge>
          </>
        }
        actions={<Button iconLeft={<Check className="h-4 w-4" />} onClick={save}>{saved ? 'Saved' : 'Save changes'}</Button>}
      />

      {saved && (
        <div className="ds-rise">
          <Toast tone="success" title="Settings saved" description="Your workspace changes are live for all members." />
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[212px_1fr]">
        <nav aria-label="Settings sections" className="flex gap-1 overflow-x-auto lg:flex-col">
          {tabs.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={cn(
                  'flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-left text-[12px] font-medium transition',
                  tab === item.key
                    ? 'bg-surface text-ink shadow-xs ring-1 ring-line'
                    : 'text-muted hover:bg-surface-2 hover:text-ink',
                )}
              >
                <Icon className={cn('h-3.5 w-3.5', tab === item.key ? 'text-brand' : 'text-faint')} />
                {item.label}
                {tab === item.key && <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-brand lg:block" />}
              </button>
            );
          })}
          <div className="mt-3 hidden rounded-md border border-line bg-surface-2 p-3 lg:block">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-ink-soft">
              <ShieldCheck className="h-3 w-3 text-success" /> Secure by default
            </div>
            <p className="mt-1 text-[9.5px] leading-4 text-faint">Keys are hashed at rest. Rotate every 90 days.</p>
          </div>
        </nav>

        <div className="min-w-0 space-y-5">
          {tab === 'profile' && (
            <>
              <Panel title="Profile" description="How you appear to teammates and in generated reports.">
                <div className="flex flex-wrap items-center gap-4">
                  <Avatar initials="RK" size="xl" tone="pink" status="online" ring />
                  <div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary">Upload photo</Button>
                      <Button size="sm" variant="ghost">Remove</Button>
                    </div>
                    <p className="mt-1.5 text-[10px] text-faint">PNG or JPG, up to 2 MB. Square works best.</p>
                  </div>
                  <Badge tone="pink" variant="soft" className="ml-auto">Owner</Badge>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Field label="Full name"><Input defaultValue="Rania Khan" /></Field>
                  <Field label="Display name" hint="Shown in the activity feed."><Input defaultValue="Rania" /></Field>
                  <Field label="Email"><Input defaultValue="rania@unseen.ai" valid /></Field>
                  <Field label="Job title"><Input defaultValue="Design lead" /></Field>
                  <Field label="Timezone">
                    <Select defaultValue="ist">
                      <option value="ist">Asia/Kolkata · IST (UTC+5:30)</option>
                      <option value="utc">UTC</option>
                      <option value="pst">America/Los_Angeles · PST</option>
                    </Select>
                  </Field>
                  <Field label="Language">
                    <Select defaultValue="en"><option value="en">English</option><option value="de">Deutsch</option></Select>
                  </Field>
                </div>
                <Field label="Bio" className="mt-4" hint="Optional, max 160 characters.">
                  <Textarea defaultValue="Design systems, AI interfaces and the small details that make products feel inevitable." className="min-h-[76px]" />
                </Field>
              </Panel>
              <Panel title="Preferences" description="Personal, not workspace-wide.">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Switch checked label="Reduce motion" description="Respect my OS setting everywhere." onChange={() => undefined} />
                  <Switch checked={false} label="Compact tables" description="Smaller row height in data views." onChange={() => undefined} />
                  <Switch checked label="Show token costs" description="Display estimated spend on every response." onChange={() => undefined} />
                  <Switch checked={false} label="Beta features" description="Opt into new AI patterns early." onChange={() => undefined} />
                </div>
              </Panel>
            </>
          )}

          {tab === 'workspace' && (
            <>
              <Panel title="Workspace" description="Shared by everyone in your organization.">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[linear-gradient(140deg,#0E91F0,#F72685_60%,#FF7A0D)] text-xl font-black text-white shadow-brand">U</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary">Change logo</Button>
                    <Button size="sm" variant="ghost">Reset</Button>
                  </div>
                  <Badge tone="neutral" variant="outline" className="ml-auto">workspace-Prod</Badge>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Field label="Workspace name"><Input defaultValue="Unseen Labs" /></Field>
                  <Field label="Slug" hint="app.unseen.ai/labs"><Input defaultValue="labs" /></Field>
                  <Field label="Default model">
                    <Select defaultValue="gpt-4o">
                      <option value="gpt-4o">GPT-4o · OpenAI</option>
                      <option value="claude">Claude 3.5 · Anthropic</option>
                    </Select>
                  </Field>
                  <Field label="Region">
                    <Select defaultValue="iad">
                      <option value="iad">us-east-1 (Virginia)</option>
                      <option value="fra">eu-central-1 (Frankfurt)</option>
                    </Select>
                  </Field>
                </div>
                <div className="mt-4">
                  <Field label="Data retention" hint="Prompts and responses older than this are permanently deleted.">
                    <Segmented
                      value="90d"
                      onChange={() => undefined}
                      options={[
                        { value: '30d', label: '30 days' },
                        { value: '90d', label: '90 days' },
                        { value: '1y', label: '1 year' },
                      ]}
                    />
                  </Field>
                </div>
              </Panel>
              <Panel title="Members" description="3 owners · 8 editors · 14 viewers" action={<Button size="sm" variant="secondary" iconLeft={<Users className="h-3.5 w-3.5" />}>Manage</Button>}>
                <div className="space-y-3">
                  {[
                    { initials: 'RK', name: 'Rania Khan', email: 'rania@unseen.ai', role: 'Owner', tone: 'pink' as const },
                    { initials: 'MN', name: 'Marcus Ng', email: 'marcus@unseen.ai', role: 'Editor', tone: 'blue' as const },
                    { initials: 'SC', name: 'Sara Chen', email: 'sara@unseen.ai', role: 'Viewer', tone: 'mint' as const },
                  ].map(member => (
                    <div key={member.email} className="flex items-center gap-3">
                      <Avatar initials={member.initials} tone={member.tone} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11.5px] font-semibold text-ink">{member.name}</div>
                        <div className="text-[10px] text-faint">{member.email}</div>
                      </div>
                      <Badge tone={member.role === 'Owner' ? 'brand' : 'neutral'} variant={member.role === 'Owner' ? 'soft' : 'outline'}>{member.role}</Badge>
                      <IconButton label={`Options for ${member.name}`} size="xs" variant="ghost"><Download className="h-3.5 w-3.5 rotate-90" /></IconButton>
                    </div>
                  ))}
                </div>
              </Panel>
              <Panel title="Danger zone" description="These actions affect the whole workspace.">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-danger/25 bg-danger-soft px-3.5 py-3">
                    <div>
                      <div className="text-[11.5px] font-semibold text-danger">Delete workspace</div>
                      <div className="text-[10px] text-danger/70">All models, keys and logs are removed after 30 days.</div>
                    </div>
                    <Button size="sm" variant="danger">Delete workspace</Button>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-line px-3.5 py-3">
                    <div>
                      <div className="text-[11.5px] font-semibold text-ink">Transfer ownership</div>
                      <div className="text-[10px] text-muted">Hand the workspace to another owner.</div>
                    </div>
                    <Button size="sm" variant="secondary">Transfer</Button>
                  </div>
                </div>
              </Panel>
            </>
          )}

          {tab === 'keys' && (
            <>
              <Panel
                title="API keys"
                description="Create scoped keys per service. Secrets are shown once."
                action={<Button size="sm" iconLeft={<Plus className="h-3.5 w-3.5" />} onClick={() => { setKeyModal(true); setCreated(false); }}>New key</Button>}
              >
                <div className="space-y-3">
                  {keys.map(key => (
                    <div key={key.name} className="rounded-xl border border-line bg-surface p-3.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cn('h-2 w-2 rounded-full', key.status === 'active' ? 'bg-success' : 'bg-faint')} />
                        <span className="text-[12px] font-semibold text-ink">{key.name}</span>
                        <Badge tone={key.status === 'active' ? 'success' : 'neutral'} variant="soft">{key.status}</Badge>
                        <Badge tone="neutral" variant="outline" className="ml-auto">{key.scope}</Badge>
                      </div>
                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        <code className="rounded-md border border-line bg-surface-2 px-2 py-1 font-mono text-[10.5px] text-ink-soft">{key.prefix}</code>
                        <span className="font-mono text-[9.5px] text-faint">created {key.created}</span>
                        <span className="font-mono text-[9.5px] text-faint">· used {key.used}</span>
                        <div className="ml-auto flex gap-1">
                          <Button size="xs" variant="ghost">Revoke</Button>
                          <Button size="xs" variant="secondary">Rotate</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Alert tone="brand" title="Rotating is safe" className="mt-4">
                  Old keys keep working for 24 hours so you can roll deployments without downtime.
                </Alert>
              </Panel>
              <Panel title="Environment" description="Copy the values your SDK needs.">
                <div className="space-y-3">
                  <CopyField label="Base URL" value="https://api.unseen.ai/v2" />
                  <CopyField label="Webhook secret" value="whsec_8f21c4b2a9de" masked />
                </div>
              </Panel>
            </>
          )}

          {tab === 'billing' && (
            <>
              <Panel title="Plan" description="Pro · 25 seats · billed annually">
                <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
                  <div className="relative overflow-hidden rounded-xl border border-brand/30 bg-[linear-gradient(150deg,var(--ds-brand-soft),var(--ds-surface))] p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand">Current plan</div>
                        <div className="mt-1 text-xl font-extrabold tracking-tight text-ink">Pro</div>
                      </div>
                      <GradientBadge><Sparkles className="h-3 w-3" /> AI</GradientBadge>
                    </div>
                    <p className="mt-2 text-[11px] leading-5 text-muted">Unlimited playground, 2M requests / mo, SSO, audit logs and priority routing.</p>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-ink">$49</span>
                      <span className="text-[10px] text-muted">/ seat / mo</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm">Upgrade to Scale</Button>
                      <Button size="sm" variant="secondary">Manage plan</Button>
                    </div>
                  </div>
                  <div className="rounded-xl border border-line bg-surface p-4">
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Usage this cycle</div>
                    <div className="mt-3 space-y-3">
                      <TokenMeter used={48200} total={100000} label="Tokens" />
                      <TokenMeter used={1284392} total={2000000} label="Requests" tone="pink" />
                      <div>
                        <div className="flex justify-between text-[10.5px]">
                          <span className="font-semibold text-ink-soft">Spend</span>
                          <span className="font-mono text-muted">$1,824 / $2,500</span>
                        </div>
                        <Progress value={73} size="sm" />
                      </div>
                    </div>
                    <div className="mt-3 rounded-md bg-warning-soft px-2.5 py-1.5 text-[10px] text-warning">
                      Rate limit resets in 6 days.
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line px-3.5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-12 place-items-center rounded-md bg-surface-3 font-mono text-[9px] font-bold text-ink-soft">VISA</span>
                    <div>
                      <div className="text-[11.5px] font-semibold text-ink">•••• 4242</div>
                      <div className="text-[10px] text-faint">Expires 08 / 2028</div>
                    </div>
                  </div>
                  <Button size="sm" variant="secondary">Update payment</Button>
                </div>
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Billing cycle</span>
                    <Segmented
                      size="sm"
                      value={plan}
                      onChange={setPlan}
                      options={[
                        { value: 'monthly', label: 'Monthly' },
                        { value: 'annual', label: 'Annual · save 20%' },
                      ]}
                    />
                  </div>
                  <div className="overflow-hidden rounded-xl border border-line">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-surface-2 text-[9px] font-bold uppercase tracking-[0.1em] text-faint">
                        <tr>
                          <th className="px-3 py-2">Invoice</th>
                          <th className="px-3 py-2">Date</th>
                          <th className="px-3 py-2">Amount</th>
                          <th className="px-3 py-2">Status</th>
                          <th className="px-3 py-2" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line">
                        {invoices.map(invoice => (
                          <tr key={invoice.id} className="transition hover:bg-surface-2">
                            <td className="px-3 py-2.5 font-mono text-[10px] text-ink-soft">{invoice.id}</td>
                            <td className="px-3 py-2.5 text-muted">{invoice.date}</td>
                            <td className="px-3 py-2.5 font-mono text-[10.5px] text-ink-soft">{invoice.amount}</td>
                            <td className="px-3 py-2.5"><Badge tone="success" variant="soft">{invoice.status}</Badge></td>
                            <td className="px-3 py-2.5 text-right"><Button size="xs" variant="ghost" iconLeft={<Download className="h-3 w-3" />}>PDF</Button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Panel>
            </>
          )}

          {tab === 'notifications' && (
            <>
              <Panel title="Notification channels" description="Where we send alerts and product updates.">
                <div className="space-y-4">
                  <Switch checked={notifications.email} onChange={v => setNotifications(n => ({ ...n, email: v }))} label="Email" description="rania@unseen.ai" />
                  <Switch checked={notifications.slack} onChange={v => setNotifications(n => ({ ...n, slack: v }))} label="Slack" description="#unseen-alerts" />
                  <CopyField label="Slack webhook" value="https://hooks.slack.com/services/T04/B08/9f82" />
                </div>
              </Panel>
              <Panel title="What to send" description="Frequency controls per category.">
                <div className="space-y-3">
                  <Checkbox checked={checks.product} onChange={v => setChecks(c => ({ ...c, product: v }))} label="Product updates" description="New patterns, components and changelog." />
                  <Checkbox checked={checks.security} onChange={v => setChecks(c => ({ ...c, security: v }))} label="Security alerts" description="Key rotation, SSO changes, unusual access." />
                  <Checkbox checked={checks.usage} onChange={v => setChecks(c => ({ ...c, usage: v }))} label="Usage & billing" description="Budget thresholds and invoice reminders." />
                </div>
                <div className="mt-5 border-t border-line pt-4">
                  <Switch checked={notifications.incidents} onChange={v => setNotifications(n => ({ ...n, incidents: v }))} label="Incident notifications" description="Provider outages and degraded models, in real time." />
                  <div className="mt-4">
                    <Switch checked={notifications.digest} onChange={v => setNotifications(n => ({ ...n, digest: v }))} label="Weekly digest" description="A Monday summary of spend, errors and top prompts." />
                  </div>
                  <div className="mt-4">
                    <Switch checked={notifications.marketing} onChange={v => setNotifications(n => ({ ...n, marketing: v }))} label="Marketing email" />
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface-2 px-3.5 py-3">
                  <span className="inline-flex items-center gap-2 text-[11px] text-muted"><Bell className="h-3.5 w-3.5 text-brand" /> Quiet hours</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-ink-soft">22:00 — 07:00 IST</span>
                    <Button size="xs" variant="secondary">Edit</Button>
                  </div>
                </div>
              </Panel>
            </>
          )}
        </div>
      </div>

      <Modal
        open={keyModal}
        onClose={() => setKeyModal(false)}
        title={created ? 'Key created' : 'Create API key'}
        description={created ? 'Copy it now — you will not see it again.' : 'Scope the key to the minimum your service needs.'}
        footer={
          created ? (
            <Button size="sm" onClick={() => setKeyModal(false)}>Done</Button>
          ) : (
            <>
              <Button size="sm" variant="secondary" onClick={() => setKeyModal(false)}>Cancel</Button>
              <Button size="sm" onClick={() => setCreated(true)}>Create key</Button>
            </>
          )
        }
      >
        {created ? (
          <div className="space-y-4">
            <Alert tone="warning" title="Store this secret securely">
              It will be hidden permanently after you close this dialog.
            </Alert>
            <CopyField label="Secret key" value="sk-live-2b7f91c04de84a12b0f6" />
            <div className="rounded-md border border-line bg-surface-2 p-3 text-[11px] text-muted">
              <div className="flex items-center gap-1.5 font-semibold text-ink-soft"><ShieldCheck className="h-3.5 w-3.5 text-success" /> Recommended</div>
              <p className="mt-1">Add it as <span className="font-mono text-ink-soft">UNSEEN_KEY</span> in your hosting provider’s secret manager.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Field label="Key name" required><Input placeholder="Production server" /></Field>
            <Field label="Scope">
              <Select defaultValue="full">
                <option value="full">Full access</option>
                <option value="read">Read + inference</option>
                <option value="sandbox">Sandbox only</option>
              </Select>
            </Field>
            <Field label="Expiry">
              <Segmented
                value="90d"
                onChange={() => undefined}
                options={[
                  { value: '30d', label: '30 days' },
                  { value: '90d', label: '90 days' },
                  { value: 'never', label: 'Never' },
                ]}
              />
            </Field>
            <div className="flex items-start gap-2 rounded-md bg-warning-soft p-3 text-[10.5px] leading-5 text-warning">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Keys with full access can create models and delete data. Prefer scoped keys for CI.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Panel({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-line bg-surface shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <div>
          <h2 className="text-[13px] font-semibold text-ink">{title}</h2>
          {description && <p className="mt-0.5 text-[11px] text-muted">{description}</p>}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
