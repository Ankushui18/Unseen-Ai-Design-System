import { useState } from 'react';
import {
  ArrowUp,
  Bell,
  ChevronLeft,
  Grid2X2,
  Home,
  MessageSquare,
  Mic,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sparkles,
  User,
} from 'lucide-react';
import { PageHeader, Section } from '../components/layout/Page';
import { Button, IconButton } from '../components/ui/Button';
import { Badge, GradientBadge, StatusDot } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { MobileTabs } from '../components/ui/Navigation';
import { ChatMessage, Sparkline, TypingDots } from '../components/ui/AI';
import { Progress } from '../components/ui/Feedback';
import { Donut } from '../components/ui/Charts';

function PhoneFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-[268px] rounded-[36px] border border-line-strong bg-[#0B0B12] p-2 shadow-float">
        <div className="absolute left-1/2 top-[9px] z-20 h-4 w-16 -translate-x-1/2 rounded-full bg-black" />
        <div className="relative h-[548px] overflow-hidden rounded-[29px] bg-canvas">
          <div className="flex h-7 items-center justify-between bg-surface px-4 pt-1 text-[8px] font-semibold text-ink">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-success" />
              5G
            </span>
          </div>
          {children}
        </div>
      </div>
      <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-faint">{label}</span>
    </div>
  );
}

export function MobilePage() {
  const [tab, setTab] = useState('chat');
  const [mobileTab, setMobileTab] = useState('home');
  const [chatText, setChatText] = useState('');

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Product screen · mobile"
        title="Mobile patterns"
        description="The same tokens, reflowed for a 390pt viewport: thumb-reachable tabs, a sheet instead of a drawer, cards instead of tables, and a composer that respects the keyboard."
        meta={
          <>
            <Badge tone="brand" variant="soft">390 × 844 target</Badge>
            <Badge tone="neutral" variant="outline">44pt touch targets</Badge>
            <Badge tone="neutral" variant="outline">Safe-area aware</Badge>
          </>
        }
        actions={<Button variant="secondary" iconLeft={<Grid2X2 className="h-4 w-4" />}>Device preview</Button>}
      />

      <Section index="01" title="Core screens" description="Chat · dashboard · notifications">
        <div className="flex flex-wrap items-start justify-center gap-6">
          {/* chat */}
          <PhoneFrame label="Chat">
            <div className="flex h-[calc(100%-1.75rem)] flex-col">
              <div className="flex items-center gap-2 border-b border-line bg-surface px-3 py-2.5">
                <ChevronLeft className="h-4 w-4 text-muted" />
                <span className="grid h-6 w-6 place-items-center rounded-md bg-[linear-gradient(140deg,#0E91F0,#F72685)] text-white">
                  <Sparkles className="h-3 w-3" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[10px] font-semibold text-ink">Router migration</div>
                  <div className="flex items-center gap-1 text-[8px] text-faint">
                    <StatusDot tone="success" pulse /> gpt-4o · live
                  </div>
                </div>
                <MoreHorizontal className="h-4 w-4 text-muted" />
              </div>
              <div className="flex-1 space-y-3 overflow-hidden px-2.5 py-3">
                <ChatMessage role="user" time="10:02">Write a zero-downtime migration plan.</ChatMessage>
                <ChatMessage role="assistant" time="10:02">
                  Four steps: canary 10% on streaming only, watch p95 for 30 minutes, double the weight, then retire the old pool.
                </ChatMessage>
                <div className="flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2 py-1.5">
                  <TypingDots />
                  <span className="text-[8.5px] text-faint">thinking…</span>
                </div>
              </div>
              <div className="border-t border-line bg-surface p-2">
                <div className="flex items-end gap-1.5 rounded-xl border border-line-strong bg-surface p-1.5">
                  <IconButton label="Add" size="xs" variant="ghost"><Plus className="h-3.5 w-3.5" /></IconButton>
                  <input
                    value={chatText}
                    onChange={e => setChatText(e.target.value)}
                    placeholder="Message…"
                    className="min-w-0 flex-1 bg-transparent py-1 text-[10px] text-ink outline-none placeholder:text-faint"
                  />
                  <IconButton label="Voice" size="xs" variant="ghost"><Mic className="h-3.5 w-3.5" /></IconButton>
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-brand text-white">
                    <ArrowUp className="h-3 w-3" />
                  </span>
                </div>
              </div>
              <MobileTabs
                value={mobileTab}
                onChange={setMobileTab}
                items={[
                  { value: 'home', label: 'Home', icon: <Home className="h-3.5 w-3.5" /> },
                  { value: 'chat', label: 'Chat', icon: <MessageSquare className="h-3.5 w-3.5" /> },
                  { value: 'usage', label: 'Usage', icon: <Grid2X2 className="h-3.5 w-3.5" /> },
                  { value: 'you', label: 'You', icon: <User className="h-3.5 w-3.5" /> },
                ]}
              />
            </div>
          </PhoneFrame>

          {/* dashboard */}
          <PhoneFrame label="Dashboard">
            <div className="flex h-[calc(100%-1.75rem)] flex-col">
              <div className="flex items-center justify-between border-b border-line bg-surface px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-md bg-[linear-gradient(140deg,#0E91F0,#F72685)] text-white">
                    <Sparkles className="h-3 w-3" />
                  </span>
                  <span className="text-[10.5px] font-bold text-ink">Overview</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bell className="h-3.5 w-3.5 text-muted" />
                  <Avatar initials="RK" size="xs" tone="pink" status="online" />
                </div>
              </div>
              <div className="flex-1 space-y-2.5 overflow-hidden p-2.5">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Requests', value: '1.28M', delta: '+12%' },
                    { label: 'Spend', value: '$1.8K', delta: '+3%' },
                  ].map(stat => (
                    <div key={stat.label} className="rounded-lg border border-line bg-surface p-2">
                      <div className="text-[7.5px] uppercase tracking-wider text-faint">{stat.label}</div>
                      <div className="font-mono text-[13px] font-extrabold text-ink">{stat.value}</div>
                      <div className="text-[7.5px] text-success">{stat.delta}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border border-line bg-surface p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[8.5px] font-semibold text-ink">Tokens · 7d</span>
                    <span className="font-mono text-[7.5px] text-success">↗ 8.1%</span>
                  </div>
                  <Sparkline data={[10, 14, 12, 18, 16, 22, 20, 26, 24, 30]} height={26} />
                </div>
                <div className="rounded-lg border border-line bg-surface p-2">
                  <div className="mb-1.5 text-[8.5px] font-semibold text-ink">Models</div>
                  {[
                    { name: 'GPT-4o', pct: 62 },
                    { name: 'Claude 3.5', pct: 21 },
                    { name: 'Gemini', pct: 11 },
                  ].map(model => (
                    <div key={model.name} className="mb-1.5 last:mb-0">
                      <div className="flex justify-between text-[7.5px]">
                        <span className="text-muted">{model.name}</span>
                        <span className="font-mono text-ink">{model.pct}%</span>
                      </div>
                      <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-surface-3">
                        <div className="h-full rounded-full bg-brand" style={{ width: `${model.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-line bg-surface p-2">
                  <Donut
                    size={52}
                    thickness={7}
                    centerValue="73%"
                    segments={[
                      { label: 'used', value: 73, tone: 'brand' },
                      { label: 'free', value: 27, tone: 'muted' },
                    ]}
                  />
                  <div>
                    <div className="text-[8.5px] font-semibold text-ink">Budget</div>
                    <div className="font-mono text-[7.5px] text-muted">$1,824 / $2,500</div>
                    <div className="mt-1"><Progress value={73} size="sm" /></div>
                  </div>
                </div>
              </div>
              <MobileTabs
                value={mobileTab}
                onChange={setMobileTab}
                items={[
                  { value: 'home', label: 'Home', icon: <Home className="h-3.5 w-3.5" /> },
                  { value: 'chat', label: 'Chat', icon: <MessageSquare className="h-3.5 w-3.5" /> },
                  { value: 'usage', label: 'Usage', icon: <Grid2X2 className="h-3.5 w-3.5" /> },
                  { value: 'you', label: 'You', icon: <User className="h-3.5 w-3.5" /> },
                ]}
              />
            </div>
          </PhoneFrame>

          {/* notifications + sheet */}
          <PhoneFrame label="Sheet">
            <div className="relative h-[calc(100%-1.75rem)]">
              <div className="flex items-center justify-between border-b border-line bg-surface px-3 py-2.5">
                <span className="text-[10.5px] font-bold text-ink">Notifications</span>
                <Badge tone="brand" variant="soft">3 new</Badge>
              </div>
              <div className="space-y-2 p-2.5">
                {[
                  { title: 'Model deployed', body: 'gpt-4o-prod v2.4 is live in 3 regions.', time: '2m', tone: 'success' as const },
                  { title: 'Rate limit at 82%', body: 'Resets in 6 days. Consider upgrading.', time: '1h', tone: 'warning' as const },
                  { title: 'Eval failed', body: '3 adversarial prompts breached policy.', time: '3h', tone: 'danger' as const },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-2 rounded-lg border border-line bg-surface p-2">
                    <StatusDot tone={item.tone} pulse={item.tone === 'success'} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[9px] font-semibold text-ink">{item.title}</div>
                      <div className="text-[8px] leading-3 text-muted">{item.body}</div>
                    </div>
                    <span className="font-mono text-[7px] text-faint">{item.time}</span>
                  </div>
                ))}
              </div>
              {/* bottom sheet */}
              <div className="absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-line bg-surface p-3 shadow-float">
                <div className="mx-auto mb-2 h-1 w-9 rounded-full bg-line-strong" />
                <div className="text-[10px] font-bold text-ink">Model settings</div>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[8.5px] text-muted">Temperature</span>
                    <span className="font-mono text-[8.5px] text-ink">0.3</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-surface-3">
                    <div className="h-full w-[30%] rounded-full bg-brand" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[8.5px] text-muted">Stream tokens</span>
                    <span className="h-3 w-6 rounded-full bg-brand p-0.5">
                      <span className="ml-2.5 block h-2 w-2 rounded-full bg-white" />
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="xs" variant="secondary" className="flex-1 text-[9px]">Cancel</Button>
                  <Button size="xs" className="flex-1 text-[9px]">Save</Button>
                </div>
              </div>
            </div>
          </PhoneFrame>
        </div>
      </Section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section index="02" title="Responsive rules" description="What changes below 768px">
          <ol className="space-y-2.5">
            {[
              ['Sidebar → bottom tabs', 'Max four destinations; overflow moves into “You”.'],
              ['Tables → cards', 'Each row becomes a 2-column card with the primary value first.'],
              ['Drawer → sheet', 'Bottom sheet with a drag handle; max 80% height and scroll inside.'],
              ['Composer pinned', 'Stays above the keyboard, never overlaps the thread.'],
              ['44pt targets', 'Icon buttons grow from 28 → 32 with 44pt hit area via padding.'],
            ].map(([title, body], i) => (
              <li key={title} className="flex gap-2.5">
                <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand-soft font-mono text-[8px] font-bold text-brand">{i + 1}</span>
                <span className="text-[10.5px] leading-4">
                  <strong className="font-semibold text-ink">{title}</strong>
                  <span className="text-muted"> — {body}</span>
                </span>
              </li>
            ))}
          </ol>
        </Section>

        <Section index="03" title="Mobile table fallback" description="Same data, card layout">
          <div className="space-y-2">
            {[
              { name: 'GPT-4o Production', status: 'live', requests: '1.28M', cost: '$1,824' },
              { name: 'Support Copilot', status: 'live', requests: '642K', cost: '$642' },
              { name: 'Vision Classifier', status: 'staging', requests: '318K', cost: '$218' },
            ].map(row => (
              <div key={row.name} className="rounded-lg border border-line bg-surface p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-ink">{row.name}</span>
                  <Badge tone={row.status === 'live' ? 'success' : 'warning'} variant="soft">{row.status}</Badge>
                </div>
                <div className="mt-1.5 grid grid-cols-2 gap-2 border-t border-line pt-1.5">
                  <div>
                    <div className="text-[8px] uppercase tracking-wider text-faint">Requests</div>
                    <div className="font-mono text-[10px] text-ink">{row.requests}</div>
                  </div>
                  <div>
                    <div className="text-[8px] uppercase tracking-wider text-faint">Cost</div>
                    <div className="font-mono text-[10px] text-ink">{row.cost}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-surface-2 px-2.5 py-2 text-[9.5px] text-muted">
            <Search className="h-3 w-3" /> Search stays pinned at the top of the list.
          </div>
        </Section>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { title: 'Thumb zone', body: 'Primary actions sit in the bottom third. Destructive actions never do.', icon: User },
          { title: 'One column', body: 'No two-column forms below 640px; labels sit above inputs.', icon: Settings },
          { title: 'Quiet chrome', body: 'Status bar, nav and sheet share the same surface token.', icon: Sparkles },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="rounded-xl border border-line bg-surface p-3.5">
              <Icon className="h-4 w-4 text-brand" />
              <div className="mt-1.5 text-[11.5px] font-semibold text-ink">{card.title}</div>
              <p className="mt-0.5 text-[10px] leading-4 text-muted">{card.body}</p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface-2 px-4 py-3">
        <div className="flex items-center gap-2">
          <GradientBadge>mobile</GradientBadge>
          <span className="text-[10.5px] text-muted">Breakpoints: 640 / 768 / 1024 / 1280 — mobile is the default, desktop adds columns.</span>
        </div>
        <Button size="xs" variant="secondary" onClick={() => setTab(tab === 'chat' ? 'grid' : 'chat')}>
          Toggle layout
        </Button>
      </div>
    </div>
  );
}
