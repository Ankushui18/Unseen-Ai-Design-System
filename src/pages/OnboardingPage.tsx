import { useState } from 'react';
import { ArrowLeft, ArrowRight, Building2, Check, Cloud, Cpu, Mail, Sparkles, Users, X, Zap } from 'lucide-react';
import { PageHeader, Section } from '../components/layout/Page';
import { Button } from '../components/ui/Button';
import { Badge, GradientBadge, Kbd, StatusDot } from '../components/ui/Badge';
import { Field, Input, Select, Textarea } from '../components/ui/Field';
import { Switch } from '../components/ui/Controls';
import { Avatar } from '../components/ui/Avatar';
import { Progress } from '../components/ui/Feedback';
import { OptionCards } from '../components/ui/Advanced';
import { Stepper } from '../components/ui/Navigation';
import { cn } from '@/lib/utils';

const steps = [
  { label: 'Workspace', description: 'Name and region' },
  { label: 'Use case', description: 'What you’re building' },
  { label: 'Plan', description: 'Pick a tier' },
  { label: 'Models', description: 'Route your first call' },
  { label: 'Invite', description: 'Bring the team' },
];

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: { monthly: 0, annual: 0 },
    blurb: 'For prototypes and side projects.',
    features: ['10K requests / month', '3 models', 'Community support', '7-day log retention'],
    tone: 'neutral' as const,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: { monthly: 79, annual: 63 },
    blurb: 'For teams shipping to real users.',
    features: ['1M requests / month', 'All models + routing', 'Evals and guardrails', '90-day logs · SSO'],
    tone: 'brand' as const,
    popular: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    price: { monthly: 499, annual: 399 },
    blurb: 'For high-volume production.',
    features: ['Unlimited requests', 'Dedicated capacity', 'Custom guardrails', '12-month logs · SCIM'],
    tone: 'pink' as const,
  },
];

const useCases = [
  { id: 'support', label: 'Support copilot', body: 'Answer tickets with your docs.' },
  { id: 'agents', label: 'Agents', body: 'Multi-step tools and approvals.' },
  { id: 'rag', label: 'Search / RAG', body: 'Grounded answers with citations.' },
  { id: 'batch', label: 'Batch jobs', body: 'Classification and extraction.' },
];

export function OnboardingPage() {
  const [step, setStep] = useState(2);
  const [plan, setPlan] = useState('pro');
  const [cycle, setCycle] = useState<'monthly' | 'annual'>('annual');
  const [useCase, setUseCase] = useState('support');
  const [invites, setInvites] = useState(['marcus@vantage.io', 'jules@vantage.io']);
  const [inviteDraft, setInviteDraft] = useState('');
  const [region, setRegion] = useState('us-east');
  const [analytics, setAnalytics] = useState(true);

  const selected = plans.find(p => p.id === plan) ?? plans[1];
  const price = cycle === 'annual' ? selected.price.annual : selected.price.monthly;

  const addInvite = () => {
    const value = inviteDraft.trim();
    if (value && value.includes('@') && !invites.includes(value)) {
      setInvites([...invites, value]);
      setInviteDraft('');
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Product screen · onboarding"
        title="Five steps, no dead ends."
        description="The wizard that gets a workspace from signup to a first successful call: naming, use case, plan, model routing and invites. Progress is always visible and every step is skippable."
        meta={
          <>
            <Badge tone="brand" variant="soft">5 steps</Badge>
            <Badge tone="neutral" variant="outline">skippable</Badge>
            <Badge tone="neutral" variant="outline">saved per step</Badge>
          </>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} iconLeft={<ArrowLeft className="h-3.5 w-3.5" />}>
              Back
            </Button>
            <Button size="sm" onClick={() => setStep(Math.min(steps.length - 1, step + 1))} disabled={step === steps.length - 1} iconRight={<ArrowRight className="h-3.5 w-3.5" />}>
              Next
            </Button>
          </div>
        }
      />

      <Section
        index="01"
        title="The wizard"
        description="Click the stepper to jump between steps"
        aside={<span className="font-mono text-[10px] text-faint">step {step + 1} of {steps.length}</span>}
      >
        <div className="mb-4">
          <Progress value={((step + 1) / steps.length) * 100} size="sm" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[190px_1fr]">
          <div>
            <Stepper orientation="vertical" current={step} steps={steps} onSelect={setStep} />
            <div className="mt-3 flex items-center gap-1.5 rounded-md bg-surface-2 px-2 py-1.5">
              <Kbd>⌘</Kbd>
              <Kbd>⏎</Kbd>
              <span className="text-[9px] text-faint">continue</span>
            </div>
          </div>

          <div className="min-w-0 rounded-xl border border-line bg-surface-2/60 p-4">
            {step === 0 && (
              <div className="max-w-md space-y-3">
                <div>
                  <h3 className="text-[15px] font-bold text-ink">Name your workspace</h3>
                  <p className="text-[11px] text-muted">You can rename it later in Settings.</p>
                </div>
                <Field label="Workspace name" hint="Appears in invites and invoices.">
                  <Input defaultValue="Vantage Labs" icon={<Building2 className="h-3.5 w-3.5" />} />
                </Field>
                <Field label="Workspace URL">
                  <Input defaultValue="vantage-labs" trailing={<span className="pr-1 font-mono text-[10px] text-faint">.unseen.ai</span>} />
                </Field>
                <Field label="Data region" hint="Where requests and logs are stored.">
                  <Select value={region} onChange={e => setRegion(e.target.value)}>
                    <option value="us-east">us-east-1 · Virginia</option>
                    <option value="eu-central">eu-central-1 · Frankfurt</option>
                    <option value="ap-south">ap-south-1 · Mumbai</option>
                  </Select>
                </Field>
                <Switch checked={analytics} onChange={setAnalytics} label="Share anonymous usage analytics" description="Helps us prioritise; never includes prompt content." />
              </div>
            )}

            {step === 1 && (
              <div className="space-y-3">
                <div>
                  <h3 className="text-[15px] font-bold text-ink">What are you building?</h3>
                  <p className="text-[11px] text-muted">We’ll preload the matching templates and evals.</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {useCases.map(item => {
                    const active = useCase === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setUseCase(item.id)}
                        className={cn(
                          'rounded-lg border p-3 text-left transition',
                          active ? 'border-brand/45 bg-brand-soft shadow-[0_0_0_2px_var(--ds-brand-ring)]' : 'border-line bg-surface hover:border-brand/30',
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className={cn('text-[11.5px] font-semibold', active ? 'text-brand' : 'text-ink')}>{item.label}</span>
                          {active && <Check className="h-3 w-3 text-brand" strokeWidth={3} />}
                        </div>
                        <p className="mt-0.5 text-[10px] leading-4 text-muted">{item.body}</p>
                      </button>
                    );
                  })}
                </div>
                <Field label="Anything else we should know?" hint="Optional — helps with onboarding.">
                  <Textarea placeholder="We handle ~4k support tickets a week across 6 languages…" />
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <h3 className="text-[15px] font-bold text-ink">Pick a plan</h3>
                    <p className="text-[11px] text-muted">14-day trial on every tier. Cancel anytime.</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-md border border-line bg-surface p-0.5">
                    {(['monthly', 'annual'] as const).map(c => (
                      <button
                        key={c}
                        onClick={() => setCycle(c)}
                        className={cn('rounded-sm px-2 py-1 text-[10px] font-semibold capitalize transition', cycle === c ? 'bg-inverse text-on-inverse' : 'text-muted hover:text-ink')}
                      >
                        {c}
                        {c === 'annual' && <span className={cn('ml-1 font-mono text-[8px]', cycle === c ? 'text-on-inverse/70' : 'text-success')}>−20%</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  {plans.map(p => {
                    const active = plan === p.id;
                    const amount = cycle === 'annual' ? p.price.annual : p.price.monthly;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setPlan(p.id)}
                        className={cn(
                          'relative flex flex-col rounded-xl border p-3 text-left transition',
                          active ? 'border-brand/50 bg-surface shadow-card ring-1 ring-brand/30' : 'border-line bg-surface hover:border-brand/30',
                        )}
                      >
                        {p.popular && <span className="absolute -top-2 right-2 rounded-full bg-[linear-gradient(100deg,#0E91F0,#F72685)] px-1.5 py-0.5 text-[8px] font-bold text-white">POPULAR</span>}
                        <div className="flex items-center justify-between">
                          <span className="text-[11.5px] font-bold text-ink">{p.name}</span>
                          <span className={cn('grid h-4 w-4 place-items-center rounded-full border', active ? 'border-brand bg-brand-fill text-on-brand' : 'border-line-strong')}>
                            {active && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-baseline gap-0.5">
                          <span className="font-mono text-[19px] font-extrabold text-ink">${amount}</span>
                          <span className="text-[9px] text-faint">/mo</span>
                        </div>
                        <p className="mt-0.5 text-[9.5px] leading-3 text-muted">{p.blurb}</p>
                        <ul className="mt-2 flex-1 space-y-1">
                          {p.features.map(f => (
                            <li key={f} className="flex gap-1 text-[9px] leading-4 text-muted">
                              <Check className="mt-0.5 h-2.5 w-2.5 shrink-0 text-success" strokeWidth={3} />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-surface px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Badge tone="brand" variant="soft">{selected.name}</Badge>
                    <span className="text-[10px] text-muted">
                      ${price}/mo{cycle === 'annual' ? ' billed annually' : ' billed monthly'} · {selected.features[0]}
                    </span>
                  </div>
                  <Button size="xs" variant="secondary">Compare all features</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <div>
                  <h3 className="text-[15px] font-bold text-ink">Route your first call</h3>
                  <p className="text-[11px] text-muted">Pick a default model and a fallback. You can change this per endpoint later.</p>
                </div>
                <OptionCards
                  columns={3}
                  value="balanced"
                  onChange={() => undefined}
                  options={[
                    { value: 'fast', label: 'Fast', description: 'gpt-4o-mini · 38ms', icon: <Zap className="h-3 w-3" /> },
                    { value: 'balanced', label: 'Balanced', description: 'gpt-4o · 412ms', icon: <Cpu className="h-3 w-3" /> },
                    { value: 'deep', label: 'Deep', description: 'o1 · 2.4s', icon: <Sparkles className="h-3 w-3" /> },
                  ]}
                />
                <div className="grid gap-2 sm:grid-cols-2">
                  <Field label="Primary model"><Select defaultValue="gpt-4o"><option>gpt-4o</option><option>claude-3.5</option><option>gemini-1.5</option></Select></Field>
                  <Field label="Fallback on 529"><Select defaultValue="claude"><option>claude-3.5</option><option>gpt-4o-mini</option><option>none</option></Select></Field>
                </div>
                <div className="rounded-lg border border-line bg-surface p-2.5">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[9.5px] font-semibold text-ink">Test call</span>
                    <span className="flex items-center gap-1 font-mono text-[8.5px] text-success"><StatusDot tone="success" /> 200 · 412ms</span>
                  </div>
                  <pre className="overflow-x-auto rounded bg-[#0C0C15] p-2 font-mono text-[9px] leading-4 text-white/70">{`curl https://api.unseen.ai/v2/chat/completions \\
  -H "Authorization: Bearer sk-live-••••" \\
  -d '{"model":"gpt-4o","messages":[{"role":"user","content":"ping"}]}'`}</pre>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="max-w-md space-y-3">
                <div>
                  <h3 className="text-[15px] font-bold text-ink">Invite your team</h3>
                  <p className="text-[11px] text-muted">Editors can build; admins can deploy and manage keys.</p>
                </div>
                <Field label="Email addresses">
                  <Input
                    value={inviteDraft}
                    onChange={e => setInviteDraft(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addInvite()}
                    placeholder="teammate@company.com"
                    icon={<Mail className="h-3.5 w-3.5" />}
                    trailing={<Button size="xs" variant="ghost" onClick={addInvite}>Add</Button>}
                  />
                </Field>
                <div className="space-y-1.5">
                  {invites.map(email => (
                    <div key={email} className="flex items-center gap-2 rounded-md border border-line bg-surface px-2.5 py-1.5">
                      <Avatar initials={email.slice(0, 2).toUpperCase()} size="xs" tone="soft" />
                      <span className="min-w-0 flex-1 truncate font-mono text-[10px] text-ink-soft">{email}</span>
                      <Select defaultValue="editor" className="h-6 w-24 text-[9.5px]"><option value="editor">Editor</option><option value="admin">Admin</option><option value="viewer">Viewer</option></Select>
                      <button onClick={() => setInvites(invites.filter(i => i !== email))} aria-label={`Remove ${email}`} className="text-faint transition hover:text-danger">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 rounded-md bg-surface-2 px-2 py-1.5 text-[9.5px] text-muted">
                  <Users className="h-3 w-3 text-brand" /> {invites.length} invited · {selected.name} includes 10 seats
                </div>
                <Button size="sm" className="w-full" iconLeft={<Cloud className="h-3.5 w-3.5" />}>Finish & open dashboard</Button>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
              <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="text-[10px] font-semibold text-muted hover:text-ink">
                Skip this step
              </button>
              <div className="flex items-center gap-2">
                {step > 0 && <Button size="xs" variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>}
                <Button size="xs" onClick={() => setStep(Math.min(steps.length - 1, step + 1))} iconRight={<ArrowRight className="h-3 w-3" />}>
                  {step === steps.length - 1 ? 'Finish' : 'Continue'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <div className="grid gap-4 lg:grid-cols-3">
        <Section index="02" title="Rules" description="Why it’s five steps and not nine">
          <ul className="space-y-2">
            {[
              ['One decision per step', 'Never ask for a plan and a model on the same screen.'],
              ['Progress is always visible', 'Stepper on desktop, bar on mobile — you always know the cost of finishing.'],
              ['Everything is skippable', 'A skipped step pre-fills a sensible default instead of blocking.'],
              ['Value before payment', 'The plan step shows the trial first; the card comes after the first call succeeds.'],
            ].map(([title, body]) => (
              <li key={title} className="flex gap-2">
                <Check className="mt-0.5 h-3 w-3 shrink-0 text-success" strokeWidth={3} />
                <span className="text-[10.5px] leading-4">
                  <strong className="font-semibold text-ink">{title}</strong>
                  <span className="text-muted"> — {body}</span>
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <Section index="03" title="Mobile" description="Same steps, one column">
          <div className="mx-auto w-[240px] rounded-2xl border border-line-strong bg-surface p-2 shadow-card">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[8px] text-faint">Step {step + 1} / 5</span>
              <span className="text-[8px] font-semibold text-brand">Skip</span>
            </div>
            <Progress value={((step + 1) / steps.length) * 100} size="sm" />
            <div className="mt-2 rounded-lg border border-line bg-surface-2 p-2">
              <div className="text-[10px] font-bold text-ink">{steps[step].label}</div>
              <div className="text-[8.5px] text-muted">{steps[step].description}</div>
              <div className="mt-2 space-y-1">
                <div className="h-5 rounded border border-line bg-surface" />
                <div className="h-5 rounded border border-line bg-surface" />
              </div>
              <div className="mt-2 h-6 rounded bg-brand-fill text-center text-[9px] font-semibold leading-6 text-on-brand">Continue</div>
            </div>
          </div>
        </Section>

        <Section index="04" title="Empty & error" description="If onboarding is interrupted">
          <div className="space-y-2">
            <div className="rounded-lg border border-line bg-surface p-2.5">
              <div className="text-[10px] font-semibold text-ink">Draft saved</div>
              <p className="text-[9.5px] leading-4 text-muted">Close the tab and we’ll resume at step {step + 1}. Drafts persist for 30 days.</p>
            </div>
            <div className="rounded-lg border border-warning/30 bg-warning-soft p-2.5">
              <div className="text-[10px] font-semibold text-warning">Seat limit reached</div>
              <p className="text-[9.5px] leading-4 text-warning/90">Pro includes 10 seats. Upgrade to Scale for unlimited, or finish with fewer invites.</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-surface-2 px-2.5 py-2">
              <GradientBadge>resume</GradientBadge>
              <span className="text-[9.5px] text-muted">Returning users land on the last incomplete step, not step 1.</span>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
