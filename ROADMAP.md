# UniServer — Roadmap Completo

## Visión

UniServer evoluciona desde una plataforma central de gestión de servidores hasta un **control plane de infraestructura**, capaz de observar, administrar, automatizar, integrar y analizar entornos heterogéneos a gran escala.

### Evolución

**Auditar → Centralizar → Observar → Administrar → Automatizar → Integrar → Inteligencia → Escalar**

---

## Fases del proyecto

| Fase | Nombre | Objetivo | Resultado |
|---:|---|---|---|
| **0** | **Auditoría & Foundation** | Analizar y sanear la base técnica antes de ampliar funcionalidades. | Arquitectura, seguridad, dependencias, rendimiento y deuda técnica bajo control. |
| **1** | **Core Platform** | Construir el núcleo central de UniServer. | Usuarios, RBAC, autenticación, agentes, API, BD, eventos, WebSockets, bridges y auditoría. |
| **2** | **Observability & Monitoring** | Obtener visibilidad completa y en tiempo real de la infraestructura. | Métricas, histórico, dashboards, eventos, alertas y estado de servidores/agentes. |
| **3** | **Server Administration** | Administrar servidores de forma centralizada y segura. | Explorer, procesos, servicios, logs, terminal controlada, Docker y acciones auditadas. |
| **4** | **Automation & Orchestration** | Automatizar operaciones y procedimientos repetitivos. | Tasks, jobs, workflows, triggers, condiciones, backups, restauración y políticas. |
| **5** | **Infrastructure & Integrations** | Ampliar UniServer a infraestructuras heterogéneas. | Kubernetes, cloud, virtualización, redes, bases de datos, SSH, SNMP y adapters/plugins. |
| **6** | **Intelligence & AIOps** | Utilizar inteligencia para detectar, diagnosticar y prevenir problemas. | Anomalías, correlación, diagnóstico, causa probable, predicción y recomendaciones IA. |
| **7** | **Scale & Enterprise** | Preparar la plataforma para entornos grandes y críticos. | HA, clustering, escalabilidad horizontal, multi-tenant, SSO/OIDC y disaster recovery. |

---

# Fase 0 — Auditoría & Foundation

### Objetivo

Establecer una base técnica sólida, segura y mantenible.

### Alcance

- Auditoría de arquitectura.
- Auditoría de código.
- Revisión de API.
- Revisión del modelo de datos.
- Seguridad y gestión de secretos.
- Autenticación y autorización.
- Dependencias y vulnerabilidades.
- Docker y estrategia de despliegue.
- Rendimiento y consumo de recursos.
- Deuda técnica.
- Logging y trazabilidad.
- Definición de estándares de desarrollo.
- Estrategia de testing.

### Criterio de finalización

La arquitectura debe estar documentada, los riesgos críticos identificados y los problemas bloqueantes corregidos o planificados.

---

# Fase 1 — Core Platform

### Objetivo

Convertir UniServer en el núcleo central de gestión y control.

### Componentes

- API central.
- Autenticación.
- Usuarios.
- Roles y RBAC.
- Gestión de servidores.
- Gestión de agentes.
- Bridges.
- Persistencia.
- Eventos.
- WebSockets.
- Health checks.
- Auditoría.
- Gestión de sesiones.
- Configuración centralizada.

### Arquitectura conceptual

```text
                    UniServer Core
                         |
       +-----------------+-----------------+
       |                 |                 |
      API             Database          Events
       |                 |                 |
       +-----------------+-----------------+
                         |
                    Agent Manager
                         |
              +----------+----------+
              |                     |
           Agent A               Agent B
              |                     |
           Server A              Server B
```

### Criterio de finalización

UniServer puede registrar servidores, autenticarlos, comunicarse con agentes y gestionar operaciones básicas mediante API y eventos.

---

# Fase 2 — Observability & Monitoring

### Objetivo

Obtener una visión completa y en tiempo real del estado de todos los servidores.

### Métricas

- CPU.
- RAM.
- Swap.
- Disco.
- I/O.
- Red.
- Uptime.
- Load average.
- Procesos.
- Servicios.
- Docker.
- Estado del agente.
- Estado de bridges.

### Sistema de histórico

- Series temporales.
- Retención configurable.
- Agregaciones.
- Histórico por servidor.
- Comparación temporal.
- Tendencias.

### Dashboard

- Overview global.
- Estado de servidores.
- Métricas por servidor.
- Gráficas.
- Topología.
- Estado de agentes.
- Estado de servicios.
- Eventos recientes.

### Alertas

```text
Métrica
   |
   v
Threshold
   |
   v
Alert Engine
   |
   +----> OPEN
   |
   +----> ACK
   |
   +----> RESOLVED
```

Soporte para:

- Umbrales.
- Duración mínima.
- Severidad.
- Cooldown.
- ACK.
- Resolución automática.
- Silenciamiento.
- Historial.
- Notificaciones.

### Criterio de finalización

El operador puede detectar problemas, consultar histórico y recibir alertas sin conectarse directamente al servidor.

---

# Fase 3 — Server Administration

### Objetivo

Permitir administrar servidores desde UniServer de manera controlada y auditable.

### Explorer

- Navegación de filesystem.
- Lectura de archivos.
- Creación.
- Edición.
- Renombrado.
- Movimiento.
- Eliminación controlada.
- Permisos.

### Procesos

- Listado.
- CPU.
- RAM.
- PID.
- Usuario.
- Estado.
- Finalización controlada.

### Servicios

- Estado.
- Start.
- Stop.
- Restart.
- Enable/disable.
- Logs.

### Logs

- Streaming.
- Búsqueda.
- Filtros.
- Histórico.
- Descarga controlada.

### Terminal

Terminal remota con:

- Permisos.
- Timeouts.
- Auditoría.
- Restricción de comandos cuando sea necesario.
- Registro de ejecución.

### Docker

- Containers.
- Images.
- Networks.
- Volumes.
- Logs.
- Start/stop/restart.
- Estado.

### Criterio de finalización

Las operaciones administrativas habituales pueden realizarse desde UniServer sin perder control, trazabilidad ni seguridad.

---

# Fase 4 — Automation & Orchestration

### Objetivo

Convertir operaciones manuales en procesos automatizados y repetibles.

### Tasks

- Ejecución inmediata.
- Programación.
- Reintentos.
- Timeouts.
- Dependencias.
- Resultados.

### Workflows

```text
Trigger
   |
   v
Condition
   |
   v
Action
   |
   v
Verification
   |
   +----> Success
   |
   +----> Failure
             |
             v
           Alert
```

### Triggers

- Horario.
- Evento.
- Alerta.
- Estado de servicio.
- Métrica.
- Webhook.
- Acción manual.

### Backups

- Programación.
- Retención.
- Verificación.
- Rotación.
- Restauración.
- Histórico.

### Criterio de finalización

UniServer puede ejecutar procedimientos completos de mantenimiento y recuperación con mínima intervención humana.

---

# Fase 5 — Infrastructure & Integrations

### Objetivo

Ampliar UniServer desde servidores individuales hacia infraestructura completa.

### Kubernetes

- Clusters.
- Nodes.
- Pods.
- Deployments.
- Services.
- Namespaces.
- Events.
- Resources.
- Health.

### Cloud

Integraciones mediante adapters para:

- AWS.
- Azure.
- Google Cloud.

### Virtualización

- VMs.
- Hosts.
- Storage.
- Networks.
- Estado y recursos.

### Bases de datos

- PostgreSQL.
- MySQL/MariaDB.
- Redis.
- Health.
- Connections.
- Storage.
- Performance.

### Red

- Interfaces.
- Rutas.
- DNS.
- Puertos.
- Conectividad.
- SNMP.
- Dispositivos.

### Integraciones

Arquitectura basada en adapters/plugins para evitar acoplar cada integración al Core.

### Criterio de finalización

UniServer puede representar y monitorizar diferentes tipos de infraestructura desde un único plano de control.

---

# Fase 6 — Intelligence & AIOps

### Objetivo

Utilizar los datos recopilados por UniServer para detectar problemas, encontrar relaciones y ayudar al operador.

### Detección de anomalías

Ejemplos:

- CPU anormal.
- RAM anormal.
- Crecimiento de disco.
- Latencia anormal.
- Cambios inesperados.
- Patrones de fallo.

### Correlación

```text
Metric Event
     |
     +---- CPU ↑
     |
     +---- RAM ↑
     |
     +---- Latency ↑
     |
     +---- Service Errors
              |
              v
       Correlation Engine
              |
              v
       Possible Incident
```

### Diagnóstico

La plataforma puede analizar:

- Métricas.
- Logs.
- Eventos.
- Procesos.
- Servicios.
- Cambios recientes.
- Dependencias.
- Históricos.

### Recomendaciones

Ejemplo:

> Se detecta un incremento sostenido de CPU coincidente con un aumento de conexiones. El servicio X presenta la mayor correlación. Se recomienda revisar el proceso X y su límite de conexiones.

### Predicción

- Capacidad de disco.
- Saturación.
- Tendencias.
- Riesgo de incidentes.
- Necesidad de recursos.

### Criterio de finalización

La IA debe aportar información accionable y explicable, no únicamente generar texto.

---

# Fase 7 — Scale & Enterprise

### Objetivo

Preparar UniServer para infraestructuras grandes, equipos múltiples y entornos críticos.

### Alta disponibilidad

- Múltiples nodos UniServer.
- Failover.
- Health checks.
- Load balancing.
- Recuperación automática.

### Escalabilidad

```text
                 Load Balancer
                       |
          +------------+------------+
          |            |            |
          v            v            v
       Node 1       Node 2       Node 3
          |            |            |
          +------------+------------+
                       |
              Shared Infrastructure
```

### Datos

- PostgreSQL.
- Replicación.
- Backups.
- Disaster recovery.
- Retención.
- Migraciones.

### Enterprise

- Multi-tenant.
- Equipos.
- RBAC avanzado.
- SSO.
- OIDC.
- LDAP/AD.
- Políticas.
- Auditoría avanzada.

### Operación

- Rate limiting.
- Queue/event bus.
- Observabilidad interna.
- Métricas de UniServer.
- Distributed tracing.
- Gestión de capacidad.

### Criterio de finalización

UniServer puede operar como plataforma central en entornos grandes y críticos sin que el crecimiento de servidores o usuarios comprometa la estabilidad.

---

# Dependencias entre fases

```text
             ┌───────────────────────┐
             │ 0. AUDITORÍA          │
             │ Foundation            │
             └───────────┬───────────┘
                         ↓
             ┌───────────────────────┐
             │ 1. CORE               │
             │ Platform              │
             └───────────┬───────────┘
                         ↓
             ┌───────────────────────┐
             │ 2. OBSERVABILITY      │
             │ Monitoring            │
             └───────────┬───────────┘
                         ↓
             ┌───────────────────────┐
             │ 3. ADMINISTRATION     │
             │ Server Management     │
             └───────────┬───────────┘
                         ↓
             ┌───────────────────────┐
             │ 4. AUTOMATION         │
             │ Orchestration         │
             └───────────┬───────────┘
                         ↓
             ┌───────────────────────┐
             │ 5. INFRASTRUCTURE     │
             │ Integrations          │
             └───────────┬───────────┘
                         ↓
             ┌───────────────────────┐
             │ 6. INTELLIGENCE       │
             │ AIOps                 │
             └───────────┬───────────┘
                         ↓
             ┌───────────────────────┐
             │ 7. SCALE              │
             │ Enterprise            │
             └───────────────────────┘
```

---

# Principios transversales

Todas las fases deben respetar:

1. **Security by design**
2. **Least privilege**
3. **Auditability**
4. **API-first**
5. **Modularidad**
6. **Observability**
7. **Backward compatibility**
8. **Automatización segura**
9. **Fail-safe**
10. **Testing automatizado**
11. **Documentación**
12. **Migraciones controladas**

---

# Prioridad actual

La prioridad recomendada después del Core es:

## Fase 2 — Observability & Monitoring

Porque proporciona los datos necesarios para las siguientes fases:

```text
Monitoring
    |
    +----> Administration
    |
    +----> Automation
    |
    +----> Infrastructure
    |
    +----> Intelligence
    |
    +----> Enterprise
```

El objetivo final es que UniServer evolucione de un **gestor de servidores** a un **control plane completo de infraestructura y operaciones**.
