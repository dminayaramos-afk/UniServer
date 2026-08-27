process.env.ADMIN_API_KEY='test-key';
process.env.DATA_FILE='./data/uniserver.test-auth.json';
const fs=require('fs'); try{fs.unlinkSync(process.env.DATA_FILE)}catch{}
const request=require('supertest'); const app=require('../index');

describe('Auth y RBAC', ()=>{
  let viewerToken;
  test('SUPER_ADMIN legacy puede crear usuarios', async ()=>{
    const r=await request(app).post('/api/admin/users').set('x-api-key','test-key').send({username:'viewer1',password:'clave-larga-123',role:'VIEWER'});
    expect(r.statusCode).toBe(201);
    expect(r.body.data.role).toBe('VIEWER');
    expect(r.body.data.passwordHash).toBeUndefined();
  });
  test('login con credenciales correctas devuelve token', async ()=>{
    const r=await request(app).post('/api/auth/login').send({username:'viewer1',password:'clave-larga-123'});
    expect(r.statusCode).toBe(200);
    expect(r.body.data.token).toBeDefined();
    viewerToken=r.body.data.token;
  });
  test('login con credenciales incorrectas falla', async ()=>{
    const r=await request(app).post('/api/auth/login').send({username:'viewer1',password:'mala'});
    expect(r.statusCode).toBe(401);
  });
  test('VIEWER puede leer servidores pero no crear (RBAC real)', async ()=>{
    const read=await request(app).get('/api/servers').set('authorization','Bearer '+viewerToken);
    expect(read.statusCode).toBe(200);
    const write=await request(app).post('/api/servers').set('authorization','Bearer '+viewerToken).send({name:'x'});
    expect(write.statusCode).toBe(403);
  });
  test('VIEWER no puede gestionar usuarios', async ()=>{
    const r=await request(app).post('/api/admin/users').set('authorization','Bearer '+viewerToken).send({username:'otro',password:'clave-larga-123',role:'VIEWER'});
    expect(r.statusCode).toBe(403);
  });
  test('token inválido es rechazado', async ()=>{
    const r=await request(app).get('/api/servers').set('authorization','Bearer token-falso');
    expect(r.statusCode).toBe(401);
  });
});
