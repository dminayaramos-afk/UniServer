const users = require('../services/user.service');
const audit = require('../services/audit.service');

async function list(req,res){ res.json({ok:true, data: users.list()}); }
async function create(req,res){
  const user = users.create(req.body||{});
  audit.record({actor:req.user.username, action:'users.create', target:user.username});
  res.status(201).json({ok:true, data:user});
}
async function setRole(req,res){
  const user = users.setRole(req.params.id, (req.body||{}).role);
  if(!user) return res.status(404).json({ok:false,error:'Usuario no encontrado'});
  audit.record({actor:req.user.username, action:'users.setRole', target:user.username, meta:{role:user.role}});
  res.json({ok:true, data:user});
}
async function setActive(req,res){
  const user = users.setActive(req.params.id, (req.body||{}).active);
  if(!user) return res.status(404).json({ok:false,error:'Usuario no encontrado'});
  audit.record({actor:req.user.username, action:'users.setActive', target:user.username, meta:{active:user.active}});
  res.json({ok:true, data:user});
}
module.exports = { list, create, setRole, setActive };
