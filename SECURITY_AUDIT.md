# Auditoría de seguridad (Fase 0 → Fase 1)

## Hallazgos en el ZIP original
- Un único secreto (`ADMIN_API_KEY`) para todo: sin distinción de usuarios ni roles.
  Cualquiera con la clave tiene control total; no hay forma de revocar acceso a una
  sola persona sin rotar la clave para todos.
- Sin auditoría: no quedaba constancia de quién hizo qué.
- Sin límite de intentos de login (no existía login) ni expiración de nada.
- CORS abierto (`cors()` sin restricciones) — aceptable para una API interna con
  API key, pero a vigilar si se expone a un frontend en otro origen en producción.

## Corregido en esta fase
- Contraseñas con `scrypt` (CPU/memoria-hard, resistente a fuerza bruta con GPU) +
  salt único por usuario. Nunca se devuelve `passwordHash`/`passwordSalt` en ninguna
  respuesta (`user.service.sanitize`).
- Tokens de sesión y de agente se generan con `crypto.randomBytes(32)` y se
  **almacenan hasheados** (SHA-256) — un volcado de la base de datos JSON no expone
  tokens utilizables directamente.
- Sesiones con expiración (`SESSION_TTL_MS`, 12h por defecto) y purga al primer uso
  tras caducar.
- RBAC validado exclusivamente en backend (`requirePermission`); el frontend nunca es
  la barrera de seguridad.
- Auditoría de solo-lectura: ninguna ruta permite modificar o borrar el historial.

## Pendiente (fases siguientes, listado con honestidad)
- CORS sigue abierto por defecto — restringir por `ORIGIN` en `.env` antes de exponer
  a Internet.
- No hay rate limiting específico para `/api/auth/login` (solo el general de 300
  req/min) — añadir un limitador más estricto para login en Fase 2.
- No hay rotación/expiración de tokens de agente — hoy son de un solo uso hasta que
  se borre el agente manualmente.
- No hay 2FA.
- El log de aplicación (`logs/app.log`) puede contener payloads de request en texto
  plano si se amplía el logging — revisar antes de loguear cuerpos de petición.
