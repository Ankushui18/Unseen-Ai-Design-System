import { useState } from 'react';
import { Check, CheckCircle2, Clock, Mail, MoreHorizontal, Shield, UserPlus, Users, X } from 'lucide-react';
import { PageHeader, Section, SurfacePanel } from '../components/layout/Page';
import { Button, IconButton } from '../components/ui/Button';
import { Badge, StatusDot } from '../components/ui/Badge';
import { Avatar, AvatarStack } from '../components/ui/Avatar';
import { Field, Input, Select } from '../components/ui/Field';
import { Modal, Tooltip } from '../components/ui/Overlay';
import { Checkbox } from '../components/ui/Controls';
import { KeyValue, StatCard, Table, TableHead, TableToolbar, Td, Th, Tr, Timeline } from '../components/ui/DataDisplay';
import { DropdownMenu, SegmentedTabs } from '../components/ui/Navigation';
import { Donut, Legend } from '../components/ui/Charts';
import { CopyField } from '../components/ui/Field';
import { cn } from '@/lib/utils';

type Role = 'owner' | 'admin' | 'editor' | 'viewer';

const members: {
  id: string;
  name: string;
  email: string;
  role: Role;
  initials: string;
  tone: 'pink' | 'blue' | 'amber' | 'mint' | 'violet';
  status: 'active' | 'invited' | 'suspended';
  lastSeen: string;
  mfa: boolean;
}[] = [
  { id: 'm1', name: 'Rania Khan', email: 'rania@unseen.ai', role: 'owner', initials: 'RK', tone: 'pink', status: 'active', lastSeen: 'now', mfa: true },
  { id: 'm2', name: 'Marcus Ng', email: 'marcus@unseen.ai', role: 'admin', initials: 'MN', tone: 'blue', status: 'active', lastSeen: '12m', mfa: true },
  { id: 'm3', name: 'Sara Chen', email: 'sara@unseen.ai', role: 'editor', initials: 'SC', tone: 'mint', status: 'active', lastSeen: '1h', mfa: false },
  { id: 'm4', name: 'Jules Laurent', email: 'jules@unseen.ai', role: 'editor', initials: 'JL', tone: 'amber', status: 'active', lastSeen: '3h', mfa: true },
  { id: 'm5', name: 'Priya Lal', email: 'priya@unseen.ai', role: 'viewer', initials: 'PL', tone: 'violet', status: 'invited', lastSeen: '—', mfa: false },
  { id: 'm6', name: 'Tom Weber', email: 'tom@unseen.ai', role: 'viewer', initials: 'TW', tone: 'blue', status: 'suspended', lastSeen: '21d', mfa: false },
];

const permissions: { group: string; items: { label: string; owner: boolean; admin: boolean; editor: boolean; viewer: boolean }[] }[] = [
  {
    group: 'Workspace',
    items: [
      { label: 'View dashboard & usage', owner: true, admin: true, editor: true, viewer: true },
      { label: 'Edit workspace settings', owner: true, admin: true, editor: false, viewer: false },
      { label: 'Delete workspace', owner: true, admin: false, editor: false, viewer: false },
    ],
  },
  {
    group: 'Models & prompts',
    items: [
      { label: 'Run playground', owner: true, admin: true, editor: true, viewer: true },
      { label: 'Create & deploy models', owner: true, admin: true, editor: true, viewer: false },
      { label: 'Delete a model', owner: true, admin: true, editor: false, viewer: false },
    ],
  },
  {
    group: 'Security',
    items: [
      { label: 'Manage API keys', owner: true, admin: true, editor: false, viewer: false },
      { label: 'Invite members', owner: true, admin: true, editor: false, viewer: false },
      { label: 'Change billing', owner: true, admin: false, editor: false, viewer: false },
    ],
  },
];

const audit = [
  { id: 'a1', title: 'Marcus Ng rotated an API key', time: '12m ago', description: 'sk-live-4c11 replaced · production server', tone: 'brand' as const, icon: <Shield className="h-3 w-3" /> },
  { id: 'a2', title: 'Sara Chen deployed gpt-4o-prod v2.4', time: '2h ago', description: 'Canary 10% → 100% after 30m', tone: 'success' as const, icon: <CheckCircle2 className="h-3 w-3" /> },
  { id: 'a3', title: 'Invite sent to priya@unseen.ai', time: '5h ago', description: 'Role: viewer · expires in 7 days', tone: 'warning' as const, icon: <Mail className="h-3 w-3" /> },
  { id: 'a4', title: 'Tom Weber suspended', time: '3d ago', description: 'By Rania Khan · offboarding', tone: 'danger' as const, icon: <X className="h-3 w-3" /> },
];

export function TeamPage() {
  const [tab, setTab] = useState<'members' | 'roles' | 'audit'>('members');
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | Role>('all');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invites, setInvites] = useState<string[]>([]);

  const visible = members.filter(
    m => (roleFilter === 'all' || m.role === roleFilter) && `${m.name} ${m.email}`.toLowerCase().includes(query.toLowerCase()),
  );

  const roleTone: Record<Role, 'pink' | 'brand' | 'neutral' | 'violet'> = { owner: 'pink', admin: 'brand', editor: 'violet', viewer: 'neutral' };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Product screen · people"
        title="Team & access"
        description="Members, role-based access and an immutable audit log. The RBAC matrix is generated from the same role tokens the API enforces."
        meta={
          <>
            <Badge tone="brand" variant="soft"><Users className="h-3 w-3" /> 25 seats</Badge>
            <Badge tone="success" variant="soft"><StatusDot tone="success" /> SSO enforced</Badge>
            <Badge tone="neutral" variant="outline">4 roles</Badge>
          </>
        }
        actions={
          <>
            <Button variant="secondary" iconLeft={<Shield className="h-4 w-4" />}>Security settings</Button>
            <Button iconLeft={<UserPlus className="h-4 w-4" />} onClick={() => setInviteOpen(true)}>Invite people</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Active members" value="23" delta="+2" tone="brand" icon={<Users className="h-3.5 w-3.5" />} footer="2 pending invites" />
        <StatCard label="MFA coverage" value="87%" delta="+6%" data={[60, 64, 68, 72, 76, 80, 84, 87]} tone="success" icon={<Shield className="h-3.5 w-3.5" />} footer="target 100%" />
        <StatCard label="Seats used" value="23 / 25" delta="92%" tone="amber" footer="upgrade for more" />
        <StatCard label="Last audit event" value="12m" delta="rotated key" data={[10, 14, 12, 18, 16, 22, 20, 26]} tone="pink" icon={<Clock className="h-3.5 w-3.5" />} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Section
          index="01"
          title="Members"
          description={`${members.length} people · 4 roles`}
          flush
          aside={
            <SegmentedTabs
              value={tab}
              onChange={setTab}
              options={[
                { value: 'members', label: 'Members' },
                { value: 'roles', label: 'Roles' },
                { value: 'audit', label: 'Audit' },
              ]}
            />
          }
        >
          {tab === 'members' && (
            <>
              <TableToolbar
                search={query}
                onSearch={setQuery}
                placeholder="Search name or email…"
                count={`${visible.length} shown`}
                filters={
                  <div className="flex items-center gap-1">
                    {(['all', 'owner', 'admin', 'editor', 'viewer'] as const).map(role => (
                      <button
                        key={role}
                        onClick={() => setRoleFilter(role)}
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[9.5px] font-semibold capitalize transition',
                          roleFilter === role ? 'bg-inverse text-on-inverse' : 'text-muted hover:text-ink',
                        )}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                }
                actions={<Button size="xs" variant="ghost" iconLeft={<UserPlus className="h-3 w-3" />} onClick={() => setInviteOpen(true)}>Invite</Button>}
              />
              <Table>
                <TableHead>
                  <tr>
                    <Th>Member</Th>
                    <Th>Role</Th>
                    <Th>Status</Th>
                    <Th>MFA</Th>
                    <Th align="right">Last seen</Th>
                    <Th />
                  </tr>
                </TableHead>
                <tbody>
                  {visible.map(member => (
                    <Tr key={member.id}>
                      <Td>
                        <div className="flex items-center gap-2.5">
                          <Avatar initials={member.initials} tone={member.tone} size="sm" status={member.status === 'active' ? 'online' : member.status === 'invited' ? 'away' : 'offline'} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 font-semibold text-ink">
                              {member.name}
                              {member.role === 'owner' && <Badge tone="pink" variant="soft">you</Badge>}
                            </div>
                            <div className="font-mono text-[9px] text-faint">{member.email}</div>
                          </div>
                        </div>
                      </Td>
                      <Td><Badge tone={roleTone[member.role]} variant="soft">{member.role}</Badge></Td>
                      <Td>
                        <span className="inline-flex items-center gap-1.5 text-[10.5px] text-muted">
                          <StatusDot tone={member.status === 'active' ? 'success' : member.status === 'invited' ? 'warning' : 'neutral'} />
                          {member.status}
                        </span>
                      </Td>
                      <Td>{member.mfa ? <Check className="h-3.5 w-3.5 text-success" strokeWidth={3} /> : <span className="text-[10px] text-warning">off</span>}</Td>
                      <Td align="right" mono>{member.lastSeen}</Td>
                      <Td align="right">
                        <DropdownMenu
                          trigger={<IconButton label={`Actions for ${member.name}`} size="xs" variant="ghost"><MoreHorizontal className="h-3 w-3" /></IconButton>}
                          align="end"
                          items={[
                            { label: 'Change role', icon: <Shield className="h-3 w-3" /> },
                            { label: 'Resend invite', icon: <Mail className="h-3 w-3" /> },
                            { label: 'Reset MFA', icon: <Shield className="h-3 w-3" /> },
                            { label: 'Suspend access', icon: <X className="h-3 w-3" />, danger: true },
                          ]}
                        />
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}

          {tab === 'roles' && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left">
                <thead className="bg-surface-2 text-[9px] font-bold uppercase tracking-[0.1em] text-faint">
                  <tr>
                    <th className="px-3 py-2.5">Capability</th>
                    {(['owner', 'admin', 'editor', 'viewer'] as const).map(role => (
                      <th key={role} className="px-2 py-2.5 text-center capitalize">{role}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {permissions.map(group => (
                    <>
                      <tr key={group.group} className="border-t border-line bg-surface-2/50">
                        <td colSpan={5} className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-faint">{group.group}</td>
                      </tr>
                      {group.items.map(item => (
                        <tr key={item.label} className="border-t border-line transition hover:bg-surface-2">
                          <td className="px-3 py-2 text-[10.5px] text-ink-soft">{item.label}</td>
                          {([item.owner, item.admin, item.editor, item.viewer] as boolean[]).map((allowed, i) => (
                            <td key={i} className="px-2 py-2 text-center">
                              {allowed ? (
                                <span className="inline-grid h-4 w-4 place-items-center rounded-full bg-success-soft text-success">
                                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                                </span>
                              ) : (
                                <span className="inline-grid h-4 w-4 place-items-center rounded-full bg-surface-3 text-faint">
                                  <X className="h-2.5 w-2.5" />
                                </span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-surface-2/60 px-3 py-2">
                <span className="text-[9.5px] text-faint">Roles are enforced by the API — the UI mirrors the policy exactly.</span>
                <Button size="xs" variant="ghost">Custom role</Button>
              </div>
            </div>
          )}

          {tab === 'audit' && (
            <div className="p-4">
              <Timeline items={audit} />
              <div className="mt-3 flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2 text-[10px] text-muted">
                <span>Immutable · retained 12 months</span>
                <Button size="xs" variant="ghost">Export log</Button>
              </div>
            </div>
          )}
        </Section>

        <div className="space-y-4">
          <Section index="02" title="Composition" description="By role">
            <div className="flex flex-wrap items-center gap-4">
              <Donut
                size={116}
                thickness={13}
                centerValue="23"
                centerLabel="people"
                segments={[
                  { label: 'Editor', value: 11, tone: 'violet' },
                  { label: 'Viewer', value: 7, tone: 'muted' },
                  { label: 'Admin', value: 4, tone: 'brand' },
                  { label: 'Owner', value: 1, tone: 'pink' },
                ]}
              />
              <div className="flex-1">
                <Legend
                  items={[
                    { label: 'Editor', tone: 'violet', value: '11' },
                    { label: 'Viewer', tone: 'muted', value: '7' },
                    { label: 'Admin', tone: 'brand', value: '4' },
                    { label: 'Owner', tone: 'pink', value: '1' },
                  ]}
                />
              </div>
            </div>
            <div className="mt-3 border-t border-line pt-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-faint">Seats</span>
                <span className="font-mono text-[9.5px] text-muted">23 / 25</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
                <div className="h-full rounded-full bg-[linear-gradient(90deg,#38AEFA,#F72685)]" style={{ width: '92%' }} />
              </div>
            </div>
          </Section>

          <Section index="03" title="Pending invites" description={`${invites.length + 2} awaiting acceptance`}>
            <div className="space-y-2">
              {[
                { email: 'priya@unseen.ai', role: 'Viewer', sent: '5h ago' },
                { email: 'dev@partner.io', role: 'Editor', sent: '1d ago' },
                ...invites.map(email => ({ email, role: 'Viewer', sent: 'just now' })),
              ].map(invite => (
                <div key={invite.email} className="flex items-center gap-2 rounded-lg border border-line bg-surface-2 px-2.5 py-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-surface text-faint">
                    <Mail className="h-3 w-3" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-mono text-[10px] text-ink-soft">{invite.email}</div>
                    <div className="text-[9px] text-faint">{invite.role} · sent {invite.sent}</div>
                  </div>
                  <Tooltip content="Revoke invite" side="left">
                    <IconButton label={`Revoke invite for ${invite.email}`} size="xs" variant="ghost"><X className="h-3 w-3" /></IconButton>
                  </Tooltip>
                </div>
              ))}
            </div>
            <CopyField label="Invite link" value="https://app.unseen.ai/join/8f21c4b2" />
            <Button size="sm" className="mt-2 w-full" iconLeft={<UserPlus className="h-3.5 w-3.5" />} onClick={() => setInviteOpen(true)}>
              Invite more people
            </Button>
          </Section>

          <SurfacePanel label="Security posture">
            <KeyValue
              columns={1}
              items={[
                { label: 'SSO', value: <Badge tone="success" variant="soft">enforced</Badge> },
                { label: 'SCIM provisioning', value: <Badge tone="success" variant="soft">on</Badge> },
                { label: 'Session timeout', value: '8h', mono: true },
                { label: 'IP allowlist', value: '3 ranges', mono: true },
              ]}
            />
            <div className="mt-2 flex items-center gap-2">
              <AvatarStack
                size="xs"
                people={members.slice(0, 4).map(m => ({ id: m.id, initials: m.initials, tone: m.tone }))}
                max={4}
              />
              <span className="text-[9.5px] text-faint">4 admins can bypass MFA</span>
            </div>
          </SurfacePanel>
        </div>
      </div>

      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite people"
        description="They’ll receive an email with a 7-day join link."
        footer={
          <>
            <Button size="sm" variant="secondary" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button
              size="sm"
              iconLeft={<Mail className="h-3.5 w-3.5" />}
              onClick={() => {
                setInvites(list => [...list, 'new.teammate@unseen.ai']);
                setInviteOpen(false);
              }}
            >
              Send invite
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Email addresses" hint="Comma separated, or paste a list.">
            <Input placeholder="teammate@company.com, another@company.com" />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Role">
              <Select defaultValue="editor">
                <option value="viewer">Viewer — read only</option>
                <option value="editor">Editor — can deploy</option>
                <option value="admin">Admin — can manage keys</option>
              </Select>
            </Field>
            <Field label="Team"><Select defaultValue="platform"><option value="platform">Platform</option><option value="support">Support</option></Select></Field>
          </div>
          <Checkbox checked label="Require MFA on first sign-in" />
          <div className="rounded-lg border border-line bg-surface-2 p-2.5">
            <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-faint">New members will be able to</div>
            <ul className="mt-1.5 space-y-1">
              {['Run experiments in the playground', 'Deploy models to staging', 'Read dashboards and usage'].map(item => (
                <li key={item} className="flex items-center gap-1.5 text-[10px] text-muted">
                  <Check className="h-2.5 w-2.5 text-success" strokeWidth={3} /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
}
