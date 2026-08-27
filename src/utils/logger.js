const fs=require('fs'), path=require('path');
const dir=path.resolve('./logs'); fs.mkdirSync(dir,{recursive:true});
function log(level,message,meta={}){const line=JSON.stringify({time:new Date().toISOString(),level,message,...meta}); console.log(line); fs.appendFileSync(path.join(dir,'app.log'),line+'\n');}
module.exports={log};
