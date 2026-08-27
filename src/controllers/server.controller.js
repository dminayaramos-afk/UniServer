const store=require('../services/store.service'); const {checkServer}=require('../services/health.service');
const allowed=['name','host','port','url','protocol','environment','tags','notes','enabled','bridgeId','agentId'];
function pick(b){return Object.fromEntries(allowed.filter(k=>b[k]!==undefined).map(k=>[k,b[k]]));}
async function list(req,res){res.json({ok:true,data:store.list('servers')});}
async function create(req,res){if(!req.body.name)return res.status(400).json({ok:false,error:'name es obligatorio'}); const item=store.create('servers',{...pick(req.body),status:'unknown'}); res.status(201).json({ok:true,data:item});}
async function update(req,res){const item=store.update('servers',req.params.id,pick(req.body)); if(!item)return res.status(404).json({ok:false,error:'Servidor no encontrado'}); res.json({ok:true,data:item});}
async function remove(req,res){if(!store.remove('servers',req.params.id))return res.status(404).json({ok:false,error:'Servidor no encontrado'});res.status(204).end();}
async function health(req,res){const s=store.list('servers').find(x=>x.id===req.params.id);if(!s)return res.status(404).json({ok:false,error:'Servidor no encontrado'});const h=await checkServer(s);store.update('servers',s.id,{health:h,lastCheckAt:h.checkedAt,status:h.ok?'online':'offline'});res.json({ok:true,data:{serverId:s.id,health:h}});}
module.exports={list,create,update,remove,health};
