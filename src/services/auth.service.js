const store = require('./store.service');
const { newToken, hashToken } = require('./crypto.util');
const users = require('./user.service');

const TTL_MS = Number(process.env.SESSION_TTL_MS || 12*60*60*1000);

function login(username, password){
  const user = users.verify(username, password);
  if(!user) return null;
  const token = newToken();
  const expiresAt = new Date(Date.now()+TTL_MS).toISOString();
  store.create('sessions', {tokenHash: hashToken(token), userId:user.id, role:user.role, username:user.username, expiresAt});
  return {token, expiresAt, user: users.sanitize(user)};
}

function resolveToken(token){
  if(!token) return null;
  const th = hashToken(token);
  const session = store.list('sessions').find(s=>s.tokenHash===th);
  if(!session) return null;
  if(new Date(session.expiresAt).getTime() < Date.now()){ store.remove('sessions', session.id); return null; }
  return session;
}

function logout(token){
  if(!token) return false;
  const th = hashToken(token);
  const session = store.list('sessions').find(s=>s.tokenHash===th);
  if(!session) return false;
  return store.remove('sessions', session.id);
}

module.exports = { login, resolveToken, logout };
