import { useState } from 'react';
import { ArrowUpRight, BookOpen, Check, Copy, KeyRound, Plus, Terminal, Webhook } from 'lucide-react';
import { PageHeader, Section, SurfacePanel } from '../components/layout/Page';
import { Button, IconButton } from '../components/ui/Button';
import { Badge, StatusDot } from '../components/ui/Badge';
import { CopyField, Input } from '../components/ui/Field';
import { Tabs } from '../components/ui/Tabs';
import { CodeBlock } from '../components/ui/AI';
import { JsonView, KeyValue, LogViewer, Table, TableHead, Td, Th, Tr } from '../components/ui/DataDisplay';
import { AnchorNav, Breadcrumbs } from '../components/ui/Navigation';
import { Progress } from '../components/ui/Feedback';
import { Sparkline } from '../components/ui/AI';

const endpoints = [
  { method: 'POST', path: '/v2/chat/completions', desc: 'Create a chat completion, streaming or buffered', scope: 'inference' },
  { method: 'GET', path: '/v2/models', desc: 'List deployments and their health', scope: 'read' },
  { method: 'POST', path: '/v2/models', desc: 'Provision a model from a base provider', scope: 'admin' },
  { method: 'POST', path: '/v2/embeddings', desc: 'Embed up to 2,048 inputs per request', scope: 'inference' },
  { method: 'GET', path: '/v2/usage', desc: 'Aggregate token and request usage', scope: 'read' },
  { method: 'DELETE', path: '/v2/keys/{id}', desc: 'Revoke an API key immediately', scope: 'admin' },
];

const params = [
  { name: 'model', type: 'string', required: true, desc: 'Deployment id, e.g. gpt-4o-prod' },
  { name: 'messages', type: 'Message[]', required: true, desc: 'Ordered conversation, system first' },
  { name: 'stream', type: 'boolean', required: false, desc: 'Server-sent events; default false' },
  { name: 'temperature', type: 'number', required: false, desc: '0–2, defaults to 0.3 for deployed models' },
  { name: 'max_tokens', type: 'integer', required: false, desc: 'Upper bound on completion tokens' },
  { name: 'tools', type: 'Tool[]', required: false, desc: 'Function schemas the model may call' },
];

const snippets: Record<string, { lang: string; code: string }> = {
  curl: {
    lang: 'bash',
    code: `curl https://api.unseen.ai/v2/chat/completions \\
  -H "Authorization: Bearer $UNSEEN_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o-prod",
    "messages": [{ "role": "user", "content": "Why did p95 rise?" }],
    "stream": true
  }'`,
  },
  ts: {
    lang: 'ts',
    code: `import { Unseen } from '@unseen/sdk';

const client = new Unseen({ apiKey: process.env.UNSEEN_KEY });

const stream = await client.chat.completions.create({
  model: 'gpt-4o-prod',
  messages: [{ role: 'user', content: 'Why did p95 rise?' }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? '');
}`,
  },
  python: {
    lang: 'python',
    code: `from unseen import Unseen

client = Unseen(api_key=os.environ["UNSEEN_KEY"])

stream = client.chat.completions.create(
    model="gpt-4o-prod",
    messages=[{"role": "user", "content": "Why did p95 rise?"}],
    stream=True,
)

for chunk in stream:
    print(chunk.choices[0].delta.content or "", end="")`,
  },
  go: {
    lang: 'go',
    code: `client := unseen.New(os.Getenv("UNSEEN_KEY"))

stream, err := client.Chat.Completions.Create(ctx, &unseen.ChatRequest{
    Model:    "gpt-4o-prod",
    Messages: []unseen.Message{{Role: "user", Content: "Why did p95 rise?"}},
    Stream:   true,
})
if err != nil {
    log.Fatal(err)
}`,
  },
};

const logs = [
  { level: 'info' as const, time: '07:02:04', message: 'POST /v2/chat/completions 200 · 412ms · 812 tok' },
  { level: 'debug' as const, time: '07:02:04', message: 'router: us-east-1 pool · weighted 90/10' },
  { level: 'warn' as const, time: '07:02:11', message: 'rate limit 82% consumed on key sk-live-9f82' },
  { level: 'error' as const, time: '07:03:22', message: 'upstream 529 from eu-central-1, retry 1/3' },
  { level: 'info' as const, time: '07:03:24', message: 'fallback claude-3-5-sonnet 200 · 508ms' },
];

export function DevelopersPage() {
  const [snippet, setSnippet] = useState<'curl' | 'ts' | 'python' | 'go'>('ts');
  const [method, setMethod] = useState<'all' | 'GET' | 'POST' | 'DELETE'>('all');
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Product screen · developers"
        title="API reference"
        description="A docs surface built from the same primitives as the product: endpoint tables, parameter lists, copyable snippets and live logs."
        meta={
          <>
            <Badge tone="neutral" variant="outline">v2 API</Badge>
            <Badge tone="success" variant="soft"><StatusDot tone="success" /> 99.98% uptime</Badge>
            <Badge tone="neutral" variant="outline">SDKs: TS · Python · Go</Badge>
          </>
        }
        actions={
          <>
            <Button variant="secondary" iconLeft={<BookOpen className="h-4 w-4" />}>Guides</Button>
            <Button iconLeft={<KeyRound className="h-4 w-4" />}>Create key</Button>
          </>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[176px_1fr]">
        <aside className="hidden xl:block">
          <div className="sticky top-20">
            <div className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.14em] text-faint">On this page</div>
            <AnchorNav
              active="auth"
              items={[
                { id: 'auth', label: 'Authentication' },
                { id: 'endpoints', label: 'Endpoints' },
                { id: 'parameters', label: 'Parameters' },
                { id: 'response', label: 'Responses' },
                { id: 'errors', label: 'Errors & limits' },
                { id: 'webhooks', label: 'Webhooks' },
                { id: 'logs', label: 'Request logs' },
              ]}
            />
          </div>
        </aside>

        <div className="min-w-0 space-y-5">
          <Section id="auth" index="01" title="Authentication" description="Bearer tokens, scoped per environment">
            <Breadcrumbs className="mb-3" items={[{ label: 'Docs' }, { label: 'API' }, { label: 'Authentication' }]} />
            <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
              <div className="space-y-3">
                <CopyField label="Base URL" value="https://api.unseen.ai/v2" />
                <CopyField label="Test key" value="sk-test-71aa9c04f8b2c93e" masked />
                <CopyField label="Live key" value="sk-live-9f82b41c7de04a6f" masked />
                <div className="flex items-start gap-2 rounded-lg bg-warning-soft px-3 py-2 text-[10px] leading-4 text-warning">
                  <Terminal className="mt-0.5 h-3 w-3 shrink-0" />
                  Never ship a live key in a browser bundle. Proxy requests from your server, or use short-lived tokens.
                </div>
              </div>
              <div className="rounded-lg border border-line bg-surface-2 p-3">
                <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-faint">Header</div>
                <CodeBlock title="http" language="bash" code={'Authorization: Bearer $UNSEEN_KEY\nContent-Type: application/json\nX-Unseen-Version: 2026-10-01'} />
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted">
                  <Check className="h-3 w-3 text-success" strokeWidth={3} /> Keys are hashed at rest, shown once.
                </div>
              </div>
            </div>
          </Section>

          <Section
            id="endpoints"
            index="02"
            title="Endpoints"
            description="6 of 24 shown"
            flush
            aside={
              <div className="flex items-center gap-1">
                {(['all', 'GET', 'POST', 'DELETE'] as const).map(item => (
                  <button
                    key={item}
                    onClick={() => setMethod(item)}
                    className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold transition ${
                      method === item ? 'bg-inverse text-on-inverse' : 'text-muted hover:text-ink'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            }
          >
            <Table>
              <TableHead>
                <tr>
                  <Th className="w-16">Method</Th>
                  <Th>Path</Th>
                  <Th>Description</Th>
                  <Th align="right">Scope</Th>
                </tr>
              </TableHead>
              <tbody>
                {endpoints.filter(e => method === 'all' || e.method === method).map(endpoint => (
                  <Tr key={endpoint.path}>
                    <Td>
                      <span
                        className={`inline-flex rounded-sm px-1.5 py-0.5 font-mono text-[9px] font-bold ${
                          endpoint.method === 'GET'
                            ? 'bg-brand-soft text-brand-strong dark:text-brand'
                            : endpoint.method === 'POST'
                              ? 'bg-success-soft text-success'
                              : 'bg-danger-soft text-danger'
                        }`}
                      >
                        {endpoint.method}
                      </span>
                    </Td>
                    <Td mono className="text-ink">{endpoint.path}</Td>
                    <Td>{endpoint.desc}</Td>
                    <Td align="right"><Badge tone="neutral" variant="outline">{endpoint.scope}</Badge></Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </Section>

          <Section
            id="parameters"
            index="03"
            title="Request parameters"
            description="POST /v2/chat/completions"
            aside={
              <div className="flex items-center gap-1">
                {(['curl', 'ts', 'python', 'go'] as const).map(item => (
                  <button
                    key={item}
                    onClick={() => setSnippet(item)}
                    className={`rounded-md px-2 py-0.5 font-mono text-[9.5px] font-semibold transition ${
                      snippet === item ? 'bg-surface-3 text-ink' : 'text-faint hover:text-ink'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            }
          >
            <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
              <div className="overflow-hidden rounded-lg border border-line">
                <table className="w-full text-left">
                  <thead className="bg-surface-2 text-[9px] font-bold uppercase tracking-[0.1em] text-faint">
                    <tr>
                      <th className="px-2.5 py-2">Field</th>
                      <th className="px-2.5 py-2">Type</th>
                      <th className="px-2.5 py-2">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {params.map(param => (
                      <tr key={param.name} className="transition hover:bg-surface-2">
                        <td className="px-2.5 py-2">
                          <span className="font-mono text-[10px] font-semibold text-ink">{param.name}</span>
                          {param.required && <span className="ml-1 text-[9px] text-pink">*</span>}
                        </td>
                        <td className="px-2.5 py-2 font-mono text-[9.5px] text-brand">{param.type}</td>
                        <td className="px-2.5 py-2 text-[10px] leading-4 text-muted">{param.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <CodeBlock title={`snippet.${snippet}`} language={snippets[snippet].lang} code={snippets[snippet].code} />
            </div>
          </Section>

          <div className="grid gap-4 lg:grid-cols-2">
            <Section
              id="response"
              index="04"
              title="Response"
              description="200 · application/json"
              aside={
                <Button
                  size="xs"
                  variant="ghost"
                  iconLeft={copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                  onClick={() => {
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 1500);
                  }}
                >
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              }
            >
              <JsonView
                data={{
                  id: 'cmpl_9f82b41c',
                  model: 'gpt-4o-prod',
                  choices: [{ index: 0, message: { role: 'assistant', content: 'Latency rose 14% after the router change.' }, finish_reason: 'stop' }],
                  usage: { prompt_tokens: 412, completion_tokens: 400, total_tokens: 812, cached_tokens: 128 },
                  routing: { region: 'us-east-1', fallback_used: false },
                }}
              />
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[
                  { label: 'p95', value: '412ms' },
                  { label: 'tokens', value: '812' },
                  { label: 'cost', value: '$0.0042' },
                ].map(item => (
                  <div key={item.label} className="rounded-md bg-surface-2 px-2 py-1.5 text-center">
                    <div className="text-[8.5px] uppercase tracking-wider text-faint">{item.label}</div>
                    <div className="font-mono text-[10.5px] font-semibold text-ink">{item.value}</div>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="errors" index="05" title="Errors & limits" description="Predictable failure modes">
              <div className="space-y-2">
                {[
                  { code: '400', name: 'invalid_request', desc: 'Malformed JSON or missing required field', tone: 'warning' as const },
                  { code: '401', name: 'invalid_api_key', desc: 'Key revoked, expired or wrong environment', tone: 'warning' as const },
                  { code: '429', name: 'rate_limited', desc: 'Retry after the Retry-After header', tone: 'danger' as const },
                  { code: '503', name: 'provider_unavailable', desc: 'Upstream 5xx; fallback attempted automatically', tone: 'danger' as const },
                ].map(error => (
                  <div key={error.code} className="flex items-start gap-2.5 rounded-lg border border-line bg-surface-2 p-2.5">
                    <span className={`rounded-sm px-1.5 py-0.5 font-mono text-[9px] font-bold ${error.tone === 'danger' ? 'bg-danger-soft text-danger' : 'bg-warning-soft text-warning'}`}>
                      {error.code}
                    </span>
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] font-semibold text-ink">{error.name}</div>
                      <div className="text-[9.5px] leading-4 text-muted">{error.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 space-y-2 border-t border-line pt-3">
                <div className="flex items-center justify-between text-[10.5px]">
                  <span className="text-muted">Requests this month</span>
                  <span className="font-mono text-ink">1.64M / 2M</span>
                </div>
                <Progress value={82} tone="pink" size="sm" />
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <KeyValue columns={1} items={[{ label: 'RPM limit', value: '1,200', mono: true }]} />
                  <KeyValue columns={1} items={[{ label: 'TPM limit', value: '180K', mono: true }]} />
                </div>
              </div>
            </Section>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
            <Section id="webhooks" index="06" title="Webhooks" description="Signed with whsec, retried 5×">
              <div className="space-y-2">
                {[
                  { event: 'response.completed', url: 'api.unseen.ai/hooks/usage', ok: true },
                  { event: 'run.failed', url: 'api.unseen.ai/hooks/alerts', ok: true },
                  { event: 'key.rotated', url: 'hooks.slack.com/services/T04', ok: false },
                ].map(hook => (
                  <div key={hook.event} className="flex items-center gap-2 rounded-lg border border-line bg-surface-2 px-2.5 py-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${hook.ok ? 'bg-success' : 'bg-warning'}`} />
                    <span className="font-mono text-[10px] text-ink-soft">{hook.event}</span>
                    <span className="ml-auto max-w-[130px] truncate font-mono text-[9px] text-faint">{hook.url}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <CopyField label="Signing secret" value="whsec_8f21c4b2a9de40c1" masked />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Button size="xs" variant="secondary" iconLeft={<Webhook className="h-3 w-3" />}>Send test event</Button>
                <Button size="xs" variant="ghost" iconLeft={<Plus className="h-3 w-3" />}>Add endpoint</Button>
              </div>
            </Section>

            <Section id="logs" index="07" title="Request logs" description="Live tail · last 5 events" aside={<Badge tone="success" variant="soft"><StatusDot tone="success" pulse /> streaming</Badge>}>
              <LogViewer lines={logs} />
              <div className="mt-2 grid grid-cols-3 gap-2">
                <SurfacePanel label="p95"><span className="font-mono text-[13px] font-bold text-ink">412ms</span></SurfacePanel>
                <SurfacePanel label="Errors"><span className="font-mono text-[13px] font-bold text-ink">0.4%</span></SurfacePanel>
                <SurfacePanel label="Traffic"><span className="inline-block w-full"><Sparkline data={[18, 22, 20, 26, 24, 30, 28, 34]} height={16} /></span></SurfacePanel>
              </div>
            </Section>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface-2 px-4 py-3">
            <div className="flex items-center gap-2 text-[10.5px] text-muted">
              <Terminal className="h-3.5 w-3.5 text-brand" /> Try requests in the playground before shipping them.
            </div>
            <div className="flex items-center gap-2">
              <Button size="xs" variant="secondary">Open playground</Button>
              <Button size="xs" variant="ghost" iconRight={<ArrowUpRight className="h-3 w-3" />}>SDK changelog</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
