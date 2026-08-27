const {Router} = require('express');
const c = require('../controllers/auth.controller');
const {requireAuth} = require('../middlewares/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');
const r = Router();
r.post('/login', asyncHandler(c.login));
r.post('/logout', requireAuth, asyncHandler(c.logout));
r.get('/me', requireAuth, asyncHandler(c.me));
module.exports = r;
