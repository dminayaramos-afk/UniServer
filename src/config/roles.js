const PERMISSIONS = {
  SUPER_ADMIN: ['*'],
  ADMIN: [
    'servers.read', 'servers.manage', 'servers.delete',
    'agents.read', 'agents.manage',
    'bridges.read', 'bridges.manage',
    'events.read', 'events.manage',
    'audit.read', 'users.read', 'settings.manage'
  ],
  OPERATOR: ['servers.read', 'servers.manage', 'agents.read', 'bridges.read', 'events.read'],
  AUDITOR: ['servers.read', 'agents.read', 'bridges.read', 'events.read', 'audit.read', 'users.read'],
  VIEWER: ['servers.read', 'agents.read', 'bridges.read', 'events.read']
};
const VALID_ROLES = Object.keys(PERMISSIONS);
function can(role, permission) {
  const perms = PERMISSIONS[role];
  if (!perms) return false;
  return perms.includes('*') || perms.includes(permission);
}
module.exports = { PERMISSIONS, VALID_ROLES, can };
