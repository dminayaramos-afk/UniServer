const {Router}=require('express'); const c=require('../controllers/server.controller'); const {requireAuth, requirePermission}=require('../middlewares/auth.middleware');
const r=Router();
r.get('/status',(req,res)=>res.json({ok:true,service:'UniServer',version:'1.0.0',time:new Date().toISOString()}));
r.get('/servers', requireAuth, requirePermission('servers.read'), c.list);
r.post('/servers', requireAuth, requirePermission('servers.manage'), c.create);
r.patch('/servers/:id', requireAuth, requirePermission('servers.manage'), c.update);
r.delete('/servers/:id', requireAuth, requirePermission('servers.delete'), c.remove);
r.post('/servers/:id/health', requireAuth, requirePermission('servers.read'), c.health);
module.exports = r;
