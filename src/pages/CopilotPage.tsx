import { useState } from 'react';
import {
  ArrowUp,
  Check,
  ChevronDown,
  CircleStop,
  Clock,
  Copy,
  FileText,
  Layers,
  Paperclip,
  Plus,
  RefreshCw,
  Save,
  Share2,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Wrench,
} from 'lucide-react';
import { PageHeader } from '../components/layout/Page';
import { Button, IconButton } from '../components/ui/Button';
import { Badge, GradientBadge, Kbd, StatusDot } from '../components/ui/Badge';
import { Field, Textarea } from '../components/ui/Field';
import { Checkbox, Segmented, Slider, Switch } from '../components/ui/Controls';
import { Avatar } from '../components/ui/Avatar';
import {
  ChatMessage,
  CodeBlock,
  MessageAction,
  PromptVariable,
  SourceChip,
  TokenMeter,
  TypingDots,
} from '../components/ui/AI';
import { cn } from '@/lib/utils';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  text?: string;
  time: string;
  code?: string;
  sources?: boolean;
};

const initialMessages: Message[] = [
  { id: 1, role: 'user', text: 'Write a migration plan for moving our streaming completions to the new router without downtime.', time: '10:02' },
  {
    id: 2,
    role: 'assistant',
    text: 'Here is a 4-step, zero-downtime plan. It uses weighted routing and a 30-minute canary window before full cutover.',
    time: '10:02',
    sources: true,
  },
  { id: 3, role: 'user', text: 'Show me the routing config I would need for step 2.', time: '10:04' },
  {
    id: 4,
    role: 'assistant',
    text: 'Step 2 shifts 10% of streaming traffic while keeping non-streaming pinned. The config below is idempotent and safe to re-apply.',
    time: '10:04',
    code: `router:
  strategy: weighted
  routes:
    - pool: us-east-1
      weight: 90
      match: { stream: true }
    - pool: eu-central-1
      weight: 10
      match: { stream: true }
  guardrails:
    error_budget: 2%
    auto_rollback: true`,
  },
];

export function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(false);
  const [temperature, setTemperature] = useState(30);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [topP, setTopP] = useState(0.9);
  const [model, setModel] = useState('GPT-4o');
  const [options, setOptions] = useState({ stream: true, citations: true, tools: true });
  const [mode, setMode] = useState<'chat' | 'agent'>('chat');

  const send = () => {
    if (!draft.trim()) return;
    const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    setMessages(current => [...current, { id: Date.now(), role: 'user', text: draft.trim(), time }]);
    setDraft('');
    setPending(true);
    window.setTimeout(() => {
      setMessages(current => [
        ...current,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: 'Noted. I’d start with a 10% canary on streaming only, watch p95 and error budget for 30 minutes, then double the weight every 30 minutes. Want me to draft the rollback runbook too?',
          time,
        },
      ]);
      setPending(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Product screen · playground"
        title="Copilot"
        description="The core AI surface: a threaded conversation, a transparent composer and a parameter panel that stays out of the way until you need it."
        meta={
          <>
            <Badge tone="brand" variant="soft">Streaming</Badge>
            <Badge tone="neutral" variant="outline">Source attribution</Badge>
            <Badge tone="neutral" variant="outline">Tool use</Badge>
          </>
        }
        actions={
          <>
            <Button variant="secondary" iconLeft={<Save className="h-4 w-4" />}>Save preset</Button>
            <Button iconLeft={<Share2 className="h-4 w-4" />}>Share thread</Button>
          </>
        }
      />

      <div className="overflow-hidden rounded-[22px] border border-line bg-surface shadow-card">
        <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-[linear-gradient(140deg,#0E91F0,#F72685)] text-white shadow-brand">
            <Sparkles className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-[13px] font-semibold text-ink">Router migration plan</span>
              <Badge tone="success" variant="soft"><StatusDot tone="success" pulse /> live</Badge>
            </div>
            <div className="text-[10.5px] text-muted">gpt-4o · workspace production · 12 messages</div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Segmented
              size="sm"
              value={mode}
              onChange={setMode}
              options={[
                { value: 'chat', label: 'Chat' },
                { value: 'agent', label: 'Agent' },
              ]}
            />
            <Button size="sm" variant="secondary" iconLeft={<Layers className="h-3.5 w-3.5" />}>Context</Button>
            <IconButton label="New thread" size="sm" variant="ghost"><Plus className="h-4 w-4" /></IconButton>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_312px]">
          {/* thread */}
          <div className="flex min-h-[560px] min-w-0 flex-col border-line lg:border-r">
            <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-5" style={{ maxHeight: 620 }}>
              <ChatMessage role="system">Canary window · Oct 21, 10:00 UTC</ChatMessage>
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
                        <MessageAction icon={<ThumbsUp className="h-3 w-3" />} label="Helpful" />
                        <MessageAction icon={<ThumbsDown className="h-3 w-3" />} label="Not helpful" />
                        <span className="ml-1 inline-flex items-center gap-1 font-mono text-[9px] text-faint">
                          <Clock className="h-2.5 w-2.5" /> 1.2s · 412 tok
                        </span>
                      </>
                    ) : undefined
                  }
                >
                  {message.text}
                  {message.code && (
                    <div className="mt-3">
                      <CodeBlock title="router.yaml" code={message.code} language="yaml" showLineNumbers />
                    </div>
                  )}
                  {message.sources && (
                    <div className="mt-3 space-y-2">
                      <div className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-faint">Sources</div>
                      <SourceChip index={1} label="Runbook · router v3" host="notion" />
                      <SourceChip index={2} label="Canary policy" host="confluence" />
                    </div>
                  )}
                </ChatMessage>
              ))}
              {pending && (
                <ChatMessage role="assistant" streaming>
                  <span className="inline-flex items-center gap-2 text-muted"><TypingDots /> drafting a plan…</span>
                </ChatMessage>
              )}
            </div>

            <div className="border-t border-line bg-surface p-3 sm:p-4">
              <div className="rounded-2xl border border-line-strong bg-surface p-2 shadow-xs transition focus-within:border-brand focus-within:ring-[3px] focus-within:ring-brand/15">
                <div className="flex items-center gap-2 px-1.5 pt-1">
                  <PromptVariable name="workspace" value="production" />
                  <PromptVariable name="model" value={model} />
                  <button className="ml-auto flex items-center gap-1 text-[10px] text-faint transition hover:text-ink">
                    <FileText className="h-3 w-3" /> 3 files
                  </button>
                </div>
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
                  placeholder="Continue the thread, or ask for a rollback runbook…"
                  className="mt-1 w-full resize-none bg-transparent px-1.5 py-1 text-[12.5px] leading-5 text-ink outline-none placeholder:text-faint"
                />
                <div className="flex items-center gap-1">
                  <IconButton label="Attach" size="xs" variant="ghost"><Paperclip className="h-3.5 w-3.5" /></IconButton>
                  <button className="flex items-center gap-1 rounded-md border border-line px-2 py-1 text-[10.5px] font-medium text-muted transition hover:border-brand/35 hover:text-ink">
                    {model} <ChevronDown className="h-3 w-3" />
                  </button>
                  <span className="ml-auto hidden items-center gap-1 text-[9.5px] text-faint sm:flex">
                    <Kbd>⏎</Kbd> send · <Kbd>⇧⏎</Kbd> newline
                  </span>
                  {pending ? (
                    <Button size="sm" variant="secondary" iconLeft={<CircleStop className="h-3.5 w-3.5" />} onClick={() => setPending(false)}>
                      Stop
                    </Button>
                  ) : (
                    <Button size="sm" iconRight={<ArrowUp className="h-3.5 w-3.5" />} onClick={send}>
                      Send
                    </Button>
                  )}
                </div>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 px-1 text-[9.5px] text-faint">
                <span className="inline-flex items-center gap-1"><Check className="h-2.5 w-2.5 text-success" /> Citations on</span>
                <span className="inline-flex items-center gap-1"><Wrench className="h-2.5 w-2.5" /> Tools enabled</span>
                <span className="ml-auto font-mono">est. $0.004 / message</span>
              </div>
            </div>
          </div>

          {/* parameters */}
          <aside className="space-y-5 border-t border-line bg-surface-2/50 p-4 lg:border-t-0">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-faint">Parameters</span>
              <Badge tone="neutral" variant="outline">preset · default</Badge>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-faint">Model</div>
              {[
                { name: 'GPT-4o', meta: 'OpenAI · 128K', badge: <GradientBadge>Default</GradientBadge> },
                { name: 'Claude 3.5', meta: 'Anthropic · 200K' },
                { name: 'Gemini 1.5', meta: 'Google · 1M' },
              ].map(item => (
                <button
                  key={item.name}
                  onClick={() => setModel(item.name)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left transition',
                    model === item.name
                      ? 'border-brand/40 bg-brand-soft shadow-[0_0_0_2px_var(--ds-brand-ring)]'
                      : 'border-line bg-surface hover:border-brand/30',
                  )}
                >
                  <span className={cn('h-2 w-2 rounded-full', model === item.name ? 'bg-brand' : 'bg-line-strong')} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11.5px] font-semibold text-ink">{item.name}</span>
                    <span className="block font-mono text-[9px] text-faint">{item.meta}</span>
                  </span>
                  {item.badge}
                </button>
              ))}
            </div>

            <div className="space-y-4 border-t border-line pt-4">
              <Slider label="Temperature" value={temperature} onChange={setTemperature} suffix="%" />
              <Slider label="Max tokens" value={maxTokens} onChange={setMaxTokens} min={256} max={8192} step={256} />
              <Slider label="Top-p" value={topP} min={0} max={1} step={0.05} onChange={setTopP} />
            </div>

            <div className="space-y-3 border-t border-line pt-4">
              <Switch checked={options.stream} onChange={v => setOptions(o => ({ ...o, stream: v }))} label="Stream tokens" size="sm" />
              <Checkbox checked={options.citations} onChange={v => setOptions(o => ({ ...o, citations: v }))} label="Require citations" />
              <Checkbox checked={options.tools} onChange={v => setOptions(o => ({ ...o, tools: v }))} label="Allow tool calls" />
            </div>

            <Field label="System prompt">
              <Textarea
                defaultValue="You are Unseen’s migration copilot. Be precise, prefer reversible steps, and always mention rollback."
                className="min-h-[84px] bg-surface text-[11px] leading-5"
              />
            </Field>

            <div className="space-y-3 border-t border-line pt-4">
              <TokenMeter used={4821} total={16000} label="Context window" />
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted">Session spend</span>
                <span className="font-mono font-semibold text-ink">$0.031</span>
              </div>
            </div>

            <Button size="sm" variant="secondary" className="w-full" iconLeft={<Save className="h-3.5 w-3.5" />}>
              Save as preset
            </Button>
          </aside>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { title: 'Composer', body: 'Two-row textarea that never jumps. Enter sends, Shift+Enter breaks the line, and context chips sit above the input.' },
          { title: 'Thread rhythm', body: 'Assistant replies use quiet surface cards; user turns use brand-tint. Max width 86% keeps long code blocks readable.' },
          { title: 'Parameter panel', body: 'Collapses below the thread on tablet. Every control maps to an API field — no decorative settings.' },
        ].map(card => (
          <div key={card.title} className="rounded-xl border border-line bg-surface p-4">
            <div className="flex items-center gap-2 text-[11.5px] font-semibold text-ink">
              <Avatar initials={card.title.slice(0, 2).toUpperCase()} tone="soft" size="xs" /> {card.title}
            </div>
            <p className="mt-1.5 text-[11px] leading-5 text-muted">{card.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
