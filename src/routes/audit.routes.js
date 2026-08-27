const {Router} = require('express');
const audit = require('../services/audit.service');
const {requireAuth, requirePermission} = require('../middlewares/auth.middleware');
const r = Router();
r.get('/', requireAuth, requirePermission('audit.read'), (req,res)=>res.json({ok:true, data: audit.list()}));
module.exports = r;
