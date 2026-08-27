# UniServer — Gestor Universal de Servidores

UniServer evoluciona el esqueleto original a un **centro de operaciones ligero y extensible** para administrar múltiples servidores desde una única API y panel.

## Capacidades
- Inventario centralizado de servidores y entornos.
- Health checks HTTP/HTTPS bajo demanda y escaneo de todos los servidores registrados.
- Estado online/offline, latencia, última comprobación y eventos.
- Concepto de **puentes (bridges)** para representar conexiones entre nodos, regiones o servicios y dejar preparada la topología.
- **Agentes**: registro con token propio, heartbeat autenticado, paso automático a `offline` si dejan de reportar.
- **Usuarios y RBAC real** (`SUPER_ADMIN, ADMIN, OPERATOR, AUDITOR, VIEWER`), validado siempre en backend.
- **Auditoría inmutable** de toda acción administrativa (solo lectura vía API).
- **Tiempo real** por WebSocket (`/ws`) — cualquier cambio del inventario se retransmite sin polling.
- Self-monitoring: `GET /api/health`, `/api/ready`, `/api/version`.
- API protegida por API key (compatibilidad retro) o por sesión de usuario, cabeceras de seguridad y rate limiting.
- Persistencia local atómica en JSON para arrancar sin una base de datos obligatoria.
- Dashboard web incluido en `/dashboard`.
- Docker listo para producción como punto de partida.

## Arranque
```bash
cp .env.example .env
# cambia ADMIN_API_KEY (modo rápido / compatibilidad retro)
# o define ADMIN_USERNAME + ADMIN_PASSWORD para crear un SUPER_ADMIN real al primer arranque
npm install
npm start
```
Abre `http://localhost:3000/dashboard`.

## Autenticación
Dos modos, compatibles entre sí:
1. **API key única** (`ADMIN_API_KEY`): actúa como `SUPER_ADMIN`. Cabecera `x-api-key` o `Authorization: Bearer <key>`.
2. **Usuarios reales**: `POST /api/auth/login` con `{username,password}` devuelve un token de sesión de 12h. Úsalo como `Authorization: Bearer <token>`.

## API principal
- `GET /api/status`, `/api/health`, `/api/ready`, `/api/version` — públicos.
- `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`.
- `GET/POST/PATCH/DELETE /api/servers` — inventario (RBAC: `servers.*`).
- `POST /api/servers/:id/health` — comprobación individual.
- `GET /api/admin/overview` — resumen operativo.
- `POST /api/admin/scan` — comprueba todos los servidores registrados.
- `GET/POST/PATCH/DELETE /api/admin/bridges` — topología/puentes.
- `GET/POST/PATCH/DELETE /api/admin/events` — eventos.
- `GET/POST/DELETE /api/admin/agents` — gestión de agentes (RBAC: `agents.*`).
- `POST /api/agents/:id/heartbeat` — reportado por el propio agente con `x-agent-token` (no requiere sesión de usuario).
- `GET/POST/PATCH /api/admin/users` — gestión de usuarios (solo `SUPER_ADMIN`).
- `GET /api/admin/audit` — auditoría de solo lectura (RBAC: `audit.read`).
- `ws://.../ws?apiKey=...` o `?token=...` — eventos en tiempo real.

Todas las rutas administrativas requieren autenticación y el permiso RBAC correspondiente — nunca solo el frontend.

## Arquitectura objetivo
El proyecto queda preparado para crecer hacia una plataforma universal con **agentes por servidor**, adaptadores SSH/WinRM/PowerShell, Docker/Kubernetes, métricas Prometheus, alertas, backups, tareas programadas, RBAC, auditoría y descubrimiento controlado. La ejecución remota debe implementarse mediante agentes/adaptadores explícitos y permisos mínimos, no mediante comandos arbitrarios expuestos en la API.
