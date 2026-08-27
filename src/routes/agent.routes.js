const {Router} = require('express');
const c = require('../controllers/agent.controller');
const {requireAuth, requirePermission} = require('../middlewares/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');

const admin = Router();
admin.get('/', requireAuth, requirePermission('agents.read'), asyncHandler(c.list));
admin.post('/', requireAuth, requirePermission('agents.manage'), asyncHandler(c.register));
admin.delete('/:id', requireAuth, requirePermission('agents.manage'), asyncHandler(c.remove));

const pub = Router();
pub.post('/:id/heartbeat', asyncHandler(c.heartbeat));

module.exports = { admin, pub };
