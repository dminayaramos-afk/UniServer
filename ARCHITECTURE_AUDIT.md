# Auditoría de arquitectura (Fase 0)

## Qué existía en el ZIP original (v1.0.0)
Un esqueleto Express **real y honesto**, sin funcionalidad simulada:
- Inventario de servidores (CRUD) con `status`, `health`, `lastCheckAt`.
- Health checks HTTP/HTTPS reales (`src/services/health.service.js`), no simulados.
- `bridges` y `events` como colecciones CRUD genéricas (sin lógica de topología real).
- Persistencia JSON atómica con escritura vía archivo temporal + rename (`src/config/db.js`).
- Seguridad: una única `ADMIN_API_KEY`, Helmet, rate limiting.
- Dashboard de una sola página (`public/index.html`) con fetch a la API.
- Docker, `.env.example`, 3 tests con Jest+Supertest (todos pasaban).

## Qué faltaba frente al prompt maestro
Prácticamente todo lo estructural: agentes, RBAC/usuarios, auditoría inmutable,
WebSockets/tiempo real, self-monitoring (`/health`,`/ready`,`/version`), Docker/K8s,
motor de automatización, backups, descubrimiento, IA/analítica, terminal remota,
explorador de archivos, topología visual, notificaciones multi-canal.

## Qué se hizo en la Fase 1 (Core)
- **RBAC real**: 5 roles (`SUPER_ADMIN, ADMIN, OPERATOR, AUDITOR, VIEWER`) con permisos
  granulares validados **siempre en backend** (`src/config/roles.js`,
  `src/middlewares/auth.middleware.js`). La `ADMIN_API_KEY` original se mantiene como
  superadmin de compatibilidad retro; además hay usuarios reales con contraseña
  (`scrypt` + salt, sin librerías externas de hashing) y sesiones por token opaco
  (hasheado con SHA-256 en reposo, nunca se guarda el token en claro).
- **Agentes**: entidad nueva con identidad única, token propio, heartbeat autenticado,
  reconexión (`status` vuelve a `offline` si no hay heartbeat reciente — barrido cada
  30s). Base para conectar agentes reales de servidor más adelante.
- **Auditoría inmutable**: toda acción administrativa (crear/editar/borrar servidores,
  bridges, events, agentes, usuarios, login) queda registrada en `audit`. No existe
  ningún endpoint de escritura/borrado para esa colección — solo lectura con
  permiso `audit.read`.
- **Tiempo real**: WebSocket en `/ws` (autenticado por API key o token de sesión) que
  retransmite cualquier cambio del store (`store.bus`), sin polling.
- **Self-monitoring**: `/api/health`, `/api/ready`, `/api/version`.
- **Bug real corregido**: los middlewares `r.use(requireAuth)` sin ruta actuaban como
  comodín sobre *todo* lo que llegaba al router (herencia del código original con
  `requireAdmin`), interceptando `/api/auth/login` y `/api/agents/:id/heartbeat`
  porque ambos routers comparten el prefijo `/api`. Corregido aplicando el middleware
  por ruta explícita, no a nivel de router.
- **Bug real corregido en el dashboard**: `fetch('/api/admin/../servers')` dependía de
  normalización de URL del navegador para funcionar; sustituido por dos helpers
  explícitos (`apiAdmin`, `apiCore`).

## Decisiones de arquitectura tomadas (y por qué)
1. **`ws` como única dependencia nueva**: es el estándar mínimo de Node para WebSockets
   sin reinventar el protocolo de Upgrade a mano; no se añadió Socket.IO (más pesado,
   innecesario para difundir eventos simples).
2. **Sin JWT**: se usan tokens opacos de sesión guardados hasheados, más simples de
   revocar (basta borrar la sesión) que un JWT autocontenido. Se evaluará JWT si hace
   falta stateless multi-instancia en una fase posterior.
3. **`users.manage` solo para `SUPER_ADMIN`**: gestionar usuarios/roles es la acción
   más sensible del sistema; ni siquiera `ADMIN` puede crear o cambiar roles de otros
   usuarios en esta fase (sí puede leerlos).
4. **Agentes sin ejecución remota todavía**: el heartbeat solo reporta estado y
   métricas opcionales; deliberadamente no hay canal de comandos hacia el agente
   (eso es Fase 3, con permisos explícitos, siguiendo la regla del prompt maestro de
   no exponer ejecución arbitraria).

## Verificación real (no solo "implementado")
```
npm install
npm test        # 15/15 tests OK (auth, agentes, auditoría, servidores)
node src/index.js   # arrancado y probado manualmente:
  - GET /api/health, /api/ready, /api/version → 200 reales
  - POST /api/servers, POST /api/admin/agents → 201 reales
  - WebSocket /ws → recibe eventos store.change en vivo al crear un bridge
```
