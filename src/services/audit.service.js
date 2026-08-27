const store = require('./store.service');
function record({actor, action, target, result, meta}){
  return store.create('audit', {actor: actor||'anonymous', action, target: target||null, result: result||'SUCCESS', meta: meta||{}});
}
function list(){ return store.list('audit').slice(-500).reverse(); }
module.exports = { record, list };
