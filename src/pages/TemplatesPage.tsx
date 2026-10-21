import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Github,
  Globe,
  KeyRound,
  Lock,
  Mail,
  Sparkles,
  Users,
  Wand2,
} from 'lucide-react';
import { PageHeader, Section, SurfacePanel } from '../components/layout/Page';
import { Button } from '../components/ui/Button';
import { Badge, GradientBadge, StatusDot } from '../components/ui/Badge';
import { Field, Input, PasswordInput, Select } from '../components/ui/Field';
import { Checkbox } from '../components/ui/Controls';
import { Avatar, AvatarStack } from '../components/ui/Avatar';
import { Progress } from '../components/ui/Feedback';
import { AreaChart } from '../components/ui/AI';

const steps = ['Account', 'Workspace', 'Models', 'Invite'];

export function TemplatesPage() {
  const [step, setStep] = useState(1);
  const [invites, setInvites] = useState(['marcus@unseen.ai', 'jules@unseen.ai']);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Product screen · templates"
        title="Starts and finishes."
        description="The screens every AI product needs before the dashboard: sign in, onboarding, and the empty workspace that has to feel inviting rather than broken."
        meta={
          <>
            <Badge tone="brand" variant="soft">3 templates</Badge>
            <Badge tone="neutral" variant="outline">Keyboard-first</Badge>
            <Badge tone="neutral" variant="outline">SSO ready</Badge>
          </>
        }
        actions={<Button variant="secondary" iconLeft={<Copy className="h-4 w-4" />}>Copy layout</Button>}
      />

      <Section id="signin" index="01" title="Sign in" description="Split layout — brand story left, form right">
        <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
          <div className="grid lg:grid-cols-[1.05fr_1fr]">
            <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0B0B14] p-8 text-white lg:flex">
              <div className="absolute inset-0 ds-mesh opacity-60" />
              <div className="relative">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-md bg-[linear-gradient(140deg,#0E91F0,#F72685_62%,#FF7A0D)]">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <span className="text-[13px] font-bold tracking-tight">Unseen</span>
                  <Badge tone="neutral" variant="outline" className="ml-1 border-white/15 text-white/60">Cloud</Badge>
                </div>
                <h3 className="mt-10 text-[28px] font-extrabold leading-[1.1] tracking-[-0.035em]">
                  Ship intelligence
                  <br />
                  your users trust.
                </h3>
                <p className="mt-3 max-w-xs text-[12px] leading-6 text-white/55">
                  One workspace for models, prompts, evaluation and spend — with the receipts to prove it.
                </p>
              </div>
              <div className="relative">
                <div className="rounded-xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-white/70">Production usage</span>
                    <span className="inline-flex items-center gap-1 text-[9px] text-[#7BE0B0]">
                      <StatusDot tone="success" pulse /> live
                    </span>
                  </div>
                  <AreaChart data={[18, 26, 22, 34, 30, 44, 39, 56, 48, 62, 58, 72]} height={64} showGrid={false} />
                  <div className="mt-2 flex items-center gap-3 text-[9px] text-white/40">
                    <span className="font-mono">1.28M requests</span>
                    <span className="font-mono">$1,824 spend</span>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <AvatarStack
                    size="xs"
                    people={[
                      { id: '1', initials: 'RK', tone: 'pink' },
                      { id: '2', initials: 'MN', tone: 'blue' },
                      { id: '3', initials: 'JL', tone: 'amber' },
                    ]}
                  />
                  <span className="text-[10px] text-white/45">Trusted by 4,200 AI teams</span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-9">
              <div className="mb-6">
                <h3 className="text-[20px] font-bold tracking-[-0.02em] text-ink">Welcome back</h3>
                <p className="mt-1 text-[12px] text-muted">Continue with your work email or SSO provider.</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <Button variant="secondary" size="md" iconLeft={<Github className="h-4 w-4" />}>GitHub</Button>
                <Button variant="secondary" size="md" iconLeft={<Globe className="h-4 w-4" />}>Google</Button>
              </div>
              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-line" />
                <span className="text-[10px] uppercase tracking-[0.12em] text-faint">or</span>
                <span className="h-px flex-1 bg-line" />
              </div>
              <div className="space-y-3.5">
                <Field label="Work email">
                  <Input icon={<Mail className="h-4 w-4" />} placeholder="you@company.com" defaultValue="rania@unseen.ai" />
                </Field>
                <Field label="Password" action={<button className="text-[10.5px] font-semibold text-brand hover:underline">Forgot?</button>}>
                  <PasswordInput defaultValue="unseen-design" />
                </Field>
                <Checkbox checked label="Keep me signed in for 30 days" />
                <Button className="w-full" size="lg">Sign in</Button>
              </div>
              <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-faint">
                <Lock className="h-3 w-3" /> SSO enforced · SOC 2 Type II
              </div>
            </div>
          </div>
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
        <Section id="onboarding" index="02" title="Onboarding" description="Four steps, always resumable">
          <div className="flex items-center gap-2">
            {steps.map((label, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <div key={label} className="flex flex-1 items-center gap-2">
                  <div className="flex flex-col items-center gap-1.5">
                    <span
                      className={`grid h-7 w-7 place-items-center rounded-full border text-[10px] font-bold transition ${
                        done
                          ? 'border-success/30 bg-success-soft text-success'
                          : active
                            ? 'border-brand bg-brand text-white shadow-brand'
                            : 'border-line bg-surface-2 text-faint'
                      }`}
                    >
                      {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                    </span>
                    <span className={`text-[9.5px] font-semibold ${active ? 'text-ink' : 'text-faint'}`}>{label}</span>
                  </div>
                  {i < steps.length - 1 && <span className={`mb-4 h-px flex-1 ${done ? 'bg-success/50' : 'bg-line'}`} />}
                </div>
              );
            })}
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-[14px] font-semibold text-ink">Name your workspace</h3>
              <p className="mt-0.5 text-[11.5px] text-muted">You can rename it later in settings. This appears on every shared report.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Workspace name" required>
                <Input defaultValue="Unseen Labs" />
              </Field>
              <Field label="URL" hint="app.unseen.ai/labs">
                <Input defaultValue="labs" />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Team size">
                <Select defaultValue="11">
                  <option value="1">Just me</option>
                  <option value="11">11–50 people</option>
                  <option value="51">51–200 people</option>
                </Select>
              </Field>
              <Field label="Primary use case">
                <Select defaultValue="assistant">
                  <option value="assistant">AI assistant</option>
                  <option value="agents">Agent workflows</option>
                  <option value="analytics">Analytics & insight</option>
                </Select>
              </Field>
            </div>
            <div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Default model</div>
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  { name: 'GPT-4o', meta: 'OpenAI', tone: 'brand' },
                  { name: 'Claude 3.5', meta: 'Anthropic', tone: 'violet' },
                  { name: 'Gemini 1.5', meta: 'Google', tone: 'amber' },
                ].map(item => (
                  <button
                    key={item.name}
                    className={`rounded-xl border p-3 text-left transition hover:border-brand/40 ${
                      item.name === 'GPT-4o' ? 'border-brand/40 bg-brand-soft' : 'border-line bg-surface'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11.5px] font-semibold text-ink">{item.name}</span>
                      {item.name === 'GPT-4o' && <Check className="h-3.5 w-3.5 text-brand" strokeWidth={3} />}
                    </div>
                    <span className="font-mono text-[9px] text-faint">{item.meta}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-4">
              <Button size="sm" variant="ghost" iconLeft={<ArrowLeft className="h-3.5 w-3.5" />} onClick={() => setStep(Math.max(step - 1, 0))}>
                Back
              </Button>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-faint">{step + 1} of 4</span>
                <Button size="sm" iconRight={<ArrowRight className="h-3.5 w-3.5" />} onClick={() => setStep(Math.min(step + 1, 3))}>
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </Section>

        <div className="space-y-6">
          <Section id="invite" index="03" title="Invite teammates" description="Owner invites land on the activity feed">
            <div className="space-y-3">
              <Field label="Email addresses" hint="Separate with commas, or paste a CSV.">
                <Input icon={<Users className="h-4 w-4" />} placeholder="teammate@company.com" />
              </Field>
              <div className="flex flex-wrap gap-2">
                {invites.map(email => (
                  <span key={email} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[10.5px] text-ink-soft">
                    <Avatar initials={email.slice(0, 2).toUpperCase()} size="xs" tone="soft" />
                    {email}
                    <button
                      onClick={() => setInvites(list => list.filter(item => item !== email))}
                      aria-label={`Remove ${email}`}
                      className="text-faint transition hover:text-danger"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between rounded-md border border-line bg-surface-2 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-3.5 w-3.5 text-brand" />
                  <span className="text-[10.5px] text-muted">Invite link</span>
                </div>
                <code className="font-mono text-[9.5px] text-faint">unseen.ai/join/8f21c4</code>
              </div>
              <Button size="sm" className="w-full" iconLeft={<Mail className="h-3.5 w-3.5" />}>Send 2 invites</Button>
            </div>
          </Section>

          <Section id="empty" index="04" title="Empty workspace" description="First-run state worth screenshotting">
            <div className="rounded-xl border border-dashed border-line-strong bg-surface-2/60 p-5 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(140deg,#0E91F0,#F72685)] text-white shadow-brand">
                <Wand2 className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-[14px] font-bold text-ink">No models yet — start with a preset</h3>
              <p className="mx-auto mt-1 max-w-[260px] text-[11px] leading-5 text-muted">
                Pick a template tuned for support, research or revenue. You can change the prompt and model at any time.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {['Support copilot', 'Research agent', 'Revenue digest'].map(name => (
                  <button key={name} className="rounded-md border border-line bg-surface px-2 py-2 text-[10px] font-semibold text-ink-soft transition hover:border-brand/40 hover:text-brand">
                    {name}
                  </button>
                ))}
              </div>
              <Button size="sm" className="mt-4" iconLeft={<Sparkles className="h-3.5 w-3.5" />}>Browse all templates</Button>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 border-t border-line pt-3 text-[9.5px] text-faint">
                <CheckCircle2 className="h-3 w-3 text-success" /> No credit card
                <span>·</span>
                <StatusDot tone="success" /> 10k free tokens
                <span>·</span>
                <GradientBadge>AI</GradientBadge>
              </div>
            </div>
          </Section>
        </div>
      </div>

      <SurfacePanel label="Template rules" className="rounded-2xl">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { title: 'One decision per step', body: 'Onboarding asks for a name, then a use case — never both at once.' },
            { title: 'Show progress', body: 'A 4-step indicator with completed checks lowers abandonment.' },
            { title: 'Never a dead end', body: 'Empty states always offer a preset, a link to docs, and a way back.' },
          ].map(item => (
            <div key={item.title}>
              <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-ink">
                <Check className="h-3 w-3 text-brand" strokeWidth={3} /> {item.title}
              </div>
              <p className="mt-1 text-[10.5px] leading-5 text-muted">{item.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-4 border-t border-line pt-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <div className="mb-1.5 flex justify-between text-[10.5px]">
              <span className="font-semibold text-ink-soft">Setup completion</span>
              <span className="font-mono text-muted">2 / 4</span>
            </div>
            <Progress value={50} size="sm" />
          </div>
          <div className="flex items-center gap-2 text-[10px] text-faint">
            <Badge tone="neutral" variant="outline">estimated 60s</Badge>
            <Button size="xs" variant="secondary">Resume later</Button>
          </div>
        </div>
      </SurfacePanel>
    </div>
  );
}
