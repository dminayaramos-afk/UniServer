const { WebSocketServer } = require('ws');
const authService = require('../services/auth.service');

function attach(server){
  const wss = new WebSocketServer({ server, path: '/ws' });
  wss.on('connection', (ws, req) => {
    const url = new URL(req.url, 'http://localhost');
    const token = url.searchParams.get('token');
    const apiKey = url.searchParams.get('apiKey');
    const configuredKey = process.env.ADMIN_API_KEY;
    const authorized = (configuredKey && apiKey===configuredKey) || !!authService.resolveToken(token);
    if(!authorized){ ws.close(4401, 'unauthorized'); return; }
    ws.send(JSON.stringify({type:'welcome', time:new Date().toISOString()}));
  });
  function broadcast(type, payload){
    const msg = JSON.stringify({type, payload, time:new Date().toISOString()});
    for(const client of wss.clients){ if(client.readyState===1) client.send(msg); }
  }
  return { wss, broadcast };
}
module.exports = { attach };
