process.env.ADMIN_API_KEY='test-key';
process.env.DATA_FILE='./data/uniserver.test-agents.json';
const fs=require('fs'); try{fs.unlinkSync(process.env.DATA_FILE)}catch{}
const request=require('supertest'); const app=require('../index');

describe('Agentes', ()=>{
  let agentId, agentToken;
  test('registra un agente', async ()=>{
    const r=await request(app).post('/api/admin/agents').set('x-api-key','test-key').send({name:'agent-01', os:'linux'});
    expect(r.statusCode).toBe(201);
    expect(r.body.data.token).toBeDefined();
    expect(r.body.data.agent.status).toBe('offline');
    agentId=r.body.data.agent.id; agentToken=r.body.data.token;
  });
  test('heartbeat con token correcto pone el agente online', async ()=>{
    const r=await request(app).post(`/api/agents/${agentId}/heartbeat`).set('x-agent-token',agentToken).send({metrics:{cpu:10}});
    expect(r.statusCode).toBe(200);
    expect(r.body.data.status).toBe('online');
  });
  test('heartbeat con token incorrecto es rechazado', async ()=>{
    const r=await request(app).post(`/api/agents/${agentId}/heartbeat`).set('x-agent-token','falso').send({});
    expect(r.statusCode).toBe(401);
  });
  test('listado de agentes no expone el token almacenado', async ()=>{
    const r=await request(app).get('/api/admin/agents').set('x-api-key','test-key');
    expect(r.statusCode).toBe(200);
    expect(r.body.data[0].tokenHash).toBeUndefined();
  });
});
