const store = require('./store.service');
const { newToken, hashToken } = require('./crypto.util');

const HEARTBEAT_TIMEOUT_MS = Number(process.env.AGENT_OFFLINE_MS || 90000);

function sanitize(a){ if(!a) return a; const {tokenHash, ...rest}=a; return rest; }

function register({name, hostname, os, bridgeId, capabilities}){
  if(!name) throw Object.assign(new Error('name es obligatorio'), {statusCode:400});
  const token = newToken();
  const agent = store.create('agents', {
    name, hostname: hostname||null, os: os||null, bridgeId: bridgeId||null,
    capabilities: Array.isArray(capabilities)?capabilities:[],
    tokenHash: hashToken(token), status:'offline', lastHeartbeatAt:null, metrics:null
  });
  return { agent: sanitize(agent), token };
}

function list(){ return store.list('agents').map(sanitize); }

function heartbeat(id, token, metrics){
  const agent = store.list('agents').find(a=>a.id===id);
  if(!agent) return null;
  if(hashToken(token)!==agent.tokenHash) return 'unauthorized';
  const updated = store.update('agents', id, {status:'online', lastHeartbeatAt: new Date().toISOString(), metrics: metrics||agent.metrics||null});
  return sanitize(updated);
}

function sweepOffline(){
  const now = Date.now();
  for(const a of store.list('agents')){
    if(a.status==='online' && a.lastHeartbeatAt && (now - new Date(a.lastHeartbeatAt).getTime()) > HEARTBEAT_TIMEOUT_MS){
      store.update('agents', a.id, {status:'offline'});
    }
  }
}

function remove(id){ return store.remove('agents', id); }

module.exports = { register, list, heartbeat, sweepOffline, remove, sanitize };
