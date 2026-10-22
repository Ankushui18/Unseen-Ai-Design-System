import { useState } from 'react';
import { ArrowRight, Check, Contrast, Moon, Sun } from 'lucide-react';
import { PageHeader, Section } from '../components/layout/Page';
import { Button } from '../components/ui/Button';
import { Badge, GradientBadge, StatusDot } from '../components/ui/Badge';
import { Segmented } from '../components/ui/Controls';
import { Avatar, AvatarStack } from '../components/ui/Avatar';
import { Progress } from '../components/ui/Feedback';
import { ChatMessage, PromptVariable, Sparkline } from '../components/ui/AI';
import { StatCard, Table, TableHead, Td, Th, Tr } from '../components/ui/DataDisplay';
import { GuardrailBanner, TokenCounter } from '../components/ui/AIExtra';
import { Legend, MiniBars } from '../components/ui/Charts';
import { semanticColors } from '../design/tokens';
import { contrastReport } from '../design/contrast-report';
import { cn } from '@/lib/utils';

/** Renders children in the opposite (or a forced) theme, regardless of the app theme. */
function ThemePane({ mode, children }: { mode: 'light' | 'dark'; children: React.ReactNode }) {
  return (
    <div className={cn('rounded-xl border border-line bg-canvas p-3', mode === 'dark' && 'dark')}>
      <div className={cn('space-y-2.5', mode === 'dark' && 'dark')}>{children}</div>
    </div>
  );
}

function PanelTitle({ icon, label, mode }: { icon: React.ReactNode; label: string; mode: 'light' | 'dark' }) {
  return (
    <div className="mb-2 flex items-center gap-1.5">
      <span className="text-muted">{icon}</span>
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-faint">{label}</span>
      <span className="ml-auto font-mono text-[9px] text-faint">{mode === 'light' ? 'light' : 'dark'}</span>
    </div>
  );
}

export function ComparePage() {
  const [sample, setSample] = useState<'surface' | 'chat' | 'data'>('surface');
  const [pinned, setPinned] = useState(false);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Product screen · themes"
        title="Light & dark, side by side."
        description="The same components, the same tokens, two modes. Nothing is redrawn for dark — the semantic layer flips and every surface follows. Compare them here, then lock the one you ship."
        meta={
          <>
            <Badge tone="brand" variant="soft">20 shared tokens</Badge>
            <Badge tone="neutral" variant="outline">AA in both modes</Badge>
            <Badge tone="neutral" variant="outline">no per-mode components</Badge>
          </>
        }
        actions={
          <Segmented
            size="sm"
            value={sample}
            onChange={setSample}
            options={[
              { value: 'surface', label: 'Surfaces' },
              { value: 'chat', label: 'Chat' },
              { value: 'data', label: 'Data' },
            ]}
          />
        }
      />

      <Section
        index="01"
        title="Side by side"
        description="Toggle the app theme — these panes stay pinned to their own mode"
        aside={<Badge tone="neutral" variant="outline">forced theme wrappers</Badge>}
      >
        <div className="grid gap-3 lg:grid-cols-2">
          {(['light', 'dark'] as const).map(mode => (
            <ThemePane key={mode} mode={mode}>
              <PanelTitle icon={mode === 'light' ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />} label={mode === 'light' ? 'Light mode' : 'Dark mode'} mode={mode} />

              {sample === 'surface' && (
                <>
                  <div className="rounded-xl border border-line bg-surface p-3 shadow-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar initials="RK" size="sm" tone="pink" status="online" />
                        <div>
                          <div className="text-[11.5px] font-semibold text-ink">Rania K.</div>
                          <div className="flex items-center gap-1 font-mono text-[9px] text-faint">
                            <StatusDot tone="success" pulse /> workspace owner
                          </div>
                        </div>
                      </div>
                      <Badge tone="brand" variant="solid">Pro</Badge>
                    </div>
                    <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                      <div className="rounded-md bg-surface-2 p-2">
                        <div className="text-[8.5px] uppercase tracking-wider text-faint">Requests</div>
                        <div className="font-mono text-[13px] font-bold text-ink">1.28M</div>
                      </div>
                      <div className="rounded-md bg-brand-soft p-2">
                        <div className="text-[8.5px] uppercase tracking-wider text-brand">Spend</div>
                        <div className="font-mono text-[13px] font-bold text-brand-strong dark:text-brand">$1,824</div>
                      </div>
                    </div>
                    <div className="mt-2.5 flex gap-1.5">
                      <Button size="xs" className="flex-1">Deploy</Button>
                      <Button size="xs" variant="secondary" className="flex-1">Cancel</Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge tone="success" variant="soft">Live</Badge>
                    <Badge tone="warning" variant="soft">Degraded</Badge>
                    <Badge tone="danger" variant="soft">Failed</Badge>
                    <Badge tone="amber" variant="solid">Trial</Badge>
                    <Badge tone="violet" variant="outline">Beta</Badge>
                  </div>

                  <div className="rounded-lg border border-line bg-surface p-2.5">
                    <div className="mb-1.5 flex items-center justify-between text-[10px]">
                      <span className="font-medium text-ink-soft">Monthly budget</span>
                      <span className="font-mono text-faint">$1,824 / $2,500</span>
                    </div>
                    <Progress value={73} size="sm" />
                    <p className="mt-1.5 text-[9px] text-faint">Resets in 6 days · auto-pause at 100%</p>
                  </div>

                  <AvatarStack people={[{ id: 'rk', initials: 'RK', tone: 'pink' }, { id: 'mc', initials: 'MC', tone: 'blue' }, { id: 'jl', initials: 'JL', tone: 'amber' }, { id: 'ap', initials: 'AP', tone: 'mint' }]} max={4} />
                </>
              )}

              {sample === 'chat' && (
                <>
                  <ChatMessage role="system">gpt-4o · production</ChatMessage>
                  <ChatMessage role="user" time="09:41">Why did p95 rise after the router change?</ChatMessage>
                  <ChatMessage role="assistant" time="09:41" streaming>
                    Cold connection pools on the new pod set. Warm them before shifting traffic.
                  </ChatMessage>
                  <div className="rounded-lg border border-line bg-surface p-2">
                    <PromptVariable name="environment" value="production" />
                    <div className="mt-1.5"><PromptVariable name="window" value="1h" /></div>
                  </div>
                  <TokenCounter tokens={18420} limit={32768} breakdown={[{ label: 'input', value: 42, tone: 'brand' }, { label: 'ctx', value: 21, tone: 'pink' }, { label: 'output', value: 13, tone: 'amber' }]} />
                </>
              )}

              {sample === 'data' && (
                <>
                  <StatCard label="Requests" value="1.28M" delta="+12.4%" data={[8, 12, 10, 16, 15, 21, 24]} />
                  <div className="overflow-hidden rounded-lg border border-line bg-surface">
                    <Table>
                      <TableHead>
                        <tr>
                          <Th>Model</Th>
                          <Th align="right">Pass</Th>
                        </tr>
                      </TableHead>
                      <tbody>
                        {[
                          { m: 'GPT-4o', p: '94%' },
                          { m: 'Claude 3.5', p: '88%' },
                          { m: 'Gemini', p: '63%' },
                        ].map(row => (
                          <Tr key={row.m}>
                            <Td className="font-medium text-ink">{row.m}</Td>
                            <Td align="right" mono>{row.p}</Td>
                          </Tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  <div className="rounded-lg border border-line bg-surface p-2.5">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[9.5px] font-semibold text-ink">Tokens · 7d</span>
                      <span className="font-mono text-[8.5px] text-success">+8.1%</span>
                    </div>
                    <Sparkline data={[10, 14, 12, 18, 16, 22, 20, 26, 24, 30]} height={30} />
                    <div className="mt-2"><MiniBars values={[6, 9, 7, 12, 10, 15, 14]} height={22} tone="pink" /></div>
                    <div className="mt-2"><Legend items={[{ label: 'input', tone: 'brand', value: '58%' }, { label: 'output', tone: 'pink', value: '27%' }, { label: 'cached', tone: 'muted', value: '15%' }]} /></div>
                  </div>
                </>
              )}
            </ThemePane>
          ))}
        </div>
      </Section>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        <Section index="02" title="What flips" description="Roles stay, values move" flush>
          <div className="max-h-[330px] overflow-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-surface-2 text-[9px] font-bold uppercase tracking-[0.1em] text-faint">
                <tr>
                  <th className="px-3 py-2">Token</th>
                  <th className="px-3 py-2">Light</th>
                  <th className="px-3 py-2">Dark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {semanticColors.map(token => (
                  <tr key={token.name} className="text-[10.5px]">
                    <td className="px-3 py-1.5 font-mono text-[9.5px] text-ink-soft">{token.name}</td>
                    <td className="px-3 py-1.5">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded-sm border border-black/10 dark:border-white/10" style={{ background: token.light }} />
                        <span className="font-mono text-[9px] text-muted">{token.light}</span>
                      </span>
                    </td>
                    <td className="px-3 py-1.5">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded-sm border border-black/10 dark:border-white/10" style={{ background: token.dark }} />
                        <span className="font-mono text-[9px] text-muted">{token.dark}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section index="03" title="Parity checks" description="Both modes, measured">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {(['light', 'dark'] as const).map(mode => {
                const rows = contrastReport.find(r => r.mode === mode)?.rows ?? [];
                const worst = rows.reduce((acc, r) => (r.ratio < acc.ratio ? r : acc), rows[0]);
                const passing = rows.filter(r => r.body).length;
                return (
                  <div key={mode} className="rounded-lg border border-line bg-surface-2 p-2.5">
                    <div className="flex items-center gap-1.5">
                      {mode === 'light' ? <Sun className="h-3 w-3 text-faint" /> : <Moon className="h-3 w-3 text-faint" />}
                      <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-faint">{mode}</span>
                    </div>
                    <div className="mt-1 font-mono text-[16px] font-extrabold text-ink">{passing}/{rows.length}</div>
                    <div className="text-[9px] text-muted">text pairs pass AA</div>
                    <div className="mt-1 font-mono text-[8.5px] text-faint">worst {worst?.ratio.toFixed(2)}</div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-lg border border-line bg-surface p-3">
              <div className="flex items-center gap-1.5">
                <Contrast className="h-3.5 w-3.5 text-brand" />
                <span className="text-[10.5px] font-semibold text-ink">Rules</span>
              </div>
              <ul className="mt-1.5 space-y-1 text-[10px] leading-4 text-muted">
                {[
                  'Dark mode re-maps roles — it never introduces new names.',
                  'Fills flip to the bright hue; on-colours flip to near-black.',
                  'Shadows get denser, not lighter: dark UIs need more separation.',
                  'Borders stay subtle; elevation carries the hierarchy instead.',
                ].map(rule => (
                  <li key={rule} className="flex gap-1.5">
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-success" strokeWidth={3} />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            <GuardrailBanner
              tone="warning"
              title="Don’t hand-tune dark values"
              description="If a dark surface looks wrong, fix the token — a one-off hex in a component is a future bug in both modes."
              rule="theme · token-only rule"
            />

            <div className="flex items-center justify-between rounded-lg border border-line bg-surface-2 px-3 py-2">
              <span className="text-[10px] text-muted">Pin this comparison while you browse</span>
              <Button size="xs" variant={pinned ? 'primary' : 'secondary'} onClick={() => setPinned(p => !p)}>
                {pinned ? 'Pinned' : 'Pin'}
              </Button>
            </div>
          </div>
        </Section>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { title: 'Same component, same props', body: 'No `isDark` branch anywhere in src/components — grep it.', icon: Check },
          { title: 'One class flips everything', body: '`.dark` on a wrapper is enough, which is how these panes work.', icon: Moon },
          { title: 'Figma mirrors it', body: 'Two modes on one collection; switch mode on a frame, not a duplicate.', icon: ArrowRight },
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
          <GradientBadge>themes</GradientBadge>
          <span className="text-[10.5px] text-muted">Toggle the app theme with ⌘J — the panes above keep their own mode.</span>
        </div>
        <Button size="xs" variant="secondary" iconRight={<ArrowRight className="h-3 w-3" />}>Open Foundations</Button>
      </div>
    </div>
  );
}
