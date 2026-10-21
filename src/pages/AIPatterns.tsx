import { useState } from 'react';
import {
  ArrowUp,
  BookOpen,
  Check,
  ChevronDown,
  CircleStop,
  Copy,
  CornerDownLeft,
  FileText,
  Globe,
  Link2,
  Paperclip,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  Wrench,
  Zap,
} from 'lucide-react';
import { PageHeader, Section, DemoRow, SurfacePanel } from '../components/layout/Page';
import { Button, IconButton } from '../components/ui/Button';
import { Badge, GradientBadge, Kbd, StatusDot } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Field, Input, Textarea, CopyField } from '../components/ui/Field';
import { Checkbox, Segmented, Slider, Switch } from '../components/ui/Controls';
import { Avatar } from '../components/ui/Avatar';
import {
  AgentStep,
  ChatMessage,
  CodeBlock,
  MessageAction,
  ModelCard,
  PromptVariable,
  SourceChip,
  Sparkline,
  StreamingResponse,
  TokenMeter,
  TypingDots,
  AreaChart,
} from '../components/ui/AI';
import { Progress } from '../components/ui/Feedback';

type ChatMsg = { id: number; role: 'user' | 'assistant'; text: string; time: string };

const seedMessages: ChatMsg[] = [
  { id: 1, role: 'user', text: 'Summarise the latency regression from yesterday’s router change and suggest a fix.', time: '09:41' },
  {
    id: 2,
    role: 'assistant',
    text: 'Latency rose 14% (p95 412ms → 470ms) after the router moved 18% of traffic to the eu-central pool. The regression is isolated to streaming completions. Suggest pinning streaming to us-east-1 and re-testing.',
    time: '09:41',
  },
];

const models = [
  { name: 'GPT-4o', provider: 'OpenAI', description: 'Best general reasoning and vision quality.', context: '128K', price: '$0.01 / 1K', badge: <Badge tone="brand" variant="soft">Default</Badge> },
  { name: 'Claude 3.5 Sonnet', provider: 'Anthropic', description: 'Long-context writing with strong instruction following.', context: '200K', price: '$0.008 / 1K', badge: <Badge tone="violet" variant="soft">Writing</Badge> },
  { name: 'Gemini 1.5 Pro', provider: 'Google', description: 'Cheapest high-volume multimodal routing.', context: '1M', price: '$0.004 / 1K', badge: <GradientBadge>NEW</GradientBadge> },
  { name: 'Llama 3.1 70B', provider: 'Meta', description: 'Self-hosted, fine-tunable, data stays in VPC.', context: '128K', price: '$0.002 / 1K' },
];

const promptTemplate = `You are {{persona}}, a product analyst for {{company}}.

Context:
{{context}}

Answer in {{tone}} tone, under {{max_words}} words.
Always cite the source document as [n].`;

export function AIPatterns() {
  const [messages, setMessages] = useState<ChatMsg[]>(seedMessages);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(false);
  const [model, setModel] = useState('GPT-4o');
  const [temperature, setTemperature] = useState(30);
  const [tone, setTone] = useState<'precise' | 'friendly'>('precise');
  const [params, setParams] = useState({ cache: true, citations: true, stream: true });

  const send = () => {
    if (!draft.trim()) return;
    const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    setMessages(m => [...m, { id: Date.now(), role: 'user', text: draft.trim(), time: now }]);
    setDraft('');
    setPending(true);
    window.setTimeout(() => {
      setMessages(m => [
        ...m,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: 'Here’s the short version: pin streaming traffic to us-east-1, then re-run the 24-hour canary. I can draft the config diff if you want to ship it today.',
          time: now,
        },
      ]);
      setPending(false);
    }, 900);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="AI patterns · 9 patterns"
        title="Interfaces for models."
        description="The patterns that separate an AI product from a CRUD app: streaming, prompting, model choice, reasoning, provenance and cost."
        meta={
          <>
            <GradientBadge><Sparkles className="h-3 w-3" /> AI-native</GradientBadge>
            <Badge tone="neutral" variant="outline">Chat · prompts · agents</Badge>
            <Badge tone="neutral" variant="outline">Token-aware</Badge>
          </>
        }
        actions={<Button variant="secondary" iconLeft={<BookOpen className="h-4 w-4" />}>Pattern guide</Button>}
      />

      <Section id="chat" index="01" title="Chat interface" description="Type below — it streams back">
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div className="overflow-hidden rounded-2xl border border-line bg-surface-2">
            <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-lg bg-[linear-gradient(140deg,#0E91F0,#F72685)] text-white">
                  <Sparkles className="h-3 w-3" />
                </span>
                <span className="text-[12px] font-semibold text-ink">Latency investigation</span>
                <Badge tone="success" variant="soft"><StatusDot tone="success" pulse /> live</Badge>
              </div>
              <div className="flex items-center gap-1">
                <IconButton label="New chat" size="xs" variant="ghost"><Plus className="h-3.5 w-3.5" /></IconButton>
                <IconButton label="Clear chat" size="xs" variant="ghost" onClick={() => setMessages([])}>
                  <Trash2 className="h-3.5 w-3.5" />
                </IconButton>
              </div>
            </div>

            <div className="max-h-[380px] space-y-4 overflow-y-auto p-4">
              <ChatMessage role="system">Context: workspace production · last 24h</ChatMessage>
              {messages.length === 0 && (
                <div className="py-10 text-center text-[11.5px] text-faint">No messages yet — ask something below.</div>
              )}
              {messages.map(message => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  time={message.time}
                  actions={
                    message.role === 'assistant' ? (
                      <>
                        <MessageAction icon={<Copy className="h-3 w-3" />} label="Copy" />
                        <MessageAction icon={<RefreshCw className="h-3 w-3" />} label="Regenerate" />
                        <MessageAction icon={<ThumbsUp className="h-3 w-3" />} label="Good" />
                        <MessageAction icon={<ThumbsDown className="h-3 w-3" />} label="Bad" />
                      </>
                    ) : undefined
                  }
                >
                  {message.text}
                </ChatMessage>
              ))}
              {pending && (
                <ChatMessage role="assistant" streaming>
                  <span className="inline-flex items-center gap-2 text-muted">
                    <TypingDots /> thinking…
                  </span>
                </ChatMessage>
              )}
            </div>

            <div className="border-t border-line bg-surface p-3">
              <div className="rounded-xl border border-line-strong bg-surface p-2.5 shadow-xs transition focus-within:border-brand focus-within:ring-[3px] focus-within:ring-brand/15">
                <textarea
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  rows={2}
                  placeholder="Ask about your models, usage or prompt quality…"
                  className="w-full resize-none bg-transparent px-1 text-[12.5px] leading-5 text-ink outline-none placeholder:text-faint"
                />
                <div className="mt-1 flex items-center gap-1">
                  <IconButton label="Attach file" size="xs" variant="ghost"><Paperclip className="h-3.5 w-3.5" /></IconButton>
                  <IconButton label="Add context" size="xs" variant="ghost"><Link2 className="h-3.5 w-3.5" /></IconButton>
                  <button className="flex items-center gap-1 rounded-md border border-line px-2 py-1 text-[10.5px] font-medium text-muted transition hover:border-brand/35 hover:text-ink">
                    <Sparkles className="h-3 w-3 text-brand" /> {model}
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  <span className="ml-auto flex items-center gap-2">
                    <span className="hidden font-mono text-[9.5px] text-faint sm:inline">⏎ to send</span>
                    {pending ? (
                      <Button size="xs" variant="secondary" iconLeft={<CircleStop className="h-3 w-3" />} onClick={() => setPending(false)}>Stop</Button>
                    ) : (
                      <Button size="xs" iconRight={<ArrowUp className="h-3 w-3" />} onClick={send}>Send</Button>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <SurfacePanel label="Message anatomy">
              <ul className="space-y-2.5 text-[11px] leading-5 text-muted">
                {[
                  ['Avatar + name', 'Identity is always visible; one gradient mark for the assistant.'],
                  ['Body', '13px / 1.6 line height, max 86% bubble width.'],
                  ['Actions', 'Copy, regenerate, rate — hidden until hover on desktop, always on mobile.'],
                  ['Streaming', 'Caret stays inline; never block the composer.'],
                ].map(([title, body]) => (
                  <li key={title} className="flex gap-2">
                    <Check className="mt-1 h-3 w-3 shrink-0 text-brand" strokeWidth={3} />
                    <span><strong className="font-semibold text-ink-soft">{title}</strong> — {body}</span>
                  </li>
                ))}
              </ul>
            </SurfacePanel>
            <SurfacePanel label="Composer states">
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg border border-line bg-surface px-3 py-2 text-[11px] text-faint">
                  Idle · placeholder visible <Kbd>⏎</Kbd>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-brand bg-surface px-3 py-2 text-[11px] text-ink-soft ring-[3px] ring-brand/15">
                  Focus · ring + border
                </div>
                <div className="flex items-center justify-between rounded-lg border border-line bg-surface px-3 py-2 text-[11px] text-muted">
                  Streaming <span className="inline-flex items-center gap-1.5"><TypingDots /> Stop</span>
                </div>
              </div>
            </SurfacePanel>
          </div>
        </div>
      </Section>

      <Section id="prompts" index="02" title="Prompt builder" description="Variables, system prompt and live preview">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
          <SurfacePanel label="Template">
            <div className="rounded-lg border border-line bg-surface p-3 font-mono text-[11px] leading-6 text-ink-soft">
              {promptTemplate.split('\n').map((line, i) => (
                <div key={i} className="whitespace-pre-wrap">
                  {line.split(/(\{\{[^}]+\}\})/g).map((part, j) =>
                    part.startsWith('{{') ? <PromptVariable key={j} name={part.slice(2, -2)} /> : <span key={j}>{part}</span>,
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone="brand" variant="soft">5 variables</Badge>
              <Badge tone="neutral" variant="outline">1 system block</Badge>
              <Badge tone="success" variant="soft"><Check className="h-3 w-3" /> valid</Badge>
            </div>
            <div className="mt-4">
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Resolved variables</div>
              <div className="space-y-2">
                {[
                  { name: 'persona', value: 'a senior product analyst' },
                  { name: 'company', value: 'Unseen' },
                  { name: 'context', value: 'last 24h telemetry, 3 alert threads' },
                  { name: 'tone', value: 'precise' },
                  { name: 'max_words', value: '120' },
                ].map(item => (
                  <div key={item.name} className="flex items-center gap-2 rounded-lg border border-line bg-surface px-2.5 py-1.5">
                    <PromptVariable name={item.name} />
                    <span className="min-w-0 flex-1 truncate text-[11px] text-muted">{item.value}</span>
                    <ChevronDown className="h-3 w-3 text-faint" />
                  </div>
                ))}
              </div>
            </div>
          </SurfacePanel>

          <div className="space-y-4">
            <Field label="System prompt">
              <Textarea defaultValue="You are a precise analyst. Prefer short findings, cite sources, never speculate beyond telemetry." className="min-h-[112px]" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tone">
                <Segmented
                  className="w-full"
                  value={tone}
                  onChange={setTone}
                  options={[
                    { value: 'precise', label: 'Precise' },
                    { value: 'friendly', label: 'Friendly' },
                  ]}
                />
              </Field>
              <Field label="Max words">
                <Input defaultValue="120" />
              </Field>
            </div>
            <SurfacePanel label="Preview">
              <div className="flex items-start gap-2.5">
                <Avatar initials="AI" tone="blue" size="sm" />
                <div className="text-[11.5px] leading-5 text-ink-soft">
                  Latency is up 14% on streaming completions since the router change [1]. Pin streaming traffic to
                  us-east-1 and re-run the canary [2].
                  <div className="mt-2 flex gap-2">
                    <SourceChip index={1} label="Router change · #482" host="linear" />
                    <SourceChip index={2} label="Canary runbook" host="notion" />
                  </div>
                </div>
              </div>
            </SurfacePanel>
            <div className="flex items-center justify-between rounded-xl border border-line bg-surface px-3.5 py-2.5">
              <span className="text-[11px] text-muted">Estimated cost per call</span>
              <span className="font-mono text-[11px] font-semibold text-ink">$0.0042 · 812 tokens</span>
            </div>
          </div>
        </div>
      </Section>

      <Section id="models" index="03" title="Model selector" description="Compare quality, context and price in one glance">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {models.map(item => (
            <ModelCard key={item.name} {...item} selected={model === item.name} onSelect={() => setModel(item.name)} />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface-2 px-4 py-3">
          <div className="flex items-center gap-2 text-[11.5px] text-muted">
            <Sparkles className="h-3.5 w-3.5 text-brand" />
            Selected <strong className="font-semibold text-ink">{model}</strong> · used for playground and new endpoints.
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="neutral" variant="outline">Auto-fallback on</Badge>
            <Button size="xs" variant="secondary">Advanced routing</Button>
          </div>
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section id="streaming" index="04" title="Streaming & reasoning" description="Show progress, not a spinner">
          <div className="space-y-5">
            <SurfacePanel label="Streaming response">
              <StreamingResponse />
            </SurfacePanel>
            <SurfacePanel label="Reasoning trace">
              <ol className="space-y-3">
                {[
                  { title: 'Read telemetry slice', detail: '1,284,392 requests · 24h window', state: 'done' as const },
                  { title: 'Compare router cohorts', detail: 'us-east-1 vs eu-central-1', state: 'done' as const },
                  { title: 'Attribute regression', detail: 'streaming completions, p95 +58ms', state: 'active' as const },
                  { title: 'Propose mitigation', state: 'pending' as const },
                ].map((step, i) => (
                  <AgentStep key={step.title} index={i + 1} title={step.title} detail={step.detail} state={step.state} />
                ))}
              </ol>
            </SurfacePanel>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-line bg-surface p-3">
                <div className="mb-2 flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.12em] text-faint">
                  <Wrench className="h-3 w-3 text-violet" /> Tool call
                </div>
                <div className="rounded-lg bg-surface-2 p-2 font-mono text-[10px] leading-5 text-ink-soft">
                  metrics.query({'{'}
                  <br />
                  &nbsp;&nbsp;range: '24h',
                  <br />
                  &nbsp;&nbsp;filter: 'streaming'
                  <br />
                  {'}'})
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-success">
                  <Check className="h-3 w-3" /> 200 · 84ms
                </div>
              </div>
              <div className="rounded-xl border border-line bg-surface p-3">
                <div className="mb-2 flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.12em] text-faint">
                  <Zap className="h-3 w-3 text-amber" /> Thinking
                </div>
                <p className="text-[11px] leading-5 text-muted">
                  Cohort split shows the regression only in the streaming path, so the likely cause is the new
                  buffering proxy rather than the model provider.
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-faint">
                  <TypingDots /> 1.2s
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section id="responses" index="05" title="Response cards" description="Ground answers in evidence">
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] font-semibold text-ink">
                  <Sparkles className="h-3.5 w-3.5 text-brand" /> Answer with sources
                </div>
                <Badge tone="success" variant="soft"><ShieldCheck className="h-3 w-3" /> grounded</Badge>
              </div>
              <p className="mt-2.5 text-[12px] leading-6 text-ink-soft">
                Three models exceed the 5% error budget: <strong className="font-semibold text-ink">legacy-summarizer</strong>,
                <strong className="font-semibold text-ink"> vision-classifier</strong> and <strong className="font-semibold text-ink">routing-v2</strong>. All
                three share the eu-central pool.
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <SourceChip index={1} label="Error budget report · Q3" host="notion" />
                <SourceChip index={2} label="Model health dashboard" host="grafana" />
              </div>
              <div className="mt-3 flex items-center gap-1 border-t border-line pt-2.5">
                <MessageAction icon={<Copy className="h-3 w-3" />} label="Copy" />
                <MessageAction icon={<RefreshCw className="h-3 w-3" />} label="Regenerate" />
                <MessageAction icon={<ThumbsUp className="h-3 w-3" />} label="Helpful" />
                <span className="ml-auto font-mono text-[9.5px] text-faint">412 tokens · 1.8s</span>
              </div>
            </Card>
            <div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Code answer</div>
              <CodeBlock
                title="rate-limit.ts"
                language="ts"
                code={`import { Unseen } from '@unseen/sdk';

const client = new Unseen({ apiKey: process.env.UNSEEN_KEY });

await client.models.update('gpt-4o-prod', {
  rateLimit: { rpm: 1200, tpm: 180_000 },
  fallback: 'claude-3-5-sonnet',
});`}
                showLineNumbers
              />
            </div>
            <div className="rounded-xl border border-danger/25 bg-danger-soft p-3.5">
              <div className="flex items-center gap-2 text-[11.5px] font-semibold text-danger">
                <CircleStop className="h-3.5 w-3.5" /> Generation interrupted
              </div>
              <p className="mt-1 text-[11px] leading-5 text-danger/80">
                Provider returned 529 after 1.2s. Partial output is preserved below.
              </p>
              <div className="mt-2 flex gap-2">
                <Button size="xs" variant="secondary">Retry</Button>
                <Button size="xs" variant="ghost">Switch model</Button>
              </div>
            </div>
          </div>
        </Section>
      </div>

      <Section id="agents" index="06" title="Agent workflow" description="Every step observable, every tool auditable">
        <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          <div className="rounded-2xl border border-line bg-surface">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <div>
                <div className="text-[12.5px] font-semibold text-ink">Weekly revenue digest</div>
                <div className="text-[10.5px] text-muted">Triggered by schedule · runs weekly on Monday 07:00</div>
              </div>
              <Badge tone="success" variant="soft"><StatusDot tone="success" pulse /> running</Badge>
            </div>
            <div className="space-y-3 p-4">
              {[
                { title: 'Fetch billing exports', detail: 'Stripe · 3 accounts mapped', state: 'done' as const, tool: 'stripe.listCharges' },
                { title: 'Aggregate by workspace', detail: '48 rows → 12 workspaces', state: 'done' as const, tool: 'sql.aggregate' },
                { title: 'Draft the digest', detail: 'gpt-4o · 812 tokens so far', state: 'active' as const, tool: 'llm.complete' },
                { title: 'Post to #revenue', state: 'pending' as const, tool: 'slack.postMessage' },
              ].map((step, i) => (
                <AgentStep key={step.title} index={i + 1} title={step.title} detail={step.detail} state={step.state}>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-md border border-line bg-surface-2 px-2 py-1 font-mono text-[9.5px] text-muted">
                    <Wrench className="h-2.5 w-2.5" /> {step.tool}
                  </div>
                </AgentStep>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-line bg-surface-2 px-4 py-2.5">
              <span className="font-mono text-[10px] text-faint">run_9f82b · 00:42 elapsed</span>
              <div className="flex gap-1">
                <Button size="xs" variant="ghost" iconLeft={<CircleStop className="h-3 w-3" />}>Cancel</Button>
                <Button size="xs" variant="secondary">View trace</Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <SurfacePanel label="Run health">
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: 'Steps', value: '4' },
                  { label: 'Tools', value: '3' },
                  { label: 'Cost', value: '$0.02' },
                ].map(item => (
                  <div key={item.label}>
                    <div className="font-mono text-[15px] font-extrabold text-ink">{item.value}</div>
                    <div className="text-[9.5px] uppercase tracking-wider text-faint">{item.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <Progress value={62} label="Progress" showValue />
                <TokenMeter used={8120} total={16000} label="Context window" />
              </div>
            </SurfacePanel>
            <SurfacePanel label="Guardrails">
              <div className="space-y-3">
                <Switch checked label="Require approval before posting" description="Human in the loop for external tools." onChange={() => undefined} />
                <Switch checked={false} label="Allow shell access" onChange={() => undefined} />
                <div className="flex items-center gap-1.5 text-[10px] text-muted">
                  <ShieldCheck className="h-3 w-3 text-success" /> PII redaction enabled on all tool inputs
                </div>
              </div>
            </SurfacePanel>
          </div>
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section id="usage" index="07" title="Usage & cost" description="Meter every token">
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Requests', value: '1.28M', delta: '+12.4%' },
                { label: 'Tokens', value: '48.2M', delta: '+8.1%' },
                { label: 'Spend', value: '$1,824', delta: '+3.2%' },
              ].map(item => (
                <div key={item.label} className="rounded-xl border border-line bg-surface-2 p-3">
                  <div className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-faint">{item.label}</div>
                  <div className="mt-1 font-mono text-[16px] font-extrabold tracking-tight text-ink">{item.value}</div>
                  <div className="text-[9.5px] text-success">{item.delta}</div>
                </div>
              ))}
            </div>
            <SurfacePanel label="Spend over 14 days">
              <AreaChart data={[24, 31, 28, 38, 34, 44, 40, 52, 47, 58, 54, 66, 61, 74]} height={110} labels={['Oct 1', 'Oct 7', 'Oct 14']} />
            </SurfacePanel>
            <div className="space-y-3">
              <TokenMeter used={72000} total={100000} label="Monthly tokens" />
              <TokenMeter used={1284392} total={2000000} label="Monthly requests" tone="pink" />
              <div>
                <div className="flex justify-between text-[11px]">
                  <span className="font-semibold text-ink-soft">Hard budget</span>
                  <span className="font-mono text-muted">$1,824 / $2,500</span>
                </div>
                <Progress value={73} tone="brand" size="sm" />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-warning/30 bg-warning-soft px-3.5 py-2.5 text-[11px] text-warning">
              <span className="inline-flex items-center gap-1.5"><Zap className="h-3.5 w-3.5" /> 82% of request limit used</span>
              <Button size="xs" variant="secondary">Upgrade</Button>
            </div>
          </div>
        </Section>

        <Section id="devtools" index="08" title="Developer surfaces" description="Keys, endpoints and webhooks">
          <div className="space-y-4">
            <CopyField label="Endpoint" value="https://api.unseen.ai/v2/chat/completions" />
            <CopyField label="Secret key" value="sk-live-9f82b41c7de04a6f" masked />
            <CodeBlock
              title="quickstart.sh"
              code={`curl https://api.unseen.ai/v2/chat/completions \\
  -H "Authorization: Bearer $UNSEEN_KEY" \\
  -d '{"model":"gpt-4o","stream":true}'`}
            />
            <div className="overflow-hidden rounded-xl border border-line">
              <div className="flex items-center justify-between border-b border-line bg-surface-2 px-3.5 py-2">
                <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-faint">Webhooks</span>
                <Button size="xs" variant="ghost" iconLeft={<Plus className="h-3 w-3" />}>Add</Button>
              </div>
              {[
                { event: 'response.completed', url: 'https://api.unseen.ai/hooks/usage', ok: true },
                { event: 'run.failed', url: 'https://api.unseen.ai/hooks/alerts', ok: true },
                { event: 'key.rotated', url: 'https://hooks.slack.com/…', ok: false },
              ].map(row => (
                <div key={row.event} className="flex items-center gap-2 border-b border-line px-3.5 py-2 last:border-0">
                  <span className={`h-1.5 w-1.5 rounded-full ${row.ok ? 'bg-success' : 'bg-warning'}`} />
                  <span className="font-mono text-[10px] text-ink-soft">{row.event}</span>
                  <span className="ml-auto max-w-[140px] truncate font-mono text-[9.5px] text-faint">{row.url}</span>
                </div>
              ))}
            </div>
            <SurfacePanel label="Latency (last 24h)">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-xl font-extrabold text-ink">412<span className="text-[11px] font-medium text-muted">ms p95</span></div>
                  <div className="text-[10px] text-success">−8% vs yesterday</div>
                </div>
                <div className="w-32"><Sparkline data={[28, 34, 30, 26, 32, 24, 22, 26, 20, 18, 22, 19]} tone="pink" height={38} /></div>
              </div>
            </SurfacePanel>
          </div>
        </Section>
      </div>

      <Section id="actions" index="09" title="AI actions & provenance" description="Small controls that make answers trustworthy">
        <div className="grid gap-5 lg:grid-cols-3">
          <SurfacePanel label="Inline actions">
            <div className="flex flex-wrap items-center gap-1.5">
              <Button size="xs" variant="secondary" iconLeft={<RefreshCw className="h-3 w-3" />}>Regenerate</Button>
              <Button size="xs" variant="secondary" iconLeft={<Copy className="h-3 w-3" />}>Copy</Button>
              <TooltipLike label="Good response"><ThumbsUp className="h-3 w-3" /></TooltipLike>
              <TooltipLike label="Bad response"><ThumbsDown className="h-3 w-3" /></TooltipLike>
              <Button size="xs" variant="ghost" iconLeft={<CornerDownLeft className="h-3 w-3" />}>Reply</Button>
            </div>
            <div className="mt-3 border-t border-line pt-3">
              <div className="mb-2 text-[9.5px] font-bold uppercase tracking-[0.12em] text-faint">Sources</div>
              <div className="space-y-2">
                <SourceChip index={1} label="Telemetry export · Oct 20" host="s3" />
                <SourceChip index={2} label="Router change log" host="linear" />
                <SourceChip index={3} label="SLO definitions" host="notion" />
              </div>
            </div>
          </SurfacePanel>

          <SurfacePanel label="Prompt chips">
            <div className="flex flex-wrap gap-2">
              {['Summarise today', 'Find regressions', 'Draft a customer reply', 'Explain this chart'].map(chip => (
                <button
                  key={chip}
                  className="rounded-full border border-line bg-surface px-3 py-1.5 text-[11px] font-medium text-muted transition hover:border-brand/40 hover:bg-brand-soft hover:text-brand-strong dark:hover:text-brand"
                >
                  {chip}
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-dashed border-line-strong p-3">
              <div className="flex items-center gap-2 text-[10.5px] font-semibold text-ink-soft">
                <Paperclip className="h-3.5 w-3.5 text-faint" /> Attach context
              </div>
              <div className="mt-2 space-y-1.5">
                {[
                  { icon: FileText, name: 'usage-report.csv', meta: '84 KB' },
                  { icon: Globe, name: 'api-docs.unseen.ai', meta: 'link' },
                ].map(file => {
                  const Icon = file.icon;
                  return (
                    <div key={file.name} className="flex items-center gap-2 rounded-lg bg-surface px-2 py-1.5">
                      <Icon className="h-3 w-3 text-muted" />
                      <span className="min-w-0 flex-1 truncate text-[10.5px] text-ink-soft">{file.name}</span>
                      <span className="font-mono text-[9px] text-faint">{file.meta}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </SurfacePanel>

          <SurfacePanel label="Trust & limits">
            <div className="space-y-3">
              <Checkbox checked={params.citations} onChange={v => setParams(p => ({ ...p, citations: v }))} label="Always show citations" description="Attach source chips to every factual claim." />
              <Checkbox checked={params.cache} onChange={v => setParams(p => ({ ...p, cache: v }))} label="Prompt caching" description="Reuse the system block across requests." />
              <Switch checked={params.stream} onChange={v => setParams(p => ({ ...p, stream: v }))} label="Stream tokens" />
              <div className="space-y-2 border-t border-line pt-3">
                <Slider label="Temperature" value={temperature} onChange={setTemperature} min={0} max={100} suffix="%" />
                <Slider label="Top-p" value={0.9} min={0} max={1} step={0.05} />
              </div>
            </div>
          </SurfacePanel>
        </div>
        <DemoRow label="Model call states" className="mt-6 border-t border-line pt-5">
          <Badge tone="neutral" variant="outline"><StatusDot tone="brand" pulse /> queued</Badge>
          <Badge tone="brand" variant="soft"><StatusDot tone="brand" pulse /> streaming</Badge>
          <Badge tone="violet" variant="soft"><Wrench className="h-3 w-3" /> tool call</Badge>
          <Badge tone="success" variant="soft"><Check className="h-3 w-3" /> complete</Badge>
          <Badge tone="warning" variant="soft">retrying · 1/3</Badge>
          <Badge tone="danger" variant="soft">failed · 529</Badge>
          <span className="ml-2 text-[10.5px] text-faint">Every state has copy, color and an icon — never color alone.</span>
        </DemoRow>
      </Section>
    </div>
  );
}

function TooltipLike({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button
      aria-label={label}
      title={label}
      className="grid h-7 w-7 place-items-center rounded-md border border-line bg-surface text-muted transition hover:border-brand/35 hover:text-ink"
    >
      {children}
    </button>
  );
}
