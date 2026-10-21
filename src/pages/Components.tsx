import { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Bell,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  Filter,
  Grid2X2,
  Info,
  Lock,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sparkles,
  Trash2,
  TrendingUp,
  UserPlus,
  Users,
  Wand2,
  Zap,
} from 'lucide-react';
import { PageHeader, Section, DemoRow, SurfacePanel } from '../components/layout/Page';
import { Button, IconButton } from '../components/ui/Button';
import { Badge, GradientBadge, Kbd, StatusDot } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { CopyField, Field, Input, PasswordInput, SearchInput, Select, Textarea } from '../components/ui/Field';
import { Checkbox, Radio, Segmented, Slider, Switch } from '../components/ui/Controls';
import { Avatar, AvatarStack } from '../components/ui/Avatar';
import { Tabs } from '../components/ui/Tabs';
import { Alert, EmptyState, Progress, ProgressRing, Skeleton, Toast } from '../components/ui/Feedback';
import { ConfirmDialogCard, Drawer, Modal, Tooltip } from '../components/ui/Overlay';
import { ChatMessage, ModelCard, Sparkline } from '../components/ui/AI';
import {
  DataBar,
  DiffView,
  JsonView,
  KeyValue,
  LogViewer,
  Pagination,
  StatCard,
  Table,
  TableHead,
  TableToolbar,
  Td,
  Th,
  Timeline,
  TreeView,
  Tr,
} from '../components/ui/DataDisplay';
import { ChartCard, Donut, Funnel, Gauge, Heatmap, Legend, MiniBars, Scatter, StackedBar } from '../components/ui/Charts';
import { AnchorNav, Breadcrumbs, DropdownMenu, NavList, SegmentedTabs, Stepper } from '../components/ui/Navigation';
import {
  Accordion,
  Banner,
  Calendar,
  ColorSwatchRow,
  Combobox,
  FileDrop,
  InlineEdit,
  NumberStepper,
  OptionCards,
  Popover,
  Rating,
  TagInput,
} from '../components/ui/Advanced';
import {
  CitationList,
  ConfidenceMeter,
  EvalRubric,
  GuardrailBanner,
  ImageGenCard,
  ModelCompareTable,
  PromptCard,
  RunTrace,
  TokenCounter,
  ToolCallCard,
  VoiceWave,
} from '../components/ui/AIExtra';
import { cn } from '@/lib/utils';

type Filter = 'All' | 'Actions' | 'Forms' | 'Display' | 'Navigation' | 'Feedback' | 'Overlays';
const filters: Filter[] = ['All', 'Actions', 'Forms', 'Display', 'Navigation', 'Feedback', 'Overlays'];

const tableRows = [
  { id: 'gpt-4o', name: 'GPT-4o Production', env: 'production', status: 'Active', requests: '1,284,392', tokens: '48.2M', cost: '$1,824.50' },
  { id: 'vision', name: 'Vision Classifier', env: 'staging', status: 'Paused', requests: '842,105', tokens: '19.6M', cost: '$642.18' },
  { id: 'copilot', name: 'Support Copilot', env: 'production', status: 'Active', requests: '534,880', tokens: '12.8M', cost: '$388.02' },
  { id: 'legacy', name: 'Legacy Summarizer', env: 'deprecated', status: 'Error', requests: '92,441', tokens: '2.1M', cost: '$71.44' },
];

export function Components() {
  const [filter, setFilter] = useState<Filter>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tab, setTab] = useState('overview');
  const [pillTab, setPillTab] = useState('design');
  const [segment, setSegment] = useState<'24h' | '7d' | '30d'>('7d');
  const [checks, setChecks] = useState({ streaming: true, history: true, retry: false });
  const [radio, setRadio] = useState('team');
  const [switches, setSwitches] = useState({ live: true, audit: false, beta: true });
  const [temperature, setTemperature] = useState(35);
  const [alertOpen, setAlertOpen] = useState(true);
  const [page, setPage] = useState(1);
  const [docsTab, setDocsTab] = useState<'overview' | 'api' | 'usage'>('overview');
  const [navValue, setNavValue] = useState('models');
  const [step, setStep] = useState(1);
  const [deployMode, setDeployMode] = useState<'canary' | 'blue' | 'shadow'>('canary');
  const [chartTab, setChartTab] = useState<'quality' | 'cost'>('quality');

  const show = (category: Filter) => filter === 'All' || filter === category;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Components · 111 primitives"
        title="The component library."
        description="Every primitive is theme-aware, keyboard reachable and composed from the same tokens. Use the filter to browse by job."
        meta={
          <>
            <Badge tone="brand" variant="soft">15 sections</Badge>
            <Badge tone="neutral" variant="outline">Light + dark</Badge>
            <Badge tone="neutral" variant="outline">Focus states included</Badge>
          </>
        }
        actions={
          <>
            <SearchInput placeholder="Filter components…" className="hidden w-52 sm:block" />
            <Button variant="secondary" iconLeft={<Download className="h-4 w-4" />}>
              Get the kit
            </Button>
          </>
        }
      />

      <div className="sticky top-14 z-10 -mx-1 flex flex-wrap items-center gap-1.5 rounded-xl border border-line bg-canvas/85 px-2 py-2 backdrop-blur-xl">
        <span className="mr-1 hidden items-center gap-1.5 pl-1 text-[10px] font-bold uppercase tracking-[0.14em] text-faint sm:flex">
          <Filter className="h-3 w-3" /> Filter
        </span>
        {filters.map(item => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={cn(
              'rounded-full px-3 py-1.5 text-[11px] font-semibold transition',
              filter === item
                ? 'bg-inverse text-on-inverse shadow-xs'
                : 'border border-line bg-surface text-muted hover:border-brand/35 hover:text-ink',
            )}
          >
            {item}
          </button>
        ))}
        <span className="ml-auto hidden pr-1 font-mono text-[10px] text-faint md:block">
          {filter === 'All' ? '15 sections' : `filtered · ${filter.toLowerCase()}`}
        </span>
      </div>

      {show('Actions') && (
        <Section id="actions" index="01" title="Buttons" description="One primary action per view">
          <div className="space-y-6">
            <DemoRow label="Variants" note="7 styles">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="soft">Soft</Button>
              <Button variant="danger">Delete</Button>
              <Button variant="link" iconRight={<ArrowRight className="h-3.5 w-3.5" />}>Link</Button>
            </DemoRow>

            <DemoRow label="Sizes" note="h-28 → h-44">
              <Button size="xs">Extra small</Button>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </DemoRow>

            <DemoRow label="States">
              <Button>Default</Button>
              <Button className="ring-2 ring-brand/30 ring-offset-2 ring-offset-surface">Focus visible</Button>
              <Button loading>Generating</Button>
              <Button disabled>Disabled</Button>
              <Button variant="secondary" loading>Syncing</Button>
            </DemoRow>

            <DemoRow label="With icons">
              <Button iconLeft={<Sparkles className="h-4 w-4" />}>Generate</Button>
              <Button variant="secondary" iconLeft={<Plus className="h-4 w-4" />}>New model</Button>
              <Button variant="outline" iconRight={<ArrowRight className="h-4 w-4" />}>Continue</Button>
              <Button variant="soft" iconLeft={<Wand2 className="h-4 w-4" />}>Improve prompt</Button>
              <span className="mx-1 h-6 w-px bg-line" />
              {[Search, Bell, MoreHorizontal, Trash2].map((Icon, i) => (
                <IconButton key={i} label={`Icon action ${i + 1}`} variant={i === 3 ? 'danger' : 'secondary'}>
                  <Icon className="h-4 w-4" />
                </IconButton>
              ))}
              <IconButton label="Quick add" variant="primary">
                <Plus className="h-4 w-4" />
              </IconButton>
            </DemoRow>

            <DemoRow label="Button group" note="split + segmented">
              <span className="inline-flex overflow-hidden rounded-md shadow-xs">
                <Button className="rounded-none rounded-l-md">Deploy</Button>
                <button className="border-l border-white/20 bg-[linear-gradient(135deg,#38AEFA,#0272C6)] px-2.5 text-white transition hover:brightness-105">
                  <ChevronDown className="h-4 w-4" />
                </button>
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-line bg-surface p-1">
                <Button size="sm" variant="ghost" className="px-2.5"><Grid2X2 className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="ghost" className="bg-surface-3 px-2.5 text-ink"><BarChart3 className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="ghost" className="px-2.5"><Settings className="h-3.5 w-3.5" /></Button>
              </span>
            </DemoRow>
          </div>
        </Section>
      )}

      {show('Forms') && (
        <Section id="fields" index="02" title="Fields" description="13px workhorse inputs, 40px height">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <Field label="Workspace name" hint="Shown to everyone in your organization.">
                <Input placeholder="Unseen Labs" defaultValue="Unseen Labs" />
              </Field>
              <Field label="Work email" required>
                <Input icon={<Mail className="h-4 w-4" />} placeholder="you@company.com" />
              </Field>
              <Field label="API key" hint="Rotate every 90 days.">
                <PasswordInput defaultValue="sk-unseen-4821" />
              </Field>
              <Field label="Search">
                <SearchInput placeholder="Search models, docs, members…" shortcut="⌘K" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Invalid" error="That endpoint is already in use.">
                  <Input invalid defaultValue="api.unseen.ai/v1" />
                </Field>
                <Field label="Verified">
                  <Input valid defaultValue="workspace-prod" />
                </Field>
              </div>
            </div>
            <div className="space-y-4">
              <Field label="System prompt" hint="Used as the first message for every request.">
                <Textarea placeholder="You are a concise product analyst…" defaultValue="You are Unseen's product analyst. Answer with short, cited findings." />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Default model">
                  <Select defaultValue="gpt-4o">
                    <option value="gpt-4o">GPT-4o · OpenAI</option>
                    <option value="claude">Claude 3.5 · Anthropic</option>
                    <option value="gemini">Gemini Pro · Google</option>
                  </Select>
                </Field>
                <Field label="Region">
                  <Select defaultValue="iad">
                    <option value="iad">us-east-1</option>
                    <option value="fra">eu-central-1</option>
                    <option value="sin">ap-southeast-1</option>
                  </Select>
                </Field>
              </div>
              <CopyField label="Endpoint" value="https://api.unseen.ai/v2/chat/completions" />
              <CopyField label="Secret key" value="sk-live-9f82b41c7de04a6f" masked />
              <Field label="Disabled input" hint="Read-only fields keep their token styling.">
                <Input disabled defaultValue="Managed by your SSO provider" />
              </Field>
            </div>
          </div>
        </Section>
      )}

      {show('Forms') && (
        <Section id="selection" index="03" title="Selection controls" description="Clickable — try them">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div>
                <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Checkbox</div>
                <div className="space-y-3">
                  <Checkbox checked={checks.streaming} onChange={v => setChecks(c => ({ ...c, streaming: v }))} label="Stream responses" description="Render tokens as they arrive." />
                  <Checkbox checked={checks.history} onChange={v => setChecks(c => ({ ...c, history: v }))} label="Save conversation history" />
                  <Checkbox checked={checks.retry} onChange={v => setChecks(c => ({ ...c, retry: v }))} label="Auto-retry on failure" />
                  <Checkbox checked={false} indeterminate label="Select all models" />
                  <Checkbox checked={false} disabled label="Disabled option" />
                </div>
              </div>
              <div>
                <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Radio group</div>
                <div className="space-y-3">
                  <Radio name="plan" checked={radio === 'solo'} onChange={() => setRadio('solo')} label="Just me" description="One seat, unlimited playground." />
                  <Radio name="plan" checked={radio === 'team'} onChange={() => setRadio('team')} label="Team" description="Up to 25 seats with shared keys." />
                  <Radio name="plan" checked={radio === 'scale'} onChange={() => setRadio('scale')} label="Scale" description="SSO, audit logs, dedicated capacity." />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Switch</div>
                <div className="space-y-3">
                  <Switch checked={switches.live} onChange={v => setSwitches(s => ({ ...s, live: v }))} label="Production traffic" description="Route live requests to this model." />
                  <Switch checked={switches.audit} onChange={v => setSwitches(s => ({ ...s, audit: v }))} label="Audit logging" />
                  <Switch checked={switches.beta} onChange={v => setSwitches(s => ({ ...s, beta: v }))} label="Beta features" tone="pink" />
                  <div className="flex items-center gap-4 border-t border-line pt-3">
                    <Switch checked size="sm" onChange={() => undefined} />
                    <Switch checked size="md" onChange={() => undefined} />
                    <Switch checked size="lg" onChange={() => undefined} />
                    <Switch checked={false} disabled />
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Segmented</div>
                <div className="flex flex-wrap items-center gap-3">
                  <Segmented
                    value={segment}
                    onChange={setSegment}
                    options={[
                      { value: '24h', label: '24h' },
                      { value: '7d', label: '7d' },
                      { value: '30d', label: '30d' },
                    ]}
                  />
                  <Segmented size="sm" value={segment} onChange={setSegment} options={[{ value: '24h', label: 'Hourly' }, { value: '7d', label: 'Daily' }]} />
                </div>
              </div>
              <div>
                <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Slider</div>
                <div className="space-y-5">
                  <Slider label="Temperature" value={temperature} onChange={setTemperature} min={0} max={100} suffix="%" />
                  <Slider label="Max tokens" value={4096} min={256} max={8192} step={256} />
                  <Slider label="Top-p" value={0.9} min={0} max={1} step={0.05} showTicks onChange={() => undefined} />
                </div>
              </div>
            </div>
          </div>
        </Section>
      )}

      {show('Display') && (
        <Section id="badges" index="04" title="Badges & status" description="Semantic, never decorative">
          <div className="space-y-6">
            <DemoRow label="Soft" note="default">
              {(['brand', 'pink', 'amber', 'success', 'danger', 'warning', 'violet', 'neutral'] as const).map(tone => (
                <Badge key={tone} tone={tone}>{tone}</Badge>
              ))}
            </DemoRow>
            <DemoRow label="Solid">
              {(['brand', 'pink', 'amber', 'success', 'danger', 'neutral'] as const).map(tone => (
                <Badge key={tone} tone={tone} variant="solid">{tone}</Badge>
              ))}
            </DemoRow>
            <DemoRow label="Outline">
              {(['brand', 'success', 'danger', 'neutral'] as const).map(tone => (
                <Badge key={tone} tone={tone} variant="outline">{tone}</Badge>
              ))}
            </DemoRow>
            <DemoRow label="With dot / AI">
              <Badge tone="success" variant="soft"><StatusDot tone="success" pulse /> Live</Badge>
              <Badge tone="warning" variant="soft"><StatusDot tone="warning" /> Degraded</Badge>
              <Badge tone="danger" variant="soft"><StatusDot tone="danger" /> Failed</Badge>
              <GradientBadge><Sparkles className="h-3 w-3" /> PRO</GradientBadge>
              <GradientBadge>AI</GradientBadge>
              <Badge tone="violet" variant="soft">BETA</Badge>
              <Badge tone="neutral" variant="dot"><span className="pl-1">Dot-only variant</span></Badge>
            </DemoRow>
            <DemoRow label="Keyboard hints">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-muted">
                Open palette <Kbd>⌘</Kbd> <Kbd>K</Kbd>
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-muted">
                Toggle theme <Kbd>⌘</Kbd> <Kbd>J</Kbd>
              </span>
            </DemoRow>
          </div>
        </Section>
      )}

      {show('Display') && (
        <Section id="avatars" index="05" title="Avatars" description="Identity with presence">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <div className="space-y-6">
              <DemoRow label="Sizes" note="24 → 64">
                {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => (
                  <Avatar key={size} initials="RK" size={size} tone="blue" />
                ))}
              </DemoRow>
              <DemoRow label="Tones">
                {(['blue', 'pink', 'amber', 'violet', 'mint', 'ink'] as const).map(tone => (
                  <Avatar key={tone} initials={tone.slice(0, 2).toUpperCase()} tone={tone} status={tone === 'pink' ? 'online' : undefined} />
                ))}
              </DemoRow>
              <DemoRow label="Presence & group">
                <Avatar initials="ON" tone="ink" status="online" ring />
                <Avatar initials="AW" tone="amber" status="away" ring />
                <Avatar initials="OF" tone="soft" status="offline" ring />
                <AvatarStack
                  size="md"
                  people={[
                    { id: '1', initials: 'RK', tone: 'blue' },
                    { id: '2', initials: 'MN', tone: 'pink' },
                    { id: '3', initials: 'JL', tone: 'amber' },
                    { id: '4', initials: 'SC', tone: 'mint' },
                    { id: '5', initials: 'YT', tone: 'violet' },
                    { id: '6', initials: 'PL', tone: 'ink' },
                  ]}
                />
              </DemoRow>
            </div>
            <SurfacePanel label="Member row">
              <div className="space-y-3">
                {[
                  { initials: 'RK', name: 'Rania Khan', role: 'Design lead', tone: 'pink' as const, status: 'online' as const },
                  { initials: 'MN', name: 'Marcus Ng', role: 'ML engineer', tone: 'blue' as const, status: 'away' as const },
                  { initials: 'JL', name: 'Jules Laurent', role: 'Product', tone: 'amber' as const, status: 'offline' as const },
                ].map(member => (
                  <div key={member.name} className="flex items-center gap-3">
                    <Avatar initials={member.initials} tone={member.tone} status={member.status} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12px] font-semibold text-ink">{member.name}</div>
                      <div className="text-[10.5px] text-muted">{member.role}</div>
                    </div>
                    <Button size="xs" variant="secondary">Manage</Button>
                  </div>
                ))}
                <Button size="sm" variant="outline" className="w-full" iconLeft={<UserPlus className="h-3.5 w-3.5" />}>Invite member</Button>
              </div>
            </SurfacePanel>
          </div>
        </Section>
      )}

      {show('Display') && (
        <Section id="cards" index="06" title="Cards" description="One shadow, generous internal rhythm">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="overflow-hidden">
              <div className="flex items-start justify-between p-5 pb-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-faint">API calls today</div>
                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold tracking-tight text-ink tabular-nums">1,284,392</span>
                    <Badge tone="success" variant="soft">
                      <TrendingUp className="h-3 w-3" /> 12.4%
                    </Badge>
                  </div>
                </div>
                <IconButton label="More" size="sm" variant="ghost"><MoreHorizontal className="h-4 w-4" /></IconButton>
              </div>
              <div className="px-2 pb-2">
                <Sparkline data={[12, 18, 15, 24, 22, 30, 26, 38, 34, 44, 41, 52]} height={54} />
              </div>
              <div className="flex items-center justify-between border-t border-line px-5 py-2.5 text-[10.5px] text-faint">
                <span>vs. previous 24h</span>
                <span className="font-mono">updated 2m ago</span>
              </div>
            </Card>

            <ModelCard
              name="GPT-4o"
              provider="OpenAI"
              description="Best general-purpose reasoning and vision for production chat."
              context="128K"
              price="$0.01 / 1K"
              badge={<Badge tone="brand" variant="soft">Default</Badge>}
              selected
            />

            <Card className="relative overflow-hidden p-5">
              <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(100deg,#0E91F0,#F72685_60%,#FF7A0D)]" />
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-pink-soft text-pink">
                <Sparkles className="h-4 w-4" />
              </span>
              <h3 className="mt-3.5 text-[14px] font-bold text-ink">Smart completion</h3>
              <p className="mt-1 text-[11.5px] leading-5 text-muted">Context-aware suggestions that adapt to your workspace and writing style.</p>
              <div className="mt-4 flex items-center justify-between">
                <Badge tone="pink" variant="soft">Pro feature</Badge>
                <Button size="xs" variant="ghost" iconRight={<ArrowRight className="h-3 w-3" />}>Enable</Button>
              </div>
            </Card>
          </div>
        </Section>
      )}

      {show('Navigation') && (
        <Section id="navigation" index="07" title="Navigation" description="Tabs, breadcrumbs and compact sidebars">
          <div className="space-y-7">
            <div>
              <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Underline tabs</div>
              <Tabs
                value={tab}
                onChange={setTab}
                items={[
                  { value: 'overview', label: 'Overview' },
                  { value: 'models', label: 'Models', count: 12 },
                  { value: 'usage', label: 'Usage' },
                  { value: 'settings', label: 'Settings' },
                ]}
              />
              <div className="mt-3 text-[11.5px] text-muted">Active panel: <span className="font-mono text-ink-soft">{tab}</span></div>
            </div>
            <div className="flex flex-wrap items-start gap-8">
              <div>
                <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Pill tabs</div>
                <Tabs
                  variant="pill"
                  value={pillTab}
                  onChange={setPillTab}
                  items={[
                    { value: 'design', label: 'Design' },
                    { value: 'code', label: 'Code' },
                    { value: 'tokens', label: 'Tokens' },
                  ]}
                />
              </div>
              <div>
                <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Segment tabs</div>
                <Tabs
                  variant="segment"
                  value={pillTab}
                  onChange={setPillTab}
                  items={[
                    { value: 'design', label: 'Design' },
                    { value: 'code', label: 'Code' },
                    { value: 'tokens', label: 'Tokens' },
                  ]}
                />
              </div>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              <SurfacePanel label="Breadcrumb">
                <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[11.5px]">
                  <span className="text-muted transition hover:text-ink">Workspace</span>
                  <ChevronRight className="h-3 w-3 text-faint" />
                  <span className="text-muted transition hover:text-ink">Models</span>
                  <ChevronRight className="h-3 w-3 text-faint" />
                  <span className="font-semibold text-ink">GPT-4o</span>
                  <ChevronRight className="h-3 w-3 text-faint" />
                  <span className="text-faint">Settings</span>
                </nav>
              </SurfacePanel>
              <SurfacePanel label="Compact sidebar" padded={false}>
                <div className="p-2">
                  <div className="mb-1 flex items-center gap-2 px-2 py-1.5">
                    <span className="grid h-5 w-5 place-items-center rounded-md bg-[linear-gradient(140deg,#0E91F0,#F72685)] text-white">
                      <Zap className="h-3 w-3" />
                    </span>
                    <span className="text-[11px] font-bold text-ink">Unseen AI</span>
                  </div>
                  {[
                    { icon: Grid2X2, label: 'Dashboard' },
                    { icon: Sparkles, label: 'Models', active: true },
                    { icon: BarChart3, label: 'Analytics' },
                    { icon: Users, label: 'Team' },
                    { icon: Settings, label: 'Settings' },
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className={cn(
                          'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[11px] font-medium transition',
                          item.active ? 'bg-brand-soft text-brand-strong dark:text-brand' : 'text-muted hover:bg-surface-3 hover:text-ink',
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {item.label}
                        {item.active && <span className="ml-auto h-1 w-1 rounded-full bg-brand" />}
                      </div>
                    );
                  })}
                </div>
              </SurfacePanel>
            </div>
          </div>
        </Section>
      )}

      {show('Display') && (
        <Section id="table" index="08" title="Data table" description="Sortable headers, selection, dense rows" flush>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-[12px]">
              <thead className="bg-surface-2 text-[9.5px] font-bold uppercase tracking-[0.12em] text-faint">
                <tr>
                  <th className="w-10 px-4 py-2.5"><Checkbox checked={false} /></th>
                  {['Model', 'Status', 'Requests', 'Tokens', 'Cost', ''].map((head, i) => (
                    <th key={i} className="px-4 py-2.5">
                      {head && (
                        <button className="inline-flex items-center gap-1 transition hover:text-ink">
                          {head}
                          {i < 5 && head !== 'Status' && <ChevronDown className="h-2.5 w-2.5" />}
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {tableRows.map(row => (
                  <tr key={row.id} className="transition hover:bg-brand-soft/40">
                    <td className="px-4 py-3"><Checkbox checked={false} /></td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-ink">{row.name}</div>
                      <div className="font-mono text-[9.5px] text-faint">{row.env}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        tone={row.status === 'Active' ? 'success' : row.status === 'Paused' ? 'warning' : 'danger'}
                        variant="soft"
                      >
                        <StatusDot tone={row.status === 'Active' ? 'success' : row.status === 'Paused' ? 'warning' : 'danger'} />
                        {row.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] tabular-nums text-ink-soft">{row.requests}</td>
                    <td className="px-4 py-3 font-mono text-[11px] tabular-nums text-ink-soft">{row.tokens}</td>
                    <td className="px-4 py-3 font-mono text-[11px] tabular-nums text-ink-soft">{row.cost}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <IconButton label="Edit model" size="xs" variant="ghost"><Settings className="h-3.5 w-3.5" /></IconButton>
                        <IconButton label="Copy endpoint" size="xs" variant="ghost"><Copy className="h-3.5 w-3.5" /></IconButton>
                        <IconButton label="Delete model" size="xs" variant="ghost"><Trash2 className="h-3.5 w-3.5" /></IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 border-t border-line bg-surface-2/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-[11px] text-muted">
              <span className="font-mono">1–4 of 24</span>
              <span className="text-faint">rows</span>
            </div>
            <div className="flex items-center gap-1">
              <Button size="xs" variant="secondary" disabled>Previous</Button>
              {[1, 2, 3].map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={cn(
                    'h-7 w-7 rounded-md font-mono text-[11px] font-semibold transition',
                    page === n ? 'bg-brand-fill text-on-brand shadow-xs' : 'border border-line bg-surface text-muted hover:text-ink',
                  )}
                >
                  {n}
                </button>
              ))}
              <span className="px-1 text-[11px] text-faint">…</span>
              <Button size="xs" variant="secondary">Next</Button>
            </div>
          </div>
        </Section>
      )}

      {show('Feedback') && (
        <Section id="feedback" index="09" title="Feedback" description="Tell users what happened, and what to do next">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Alerts</div>
              {alertOpen ? (
                <Alert tone="brand" title="Workspace ready" onDismiss={() => setAlertOpen(false)}>
                  Your production endpoint passed all checks and is receiving traffic.
                </Alert>
              ) : (
                <Button size="sm" variant="secondary" onClick={() => setAlertOpen(true)}>Restore alert</Button>
              )}
              <Alert tone="success" title="Deployment complete">Model <span className="font-mono">gpt-4o-prod</span> is live in 3 regions.</Alert>
              <Alert tone="warning" title="Approaching rate limit">You have used 82% of monthly requests. Resets in 6 days.</Alert>
              <Alert tone="danger" title="Key revoked" action={<Button size="xs" variant="danger">Create new key</Button>}>
                Requests signed with <span className="font-mono">sk-live-9f82</span> will fail immediately.
              </Alert>
            </div>
            <div className="space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Toasts</div>
              <Toast tone="success" title="Model deployed" description="gpt-4o-prod · 3 regions · 412ms p95" action={<Button size="xs" variant="ghost">View</Button>} />
              <Toast tone="warning" title="Rate limit at 82%" description="Consider upgrading before the next batch run." />
              <Toast tone="danger" title="Generation failed" description="Upstream provider returned 529. Retry in 12s." action={<Button size="xs" variant="ghost">Retry</Button>} />
            </div>
          </div>

          <div className="mt-8 grid gap-6 border-t border-line pt-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Progress</div>
              <Progress value={68} label="Fine-tune job" showValue />
              <Progress value={92} tone="success" label="Monthly requests" showValue size="sm" />
              <Progress value={34} tone="danger" label="Error budget remaining" showValue />
              <div className="flex flex-wrap items-center gap-6 pt-1">
                <ProgressRing value={75} label="capacity" />
                <ProgressRing value={42} tone="pink" size={84} stroke={8} label="budget" />
                <div className="flex-1 space-y-2.5">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                  <Skeleton className="h-3 w-3/5" />
                  <div className="flex items-center gap-2 pt-1 text-[10.5px] text-faint">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand ds-pulse" /> Loading model summary…
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <EmptyState
                icon={<Sparkles className="h-5 w-5" />}
                title="No models yet"
                description="Create your first model to start serving traffic."
                action={<Button size="sm" iconLeft={<Plus className="h-3.5 w-3.5" />}>Create model</Button>}
              />
              <EmptyState
                tone="amber"
                icon={<Lock className="h-5 w-5" />}
                title="No results"
                description="Nothing matches “api-key-v3”. Try a shorter query."
                action={<Button size="sm" variant="outline">Clear search</Button>}
              />
            </div>
          </div>
        </Section>
      )}

      {show('Overlays') && (
        <Section id="overlays" index="10" title="Overlays" description="Tooltips, dialogs, drawers and popovers">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div>
                <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Tooltip</div>
                <div className="flex flex-wrap items-center gap-3">
                  <Tooltip content="Regenerate response" side="top">
                    <Button size="sm" variant="secondary"><Wand2 className="h-3.5 w-3.5" /></Button>
                  </Tooltip>
                  <Tooltip content="Copied to clipboard" side="bottom">
                    <Button size="sm" variant="outline"><Copy className="h-3.5 w-3.5" /></Button>
                  </Tooltip>
                  <Tooltip content="Costs $0.01 per 1K tokens" side="right">
                    <Badge tone="neutral" variant="outline">Pricing <Info className="h-3 w-3" /></Badge>
                  </Tooltip>
                  <Tooltip content="Requires admin" side="top">
                    <span><Button size="sm" disabled>Purge cache</Button></span>
                  </Tooltip>
                </div>
              </div>
              <div>
                <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Dialog & drawer</div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => setModalOpen(true)}>Open modal</Button>
                  <Button size="sm" variant="secondary" onClick={() => setDrawerOpen(true)}>Open drawer</Button>
                </div>
              </div>
              <div>
                <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Confirm</div>
                <ConfirmDialogCard
                  icon={<Trash2 className="h-4 w-4" />}
                  title="Delete API key?"
                  description="This action cannot be undone. Requests using sk-live-9f82 will fail immediately."
                  confirmLabel="Delete key"
                />
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Popover</div>
                <div className="rounded-2xl border border-line bg-surface p-4 shadow-pop">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-8 w-8 place-items-center rounded-md bg-brand-soft text-brand"><Zap className="h-4 w-4" /></span>
                    <div>
                      <div className="text-[12px] font-semibold text-ink">Token pricing updated</div>
                      <div className="text-[10.5px] text-muted">Effective Nov 1 · includes cached reads</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1.5 border-t border-line pt-3">
                    <div className="flex justify-between text-[10.5px] text-muted"><span>Input</span><span className="font-mono text-ink-soft">$0.01 / 1K</span></div>
                    <div className="flex justify-between text-[10.5px] text-muted"><span>Cached input</span><span className="font-mono text-ink-soft">$0.0025 / 1K</span></div>
                    <div className="flex justify-between text-[10.5px] text-muted"><span>Output</span><span className="font-mono text-ink-soft">$0.03 / 1K</span></div>
                  </div>
                  <Button size="xs" variant="secondary" className="mt-3 w-full">View pricing table</Button>
                </div>
              </div>
              <div>
                <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Context menu</div>
                <div className="max-w-[260px] rounded-xl border border-line bg-surface p-1.5 shadow-pop">
                  {[
                    { label: 'Rename', icon: Settings, shortcut: '⌘R' },
                    { label: 'Duplicate', icon: Copy, shortcut: '⌘D' },
                    { label: 'Export JSON', icon: Download, shortcut: '⌘E' },
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <button key={item.label} className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[12px] text-ink-soft transition hover:bg-surface-2">
                        <Icon className="h-3.5 w-3.5 text-faint" />
                        <span className="flex-1">{item.label}</span>
                        <span className="font-mono text-[9.5px] text-faint">{item.shortcut}</span>
                      </button>
                    );
                  })}
                  <div className="my-1 h-px bg-line" />
                  <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[12px] text-danger transition hover:bg-danger-soft">
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="flex-1">Delete</span>
                    <span className="font-mono text-[9.5px] text-danger/60">⌫</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Section>
      )}

      {show('Display') && (
        <Section id="charts" index="11" title="Charts & visualization" description="Hand-rolled SVG, so every mark inherits the theme">
          <div className="grid gap-4 lg:grid-cols-3">
            <ChartCard
              title="Throughput"
              description="7 days · all models"
              action={
                <SegmentedTabs
                  value={chartTab}
                  onChange={setChartTab}
                  options={[
                    { value: 'quality', label: 'Quality' },
                    { value: 'cost', label: 'Cost' },
                  ]}
                />
              }
              legend={
                <Legend
                  items={[
                    { label: 'Production', tone: 'brand', value: '1.2M' },
                    { label: 'Staging', tone: 'pink', value: '318K' },
                  ]}
                />
              }
            >
              <MiniBars values={chartTab === 'quality' ? [12, 18, 15, 24, 21, 30, 27, 34, 31, 39, 36, 44] : [8, 10, 9, 14, 12, 17, 16, 21, 19, 24, 22, 27]} height={72} />
              <div className="mt-2 flex justify-between font-mono text-[8.5px] text-faint">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
                <span>Sun</span>
              </div>
            </ChartCard>

            <ChartCard title="Spend by model" description="Current billing cycle">
              <div className="flex items-center gap-5">
                <Donut
                  size={116}
                  thickness={14}
                  centerValue="$1.8K"
                  centerLabel="spend"
                  segments={[
                    { label: 'GPT-4o', value: 62, tone: 'brand' },
                    { label: 'Claude', value: 21, tone: 'pink' },
                    { label: 'Gemini', value: 11, tone: 'amber' },
                    { label: 'Other', value: 6, tone: 'muted' },
                  ]}
                />
                <Legend
                  className="flex-1"
                  items={[
                    { label: 'GPT-4o', tone: 'brand', value: '62%' },
                    { label: 'Claude 3.5', tone: 'pink', value: '21%' },
                    { label: 'Gemini', tone: 'amber', value: '11%' },
                    { label: 'Other', tone: 'muted', value: '6%' },
                  ]}
                />
              </div>
            </ChartCard>

            <ChartCard title="Retention" description="30-day cohort">
              <div className="flex items-center justify-around">
                <Gauge value={82} label="retention" sublabel="+4.2 pt" size={116} />
                <div className="space-y-2">
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.1em] text-faint">Week 1</div>
                    <div className="font-mono text-[12px] font-bold text-ink">94%</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.1em] text-faint">Week 4</div>
                    <div className="font-mono text-[12px] font-bold text-ink">71%</div>
                  </div>
                </div>
              </div>
            </ChartCard>

            <ChartCard title="Activation funnel" description="Signup → first production call">
              <Funnel
                steps={[
                  { label: 'Visited', value: 24800 },
                  { label: 'Signed up', value: 6120, tone: 'brand' },
                  { label: 'Created key', value: 3480, tone: 'pink' },
                  { label: 'First call', value: 2140, tone: 'amber' },
                  { label: 'Deployed', value: 890, tone: 'success' },
                ]}
              />
            </ChartCard>

            <ChartCard title="Error heatmap" description="Hour × day · 5xx rate">
              <Heatmap
                labels
                rows={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
                columns={['00', '04', '08', '12', '16', '20']}
                values={[
                  [1, 2, 6, 14, 9, 3],
                  [0, 1, 4, 11, 7, 2],
                  [2, 3, 8, 22, 12, 4],
                  [1, 2, 5, 9, 6, 2],
                  [3, 4, 12, 28, 16, 6],
                ]}
              />
              <p className="mt-2 text-[9.5px] text-faint">Thu 12:00 spikes with the EU batch window.</p>
            </ChartCard>

            <ChartCard title="Cost vs latency" description="One point per model">
              <Scatter
                height={150}
                axisLabels={['latency →', 'cost →']}
                points={[
                  { x: 22, y: 70, tone: 'success', label: 'Gemini Flash' },
                  { x: 38, y: 58, tone: 'brand', label: 'GPT-4o mini' },
                  { x: 54, y: 44, tone: 'pink', label: 'Claude 3.5' },
                  { x: 71, y: 32, tone: 'amber', label: 'GPT-4o' },
                  { x: 84, y: 22, tone: 'violet', label: 'o1' },
                ]}
              />
              <div className="mt-2">
                <StackedBar
                  segments={[
                    { label: 'input', value: 58, tone: 'brand' },
                    { label: 'output', value: 27, tone: 'pink' },
                    { label: 'cached', value: 15, tone: 'muted' },
                  ]}
                />
              </div>
            </ChartCard>
          </div>
        </Section>
      )}

      {show('Display') && (
        <Section id="data" index="12" title="Data display" description="Tables, timelines, diffs and raw payloads">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Requests" value="1.28M" delta="+12.4%" data={[8, 12, 10, 16, 15, 21, 24]} icon={<TrendingUp className="h-3.5 w-3.5" />} footer="vs previous 7 days" />
            <StatCard label="Tokens" value="48.2M" delta="+8.1%" tone="pink" data={[12, 15, 14, 19, 22, 20, 27]} footer="input + output" />
            <StatCard label="Latency p95" value="412ms" delta="-6.3%" trend="down" tone="amber" data={[30, 26, 28, 22, 24, 19, 17]} footer="streaming excluded" />
            <StatCard label="Error rate" value="0.42%" delta="flat" trend="flat" tone="success" data={[4, 4, 5, 4, 4, 3, 4]} footer="5xx across all models" />
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-line bg-surface">
            <TableToolbar
              search=""
              placeholder="Search eval runs…"
              count={<span className="font-mono text-[10px] text-faint">128 runs</span>}
              filters={
                <>
                  <Button size="xs" variant="secondary" iconLeft={<Filter className="h-3 w-3" />}>Model</Button>
                  <Button size="xs" variant="secondary" iconLeft={<Filter className="h-3 w-3" />}>Status</Button>
                </>
              }
              actions={<Button size="xs" variant="secondary" iconLeft={<Download className="h-3 w-3" />}>Export</Button>}
            />
            <Table>
              <TableHead>
                <tr>
                  <Th>Run</Th>
                  <Th>Model</Th>
                  <Th sortable active direction="desc" align="right">Pass rate</Th>
                  <Th align="right">Tokens</Th>
                  <Th align="right">Duration</Th>
                </tr>
              </TableHead>
              <tbody>
                {[
                  { id: 'run_8421', model: 'gpt-4o', pass: 94, tokens: '1.2M', duration: '4m 12s' },
                  { id: 'run_8420', model: 'claude-3.5', pass: 88, tokens: '980K', duration: '3m 48s' },
                  { id: 'run_8419', model: 'gpt-4o-mini', pass: 71, tokens: '640K', duration: '2m 02s' },
                  { id: 'run_8418', model: 'gemini-1.5', pass: 63, tokens: '512K', duration: '1m 44s' },
                ].map(row => (
                  <Tr key={row.id}>
                    <Td mono className="text-ink">{row.id}</Td>
                    <Td>{row.model}</Td>
                    <Td align="right">
                      <span className="inline-flex items-center gap-2">
                        <span className="font-mono text-[10.5px] text-ink">{row.pass}%</span>
                        <DataBar value={row.pass} tone={row.pass > 85 ? 'success' : row.pass > 70 ? 'brand' : 'amber'} />
                      </span>
                    </Td>
                    <Td align="right" mono>{row.tokens}</Td>
                    <Td align="right" mono>{row.duration}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
            <Pagination page={page} pages={12} onChange={setPage} total="1–4 of 128 runs" />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <SurfacePanel label="Timeline">
              <Timeline
                items={[
                  { id: '1', title: 'Deployed v2.4', description: 'Canary 10% → 100% in 18 minutes.', time: '12:04', tone: 'success' },
                  { id: '2', title: 'Eval passed', description: '94% on golden set 12.', time: '11:41', tone: 'brand' },
                  { id: '3', title: 'Guardrail flagged', description: '2 prompts blocked for injection.', time: '10:22', tone: 'warning' },
                  { id: '4', title: 'Run failed', description: 'Upstream 529 after 3 retries.', time: '09:08', tone: 'danger' },
                ]}
              />
            </SurfacePanel>
            <SurfacePanel label="Key / value">
              <KeyValue
                columns={1}
                items={[
                  { label: 'Model', value: 'gpt-4o-prod', mono: true },
                  { label: 'Region', value: 'us-east-1', mono: true },
                  { label: 'Context', value: '128,000 tokens', mono: true },
                  { label: 'Owner', value: 'Platform team' },
                  { label: 'Updated', value: '2h ago', mono: true },
                ]}
              />
            </SurfacePanel>
            <SurfacePanel label="Tree">
              <TreeView
                items={[
                  {
                    id: 'root',
                    label: 'prompts',
                    kind: 'folder',
                    meta: '6',
                    children: [
                      { id: 'a', label: 'support-copilot.md', kind: 'file', meta: 'v3' },
                      { id: 'b', label: 'summarizer.md', kind: 'file', meta: 'v1' },
                      {
                        id: 'c',
                        label: 'evals',
                        kind: 'folder',
                        children: [
                          { id: 'd', label: 'adversarial.jsonl', kind: 'file', meta: '240' },
                          { id: 'e', label: 'golden.jsonl', kind: 'file', meta: '1.2K' },
                        ],
                      },
                    ],
                  },
                ]}
              />
            </SurfacePanel>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <SurfacePanel label="Accordion">
              <Accordion
                items={[
                  { id: 'a', title: 'What counts as a token?', meta: '1 of 4', content: 'Text is split by the tokenizer; images are billed by tile and audio by second. Cached input reads cost 75% less.' },
                  { id: 'b', title: 'How is pass rate computed?', content: 'A run passes when every rubric criterion scores at or above its threshold and no guardrail fires.' },
                  { id: 'c', title: 'Can I pin a model version?', content: 'Yes — append the version tag to the model id, e.g. gpt-4o-prod@2.4.0.' },
                ]}
              />
            </SurfacePanel>
            <div className="space-y-3">
              <DiffView
                filename="prompt-v3.ts"
                removed={['You are a helpful assistant.', 'Answer in under 120 words.']}
                added={['You are a support assistant for Unseen.', 'Answer in under 80 words and cite the docs.', 'Never promise refunds above $200.']}
              />
              <JsonView
                className="max-h-[168px]"
                data={{ id: 'run_8421', model: 'gpt-4o', usage: { input: 842, output: 214 }, finish: 'stop' }}
              />
            </div>
          </div>

          <div className="mt-4">
            <LogViewer
              lines={[
                { level: 'info', time: '12:04:11', message: 'POST /v1/chat/completions 200 · 412ms · 1,056 tokens' },
                { level: 'debug', time: '12:04:11', message: 'router: fallback model not needed' },
                { level: 'warn', time: '12:04:12', message: 'rate_limit: bucket at 82% · workspace ws_2f9' },
                { level: 'error', time: '12:04:19', message: 'upstream 529 from provider=anthropic · retry 1/3' },
                { level: 'info', time: '12:04:21', message: 'retry succeeded · provider=openai' },
              ]}
            />
          </div>
        </Section>
      )}

      {show('Navigation') && (
        <Section id="wayfinding" index="13" title="Navigation & menus" description="Orientation, steps and contextual actions">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-5">
              <div>
                <div className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Breadcrumbs</div>
                <Breadcrumbs items={[{ label: 'Workspace' }, { label: 'Models' }, { label: 'GPT-4o Production' }]} />
              </div>
              <div>
                <div className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Stepper</div>
                <Stepper
                  current={step}
                  onSelect={setStep}
                  steps={[
                    { label: 'Source', description: 'Connect a repo' },
                    { label: 'Configure', description: 'Prompt + params' },
                    { label: 'Evaluate', description: 'Golden set' },
                    { label: 'Deploy', description: 'Canary route' },
                  ]}
                />
              </div>
              <div>
                <div className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Segmented tabs</div>
                <SegmentedTabs
                  value={docsTab}
                  onChange={setDocsTab}
                  options={[
                    { value: 'overview', label: 'Overview' },
                    { value: 'api', label: 'API', count: 12 },
                    { value: 'usage', label: 'Usage', count: 3 },
                  ]}
                />
              </div>
              <div>
                <div className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Anchor nav</div>
                <AnchorNav active="params" items={[{ id: 'intro', label: 'Introduction' }, { id: 'params', label: 'Parameters' }, { id: 'errors', label: 'Error codes' }]} />
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <div className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">Section nav</div>
                <div className="rounded-xl border border-line bg-surface-2 p-2">
                  <NavList
                    value={navValue}
                    onChange={setNavValue}
                    items={[
                      { value: 'models', label: 'Models', count: 12, icon: <Grid2X2 className="h-3.5 w-3.5" /> },
                      { value: 'keys', label: 'API keys', count: 4, icon: <Lock className="h-3.5 w-3.5" /> },
                      { value: 'logs', label: 'Logs', icon: <Bell className="h-3.5 w-3.5" /> },
                      { value: 'usage', label: 'Usage', icon: <BarChart3 className="h-3.5 w-3.5" /> },
                    ]}
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <DropdownMenu
                  align="start"
                  trigger={<Button size="sm" variant="secondary" iconRight={<ChevronDown className="h-3.5 w-3.5" />}>Row actions</Button>}
                  items={[
                    { label: 'Rename', icon: <Settings className="h-3.5 w-3.5" />, shortcut: '⌘R' },
                    { label: 'Duplicate', icon: <Copy className="h-3.5 w-3.5" />, shortcut: '⌘D' },
                    { label: 'Export JSON', icon: <Download className="h-3.5 w-3.5" />, shortcut: '⌘E' },
                    { label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />, danger: true },
                  ]}
                />
                <Popover trigger={<Button size="sm" variant="outline" iconLeft={<Info className="h-3.5 w-3.5" />}>What is a token?</Button>}>
                  <div className="text-[11.5px] font-semibold text-ink">Tokens</div>
                  <p className="mt-1 text-[10.5px] leading-4 text-muted">
                    Roughly 4 characters of English. Input, cached input and output are billed at different rates.
                  </p>
                  <Button size="xs" variant="secondary" className="mt-2 w-full">Read pricing</Button>
                </Popover>
                <IconButton label="Notifications" variant="secondary"><Bell className="h-4 w-4" /></IconButton>
              </div>
              <Banner
                tone="pink"
                title="Canary deploy ready"
                description="v2.4 passed all evals. Route 10% of traffic to compare."
                action={<Button size="xs">Start canary</Button>}
              />
            </div>
          </div>
        </Section>
      )}

      {show('Forms') && (
        <Section id="advanced" index="14" title="Advanced inputs" description="The controls that need a little more thought">
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="space-y-4">
              <Combobox
                label="Model"
                placeholder="Search models…"
                options={[
                  { value: 'gpt-4o', label: 'GPT-4o', meta: 'openai · 128K' },
                  { value: 'claude', label: 'Claude 3.5 Sonnet', meta: 'anthropic · 200K' },
                  { value: 'gemini', label: 'Gemini 1.5 Pro', meta: 'google · 1M' },
                ]}
              />
              <TagInput initial={['production', 'streaming']} />
              <div>
                <div className="mb-1.5 text-[11px] font-semibold text-ink">Max tokens</div>
                <NumberStepper value={4096} min={256} max={8192} step={256} suffix="tok" />
              </div>
              <div>
                <div className="mb-1.5 text-[11px] font-semibold text-ink">Answer quality</div>
                <Rating value={4} showLabel />
              </div>
              <div>
                <div className="mb-1.5 text-[11px] font-semibold text-ink">Workspace name</div>
                <InlineEdit value="Unseen Labs" />
              </div>
            </div>

            <div className="space-y-4">
              <Calendar selected={21} />
              <div>
                <div className="mb-2 text-[11px] font-semibold text-ink">Deploy strategy</div>
                <OptionCards
                  columns={3}
                  value={deployMode}
                  onChange={setDeployMode}
                  options={[
                    { value: 'canary', label: 'Canary', description: '10% first' },
                    { value: 'blue', label: 'Blue / green', description: 'Instant switch' },
                    { value: 'shadow', label: 'Shadow', description: 'No live traffic' },
                  ]}
                />
              </div>
              <ColorSwatchRow label="brand" colors={['#0272C6', '#0E91F0', '#38AEFA', '#7DCBFC', '#C9E9FE']} />
              <ColorSwatchRow label="accent" colors={['#C0106A', '#F72685', '#FF56A0', '#FF9A33', '#FF7A0D']} />
            </div>

            <div className="space-y-4">
              <FileDrop />
              <Alert tone="brand" title="Uploading 3 files">
                Files are validated before ingestion. Invalid rows are reported, never silently dropped.
              </Alert>
              <div className="rounded-xl border border-line bg-surface p-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-faint">Field states</div>
                <div className="mt-2 space-y-2">
                  <Field label="Validated">
                    <Input valid defaultValue="dataset-golden-v3" />
                  </Field>
                  <Field label="Invalid" error="Must end in .jsonl">
                    <Input invalid defaultValue="dataset.csv" />
                  </Field>
                </div>
              </div>
            </div>
          </div>
        </Section>
      )}

      {show('Display') && (
        <Section id="ai-surfaces" index="15" title="AI surfaces" description="Patterns unique to model products">
          <div className="grid gap-4 lg:grid-cols-3">
            <PromptCard
              title="Support triage"
              description="Classifies tickets, drafts a reply and escalates anything about billing."
              model="gpt-4o"
              uses="12.4K"
              tags={['support', 'classify']}
            />
            <PromptCard
              title="Release notes"
              description="Turns merged PRs into customer-facing notes with a tone check."
              model="claude-3.5"
              uses="3.1K"
              tags={['writing', 'release']}
            />
            <PromptCard
              title="SQL explainer"
              description="Explains a query plan and suggests an index, with cost estimates."
              model="gpt-4o-mini"
              uses="842"
              tags={['data', 'internal']}
            />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
            <div className="space-y-3">
              <ChatMessage role="user" time="12:04">Summarise the latency regression.</ChatMessage>
              <ChatMessage role="assistant" time="12:04" streaming>
                p95 rose 38% after the router change on eu-central. The cause is cold connection pools on the new pod set — warm them before shifting traffic.
              </ChatMessage>
              <div className="grid gap-2 sm:grid-cols-2">
                <ToolCallCard name="search_logs" args='{ "window": "1h" }' result="12 matching spans" />
                <ToolCallCard name="fetch_metrics" args='{ "metric": "p95" }' status="pending" duration="—" />
                <div className="sm:col-span-2">
                  <ToolCallCard name="rollback" args='{ "target": "router@2.3" }' status="error" duration="timeout" />
                </div>
              </div>
              <GuardrailBanner />
            </div>

            <div className="space-y-3">
              <RunTrace
                steps={[
                  { id: '1', label: 'Plan the investigation', kind: 'llm', duration: '412ms', tokens: '842' },
                  { id: '2', label: 'search_logs', kind: 'tool', duration: '212ms' },
                  { id: '3', label: 'Policy check', kind: 'guard', duration: '12ms' },
                  { id: '4', label: 'Human approval', kind: 'human', duration: '2m 04s' },
                  { id: '5', label: 'Write summary', kind: 'llm', duration: '1.2s', tokens: '410', status: 'warn' },
                ]}
              />
              <TokenCounter
                tokens={18420}
                limit={32768}
                breakdown={[
                  { label: 'input', value: 42, tone: 'brand' },
                  { label: 'ctx', value: 21, tone: 'pink' },
                  { label: 'output', value: 13, tone: 'amber' },
                ]}
              />
              <ConfidenceMeter value={0.86} />
              <VoiceWave active duration="0:12" />
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr_240px]">
            <SurfacePanel label="Citations">
              <CitationList
                items={[
                  { index: 1, title: 'Routing changes in v2.4', source: 'docs', snippet: 'Canary deploys shift traffic in 10% increments.', score: 0.94 },
                  { index: 2, title: 'Warm connection pools', source: 'runbook', snippet: 'Pre-warm pods before the shift.', score: 0.81 },
                ]}
              />
            </SurfacePanel>
            <SurfacePanel label="Eval rubric">
              <EvalRubric
                criteria={[
                  { name: 'Groundedness', score: 9, max: 10, weight: '0.4', note: 'Every claim traces to a source.' },
                  { name: 'Tone', score: 7, max: 10, weight: '0.2' },
                  { name: 'Completeness', score: 8, max: 10, weight: '0.4' },
                ]}
              />
            </SurfacePanel>
            <ImageGenCard prompt="Editorial gradient poster, blue to pink, risograph grain" style="editorial" seed="4821" />
          </div>

          <div className="mt-4">
            <ModelCompareTable
              models={[
                { name: 'GPT-4o', provider: 'openai', best: true },
                { name: 'Claude 3.5', provider: 'anthropic' },
                { name: 'Gemini 1.5', provider: 'google' },
              ]}
              criteria={[
                { label: 'Context', values: ['128K', '200K', '1M'] },
                { label: 'Input / 1M', values: ['$2.50', '$3.00', '$1.25'] },
                { label: 'Output / 1M', values: ['$10.00', '$15.00', '$5.00'] },
                { label: 'Median latency', values: ['412ms', '486ms', '338ms'] },
                { label: 'Tool use', values: ['native', 'native', 'native'] },
              ]}
            />
          </div>
        </Section>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Deploy to production"
        description="This publishes the current prompt chain and notifies workspace admins."
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={() => setModalOpen(false)}>Deploy model</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Environment">
            <Select defaultValue="prod">
              <option value="prod">production · us-east-1</option>
              <option value="stage">staging · eu-central-1</option>
            </Select>
          </Field>
          <Alert tone="warning" title="3 downstream services depend on this model">
            Routing, billing and audit exports will switch to the new version within 60 seconds.
          </Alert>
          <Checkbox checked label="Notify workspace admins" />
        </div>
      </Modal>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Model settings"
        description="gpt-4o-prod · production"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={() => setDrawerOpen(false)}>Save changes</Button>
          </>
        }
      >
        <Field label="Max tokens">
          <Input defaultValue="4096" />
        </Field>
        <Field label="Temperature" hint="Lower is more deterministic.">
          <Slider value={temperature} onChange={setTemperature} />
        </Field>
        <Field label="System prompt">
          <Textarea defaultValue="You are a concise product assistant for Unseen workspaces." />
        </Field>
        <Switch checked label="Fallback model" description="Route to Claude 3.5 on 529 errors." onChange={() => undefined} />
      </Drawer>
    </div>
  );
}
