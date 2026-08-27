const {read,write}=require('../config/db');
const {randomUUID}=require('crypto');
const {EventEmitter}=require('events');
const bus = new EventEmitter();

function list(type){return read()[type]||[];}
function create(type,value){const db=read(); const item={id:randomUUID(),createdAt:new Date().toISOString(),...value}; if(!db[type])db[type]=[]; db[type].push(item); write(db); bus.emit('change',{type,action:'create',item}); return item;}
function update(type,id,patch){const db=read(); const arr=db[type]||[]; const i=arr.findIndex(x=>x.id===id); if(i<0)return null; arr[i]={...arr[i],...patch,updatedAt:new Date().toISOString()}; db[type]=arr; write(db); bus.emit('change',{type,action:'update',item:arr[i]}); return arr[i];}
function remove(type,id){const db=read(); const arr=db[type]||[]; const before=arr.length; db[type]=arr.filter(x=>x.id!==id); if(db[type].length===before)return false; write(db); bus.emit('change',{type,action:'remove',id}); return true;}
function addEvent(event){return create('events',event);}
module.exports={list,create,update,remove,addEvent,bus};
