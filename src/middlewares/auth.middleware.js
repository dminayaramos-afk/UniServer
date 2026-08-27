const authService = require('../services/auth.service');
const { can } = require('../config/roles');

function extractBearer(req){
  const header = req.get('authorization')||'';
  if(header.toLowerCase().startsWith('bearer ')) return header.slice(7).trim();
  return null;
}

function requireAuth(req,res,next){
  const configuredKey = process.env.ADMIN_API_KEY;
  const apiKey = req.get('x-api-key');
  const bearer = extractBearer(req);
  // Compatibilidad retro: ADMIN_API_KEY actúa como SUPER_ADMIN (x-api-key o Bearer)
  if(configuredKey && (apiKey===configuredKey || bearer===configuredKey)){
    req.user = {id:'legacy-superadmin', username:'legacy-superadmin', role:'SUPER_ADMIN'};
    return next();
  }
  const session = authService.resolveToken(bearer);
  if(!session) return res.status(401).json({ok:false,error:'No autorizado'});
  req.user = {id:session.userId, username:session.username, role:session.role};
  next();
}

function requirePermission(permission){
  return (req,res,next)=>{
    if(!req.user) return res.status(401).json({ok:false,error:'No autorizado'});
    if(!can(req.user.role, permission)) return res.status(403).json({ok:false,error:'Permiso denegado: '+permission});
    next();
  };
}

module.exports = { requireAuth, requirePermission };
