import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Github, KeyRound, Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { PageHeader, Section } from '../components/layout/Page';
import { Button } from '../components/ui/Button';
import { Badge, GradientBadge, Kbd, StatusDot } from '../components/ui/Badge';
import { Field, Input, PasswordInput } from '../components/ui/Field';
import { Checkbox, Segmented } from '../components/ui/Controls';
import { Avatar } from '../components/ui/Avatar';
import { Alert } from '../components/ui/Feedback';

type Screen = 'signin' | 'signup' | 'forgot' | 'verify';
type Mode = 'light' | 'dark';

function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-lg bg-[linear-gradient(140deg,#0E91F0,#F72685_62%,#FF7A0D)] shadow-[0_6px_16px_-8px_rgba(247,38,133,.7)]"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" className="text-white" style={{ width: size * 0.5, height: size * 0.5 }} aria-hidden>
        <path d="M12 3c.9 4.4 3.6 7.1 8 8-4.4.9-7.1 3.6-8 8-.9-4.4-3.6-7.1-8-8 4.4-.9 7.1-3.6 8-8Z" fill="currentColor" />
      </svg>
    </span>
  );
}

function AuthShell({ screen, onScreen, mode, children }: { screen: Screen; onScreen: (s: Screen) => void; mode: Mode; children: React.ReactNode }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-line bg-canvas ${mode === 'dark' ? 'dark' : ''}`}>
      <div className="grid min-h-[430px] lg:grid-cols-[1.05fr_1fr]">
        {/* brand side */}
        <div className="relative hidden overflow-hidden bg-surface p-6 lg:block">
          <div className="absolute inset-0 ds-mesh opacity-[0.16]" />
          <div className="absolute inset-0 ds-grid-lines opacity-50" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-center gap-2">
              <BrandMark size={26} />
              <span className="text-[13px] font-bold tracking-[-0.02em] text-ink">Unseen</span>
            </div>
            <div className="mt-auto">
              <h3 className="max-w-[260px] text-[24px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink">
                Ship models, not
                <br />
                <span className="ds-gradient-text">plumbing.</span>
              </h3>
              <p className="mt-2 max-w-[260px] text-[11.5px] leading-5 text-muted">
                Routing, evals, guardrails and cost control in one workspace — with the traces to prove it.
              </p>
              <div className="mt-5 space-y-2">
                {['SOC 2 Type II · SSO available', '99.98% inference uptime', 'No training on your data'].map(item => (
                  <div key={item} className="flex items-center gap-1.5 text-[10px] text-muted">
                    <Check className="h-3 w-3 text-success" strokeWidth={3} />
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-2 rounded-lg border border-line bg-surface/80 p-2.5 backdrop-blur">
                <Avatar initials="MC" size="sm" tone="blue" />
                <div className="min-w-0">
                  <p className="text-[9.5px] leading-4 text-ink-soft">“We cut p95 by 38% in a week.”</p>
                  <p className="text-[8.5px] text-faint">Marcus C. · Platform, Vantage</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* form side */}
        <div className="flex flex-col bg-surface p-5 sm:p-7">
          <div className="flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-2">
              <BrandMark size={24} />
              <span className="text-[12px] font-bold text-ink">Unseen</span>
            </div>
          </div>

          <div className="mt-4 flex-1 lg:mt-0">
            {screen !== 'verify' && <Segmented
              size="sm"
              value={screen === 'signup' ? 'signup' : screen}
              onChange={v => onScreen(v as Screen)}
              options={[
                { value: 'signin', label: 'Sign in' },
                { value: 'signup', label: 'Create account' },
                { value: 'forgot', label: 'Reset' },
              ]}
              className="mb-4 w-full justify-between [&>button]:flex-1"
            />}
            {children}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-line pt-3">
            <span className="flex items-center gap-1.5 font-mono text-[8.5px] text-faint">
              <StatusDot tone="success" /> api.unseen.ai operational
            </span>
            <span className="text-[8.5px] text-faint">Privacy · Terms</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthPage() {
  const [screen, setScreen] = useState<Screen>('signin');
  const [mode, setMode] = useState<Mode>('light');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [remember, setRemember] = useState(true);
  const [email, setEmail] = useState('rania@unseen.ai');

  const otpFilled = otp.every(Boolean);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Product screen · authentication"
        title="Sign in, sign up, recover."
        description="Four screens that decide whether anyone sees the product: sign in, create account, password reset and the one-time code. Split layout on desktop, single column on phones, both themes."
        meta={
          <>
            <Badge tone="brand" variant="soft">4 states</Badge>
            <Badge tone="neutral" variant="outline">SSO-ready</Badge>
            <Badge tone="neutral" variant="outline">44px targets</Badge>
          </>
        }
        actions={
          <Segmented
            size="sm"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
            ]}
          />
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <Section
          index="01"
          title={screen === 'signin' ? 'Sign in' : screen === 'signup' ? 'Create account' : screen === 'forgot' ? 'Reset password' : 'One-time code'}
          description="Live — the segmented control switches the form"
          aside={<Badge tone="neutral" variant="outline">{mode}</Badge>}
        >
          <AuthShell screen={screen} onScreen={setScreen} mode={mode}>
            {screen === 'signin' && (
              <div className="space-y-3">
                <div>
                  <h2 className="text-[17px] font-bold tracking-[-0.02em] text-ink">Welcome back</h2>
                  <p className="mt-0.5 text-[11px] text-muted">Sign in to workspace <span className="font-mono text-ink-soft">unseen-labs</span>.</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="secondary" className="w-full" iconLeft={<Github className="h-3.5 w-3.5" />}>GitHub</Button>
                  <Button size="sm" variant="secondary" className="w-full" iconLeft={<KeyRound className="h-3.5 w-3.5" />}>SSO</Button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-px flex-1 bg-line" />
                  <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-faint">or email</span>
                  <span className="h-px flex-1 bg-line" />
                </div>

                <Field label="Work email">
                  <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" type="email" />
                </Field>
                <Field label="Password">
                  <PasswordInput defaultValue="correct-horse-battery" />
                </Field>

                <div className="flex items-center justify-between">
                  <Checkbox checked={remember} onChange={setRemember} label="Keep me signed in" />
                  <button onClick={() => setScreen('forgot')} className="text-[10.5px] font-semibold text-brand hover:underline">
                    Forgot password?
                  </button>
                </div>

                <Button className="w-full" size="md" iconRight={<ArrowRight className="h-3.5 w-3.5" />} onClick={() => setScreen('verify')}>
                  Continue
                </Button>

                <p className="text-center text-[10px] text-muted">
                  New here?{' '}
                  <button onClick={() => setScreen('signup')} className="font-semibold text-brand hover:underline">
                    Create an account
                  </button>
                </p>
              </div>
            )}

            {screen === 'signup' && (
              <div className="space-y-3">
                <div>
                  <h2 className="text-[17px] font-bold tracking-[-0.02em] text-ink">Create your workspace</h2>
                  <p className="mt-0.5 text-[11px] text-muted">Free for 14 days. No card required.</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="First name"><Input defaultValue="Rania" /></Field>
                  <Field label="Last name"><Input defaultValue="Kabir" /></Field>
                </div>
                <Field label="Work email"><Input placeholder="you@company.com" type="email" /></Field>
                <Field label="Password" hint="12+ characters, one number, one symbol.">
                  <PasswordInput defaultValue="correct-horse-battery" />
                </Field>
                <Checkbox checked label={<span className="text-[10.5px]">I agree to the <span className="text-brand">terms</span> and <span className="text-brand">privacy policy</span>.</span>} />
                <Button className="w-full" size="md" iconRight={<ArrowRight className="h-3.5 w-3.5" />}>Create account</Button>
                <div className="flex items-center gap-1.5 rounded-md bg-surface-2 px-2 py-1.5">
                  <ShieldCheck className="h-3 w-3 text-success" />
                  <span className="text-[9px] text-muted">We never train on your data. Delete a workspace and it’s gone in 30 days.</span>
                </div>
              </div>
            )}

            {screen === 'forgot' && (
              <div className="space-y-3">
                <button onClick={() => setScreen('signin')} className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted hover:text-ink">
                  <ArrowLeft className="h-3 w-3" /> Back to sign in
                </button>
                <div>
                  <h2 className="text-[17px] font-bold tracking-[-0.02em] text-ink">Reset your password</h2>
                  <p className="mt-0.5 text-[11px] text-muted">We’ll email a link valid for 30 minutes.</p>
                </div>
                <Field label="Work email"><Input defaultValue={email} type="email" icon={<Mail className="h-3.5 w-3.5" />} /></Field>
                <Alert tone="brand" title="Check your spam folder too">
                  Links expire after 30 minutes or one use. Requesting a new link invalidates the old one.
                </Alert>
                <Button className="w-full" size="md" onClick={() => setScreen('verify')}>Send reset link</Button>
                <p className="text-center text-[9.5px] text-faint">
                  Prefer a code? <button onClick={() => setScreen('verify')} className="font-semibold text-brand hover:underline">Use a one-time code</button>
                </p>
              </div>
            )}

            {screen === 'verify' && (
              <div className="space-y-3">
                <button onClick={() => setScreen('signin')} className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted hover:text-ink">
                  <ArrowLeft className="h-3 w-3" /> Back
                </button>
                <div>
                  <h2 className="text-[17px] font-bold tracking-[-0.02em] text-ink">Enter your code</h2>
                  <p className="mt-0.5 text-[11px] text-muted">
                    Sent to <span className="font-mono text-ink-soft">{email}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between gap-1.5">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      value={digit}
                      inputMode="numeric"
                      maxLength={1}
                      aria-label={`Digit ${i + 1}`}
                      onChange={e => {
                        const next = [...otp];
                        next[i] = e.target.value.replace(/\D/g, '').slice(0, 1);
                        setOtp(next);
                        const el = e.target.parentElement?.children[i + 1] as HTMLInputElement | undefined;
                        if (next[i]) el?.focus();
                      }}
                      className="h-11 w-full rounded-md border border-line-strong bg-surface text-center font-mono text-[16px] font-bold text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-[9.5px]">
                  <span className="flex items-center gap-1 text-faint">
                    <Lock className="h-3 w-3" /> Code expires in 04:52
                  </span>
                  <button className="font-semibold text-brand hover:underline">Resend code</button>
                </div>

                <Button className="w-full" size="md" disabled={!otpFilled} onClick={() => setScreen('signin')}>
                  {otpFilled ? 'Verify & sign in' : 'Enter all six digits'}
                </Button>

                <div className="flex items-center justify-between rounded-md bg-surface-2 px-2 py-1.5">
                  <span className="flex items-center gap-1.5 text-[9px] text-muted">
                    <Sparkles className="h-3 w-3 text-brand" /> Using a passkey instead?
                  </span>
                  <button className="text-[9px] font-semibold text-brand">Use passkey</button>
                </div>

                <div className="flex items-center justify-center gap-1 text-[9px] text-faint">
                  <Kbd>⌘</Kbd>
                  <Kbd>V</Kbd>
                  paste a code from your clipboard
                </div>
              </div>
            )}
          </AuthShell>
        </Section>

        <div className="space-y-4">
          <Section index="02" title="Behaviour" description="The details that reduce support tickets">
            <ul className="space-y-2">
              {[
                ['Inline validation', 'Errors appear after blur, never while you type a first character.'],
                ['Autofill first', 'Email and password use the right `autocomplete` tokens so password managers work.'],
                ['One primary action', 'Continue, Create, Send, Verify — one filled button per screen.'],
                ['Recovery is reachable', 'Forgot password is on the sign-in screen, and the code screen links back.'],
                ['No dead ends', 'Every screen has a visible way back, plus SSO and passkey alternatives.'],
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

          <Section index="03" title="Error states" description="What failure looks like">
            <div className="space-y-2">
              <Alert tone="danger" title="Email or password is incorrect">
                Check both fields — for security we don’t say which one failed. 3 attempts left.
              </Alert>
              <Alert tone="warning" title="Code expired">
                That code was valid for 30 minutes. Request a new one — it takes a second.
              </Alert>
              <div className="rounded-lg border border-danger/30 bg-danger-soft p-2.5">
                <div className="text-[10px] font-semibold text-danger">Password field · invalid</div>
                <Field error="Must be at least 12 characters.">
                  <Input invalid defaultValue="short" type="password" />
                </Field>
              </div>
            </div>
          </Section>

          <div className="rounded-xl border border-line bg-surface-2 p-3.5">
            <div className="flex items-center gap-2">
              <GradientBadge>a11y</GradientBadge>
              <span className="text-[10.5px] text-muted">OTP inputs are labelled “Digit 1–6”, accept paste, and move focus forward.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
