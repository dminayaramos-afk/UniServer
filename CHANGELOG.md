# Changelog

## 1.1.0 — 2026-08-25 (Fase 1 — Core)
- Usuarios reales con RBAC (`SUPER_ADMIN, ADMIN, OPERATOR, AUDITOR, VIEWER`) validado en backend.
- Sesiones por token opaco hasheado en reposo, con expiración configurable.
- Agentes: registro, token propio, heartbeat autenticado, paso a `offline` automático.
- Auditoría inmutable de toda acción administrativa.
- WebSocket en tiempo real (`/ws`) retransmitiendo cualquier cambio del inventario.
- Self-monitoring: `/api/health`, `/api/ready`, `/api/version`.
- Corregido bug real de enrutado: middlewares de router sin ruta interceptaban peticiones de otros routers montados bajo el mismo prefijo (`/api/auth/login`, `/api/agents/:id/heartbeat`).
- Corregido bug real del dashboard: fetch frágil basado en normalización de URL del navegador.
- 15/15 tests reales en verde (antes 3/3).

## 1.0.0 — 2026-08-25
- Transformado el esqueleto en un gestor universal de servidores.
- Inventario de nodos y estados operativos.
- Health checks HTTP/HTTPS y escaneo global.
- Eventos, latencia y resumen de operación.
- Módulo de puentes/topología preparado para conexiones entre nodos.
- Dashboard web inicial.
- Seguridad con API key, Helmet y rate limiting.
- Persistencia local atómica y Docker.
