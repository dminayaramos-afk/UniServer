const fs = require('fs');
const path = require('path');
const file = path.resolve(process.env.DATA_FILE || './data/uniserver.json');
const initial = { servers: [], bridges: [], events: [], jobs: [], users: [], sessions: [], agents: [], audit: [] };
function ensure(){ fs.mkdirSync(path.dirname(file), {recursive:true}); if(!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify(initial,null,2)); }
function read(){ ensure(); try{return {...initial,...JSON.parse(fs.readFileSync(file,'utf8'))};}catch{return {...initial};} }
function write(data){ ensure(); const tmp=file+'.tmp'; fs.writeFileSync(tmp, JSON.stringify(data,null,2)); fs.renameSync(tmp,file); return data; }
module.exports={read,write};
