const authService = require('../services/auth.service');
const audit = require('../services/audit.service');

async function login(req,res){
  const {username, password} = req.body||{};
  if(!username || !password) return res.status(400).json({ok:false,error:'username y password son obligatorios'});
  const result = authService.login(username, password);
  if(!result){ audit.record({actor:username, action:'auth.login', result:'FAILURE'}); return res.status(401).json({ok:false,error:'Credenciales inválidas'}); }
  audit.record({actor:result.user.username, action:'auth.login', result:'SUCCESS'});
  res.json({ok:true, data: result});
}

async function logout(req,res){
  const header = req.get('authorization')||'';
  const token = header.toLowerCase().startsWith('bearer ')?header.slice(7).trim():null;
  authService.logout(token);
  res.json({ok:true});
}

async function me(req,res){ res.json({ok:true, data: req.user}); }

module.exports = { login, logout, me };
