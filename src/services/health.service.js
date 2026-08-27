const http=require('http'), https=require('https');
function probe(server,timeout=5000){
  return new Promise(resolve=>{
    const started=Date.now();
    if(!server.url) return resolve({ok:false,error:'Servidor sin URL'});
    let url; try{url=new URL(server.url);}catch{return resolve({ok:false,error:'URL inválida'});}
    const lib=url.protocol==='https:'?https:http;
    const req=lib.request(url,{method:'GET',timeout,headers:{'user-agent':'UniServer-Health/1.0'}},res=>{
      res.resume(); resolve({ok:res.statusCode>=200&&res.statusCode<500,status:res.statusCode,latencyMs:Date.now()-started});
    });
    req.on('timeout',()=>req.destroy(new Error('timeout'))); req.on('error',e=>resolve({ok:false,error:e.message,latencyMs:Date.now()-started})); req.end();
  });
}
async function checkServer(server){const result=await probe(server); return {...result,checkedAt:new Date().toISOString()};}
module.exports={probe,checkServer};
