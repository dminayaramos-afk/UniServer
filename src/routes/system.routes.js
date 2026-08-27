const {Router} = require('express');
const store = require('../services/store.service');
const pkg = require('../../package.json');
const r = Router();
r.get('/health', (req,res)=>{
  res.json({ok:true, status:'healthy', uptimeSec: Math.round(process.uptime()), timestamp:new Date().toISOString()});
});
r.get('/ready', (req,res)=>{
  try{ store.list('servers'); res.json({ok:true, status:'ready'}); }
  catch(e){ res.status(503).json({ok:false, status:'not-ready', error:e.message}); }
});
r.get('/version', (req,res)=>{
  res.json({ok:true, name:pkg.name, version:pkg.version});
});
module.exports = r;
