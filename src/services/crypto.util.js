const crypto = require('crypto');
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}
function verifyPassword(password, salt, hash) {
  const check = crypto.scryptSync(password, salt, 64).toString('hex');
  const a = Buffer.from(check, 'hex'); const b = Buffer.from(hash, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
function newToken() { return crypto.randomBytes(32).toString('hex'); }
function hashToken(token) { return crypto.createHash('sha256').update(String(token || '')).digest('hex'); }
module.exports = { hashPassword, verifyPassword, newToken, hashToken };
