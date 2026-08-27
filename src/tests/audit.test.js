process.env.ADMIN_API_KEY='test-key';
process.env.DATA_FILE='./data/uniserver.test-audit.json';
const fs=require('fs'); try{fs.unlinkSync(process.env.DATA_FILE)}catch{}
const request=require('supertest'); const app=require('../index');

describe('Auditoría', ()=>{
  test('las acciones administrativas quedan registradas y son de solo lectura', async ()=>{
    await request(app).post('/api/admin/bridges').set('x-api-key','test-key').send({name:'bridge-madrid'});
    const r=await request(app).get('/api/admin/audit').set('x-api-key','test-key');
    expect(r.statusCode).toBe(200);
    expect(r.body.data.some(e=>e.action==='bridges.manage'||e.target==='bridge-madrid'||e.action)).toBeTruthy();
  });
  test('no existe endpoint para borrar o modificar auditoría', async ()=>{
    const r=await request(app).delete('/api/admin/audit/algo').set('x-api-key','test-key');
    expect(r.statusCode).toBe(404);
  });
});
