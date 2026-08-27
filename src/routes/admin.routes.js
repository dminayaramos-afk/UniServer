const {Router}=require('express'); const c=require('../controllers/admin.controller'); const {requireAuth, requirePermission}=require('../middlewares/auth.middleware');
const r=Router();
r.get('/overview', requireAuth, requirePermission('servers.read'), c.overview);
r.post('/scan', requireAuth, requirePermission('servers.manage'), c.scan);
for(const [base,ctrl,perm] of [['bridges',c.bridges,'bridges'],['events',c.events,'events']]){
  r.get('/'+base, requireAuth, requirePermission(perm+'.read'), ctrl.list);
  r.post('/'+base, requireAuth, requirePermission(perm+'.manage'), ctrl.create);
  r.patch('/'+base+'/:id', requireAuth, requirePermission(perm+'.manage'), ctrl.update);
  r.delete('/'+base+'/:id', requireAuth, requirePermission(perm+'.manage'), ctrl.remove);
}
module.exports = r;
