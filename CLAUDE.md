# IoT Sensor Dashboard — Project Context

## What this project is

A full-stack IoT learning project: an ESP32 publishes sensor data via MQTT, a Fastify backend persists it to TimescaleDB and relays it in real time via WebSocket to a React dashboard.

## Architecture

```
ESP32 / Simulateur (capteurs)
        │  MQTT publish  (topic: maison/salon/device1)
        ▼
Mosquitto (broker MQTT)        ← Docker service
        │  subscribe
        ▼
Fastify v5 + TypeScript        ← Docker service  (server/)
        ├── persist → TimescaleDB  ← Docker service
        └── push   → WebSocket
                        │
                        ▼
                React + MUI X Charts   (client/)
```

## Stack

| Layer         | Technology                          |
|---------------|-------------------------------------|
| Device        | ESP32 (physical kit) + simulateur   |
| Protocol      | MQTT (via `mqtt` npm package)       |
| Broker        | Mosquitto                           |
| Backend       | Fastify v5, TypeScript, Node.js     |
| Database      | TimescaleDB (PostgreSQL extension)  |
| DB client     | `pg` (Pool)                         |
| Real-time     | WebSocket (native `ws`)             |
| Frontend      | React + MUI + MUI X Charts          |
| Orchestration | Docker Compose                      |

## Folder structure

```
IoT/
├── docker-compose.yml
├── mosquitto/
│   └── mosquitto.conf
├── server/                        # Fastify backend (NOT "backend/")
│   └── src/
│       ├── index.ts               # Entry point, WebSocket setup
│       ├── transport/
│       │   └── mqtt.ts            # MQTT subscription + message parsing
│       ├── services/
│       │   └── sensor-service.ts  # Business logic (handleSensorData)
│       └── persistence/
│           └── db.ts              # pg.Pool + saveMeasure()
├── client/                        # React frontend
├── simulator/
│   └── simulator.js               # Simulates ESP32 MQTT publishes
└── CLAUDE.md
```

## Key conventions

- **TypeScript with tsx** (no build step in dev): `npx tsx server/src/index.ts`
- **ESModule imports require `.js` extension**: use `import { x } from './db.js'`, NOT `'./db'`
- **MQTT topic structure**: `maison/salon/device1` (device ID only — no metric in topic)
- **MQTT payload**: `{ measures: { temperature: 23.4, humidity: 65 } }` — metrics are in the payload
- **`handleSensorData(deviceId, measures)`**: accepts `Record<string, number>`, iterates metrics with `Promise.all`, returns `Promise<SensorData[]>`
- **`SensorPayload`**: `{ measures: Record<string, number> }` — timestamp handled by `DEFAULT NOW()` in DB
- **Docker Compose**: `volumes:` must be declared at root level, not inside a service block
- **Fastify**: must listen on `host: '0.0.0.0'` inside Docker (not `localhost`)
- **Inter-service communication**: services communicate via their Docker Compose service names (`timescaledb`, `mosquitto`)

## Database

- TimescaleDB running in Docker, exposed on `localhost:5432`
- Hypertable on `time` column for time-series performance
- `time` column (not `timestamp`) — named `time` by TimescaleDB convention
- `saveMeasure(sensorId, metric, value)` is the insert function in `server/src/persistence/db.ts`
- `RETURNING time` in INSERT to send both `value` and `time` over WebSocket

## Dev commands

```bash
# Start full stack (all services dockerized)
docker compose up -d

# Run backend locally (outside Docker, for dev)
npx tsx server/src/index.ts

# Connect to DB (TablePlus: localhost:5432)
```

## Current state (roadmap)

- [x] Step 1 — MQTT pipeline: ESP32 simulator → Mosquitto → Fastify (logged)
- [x] Step 2 — TimescaleDB persistence: `saveMeasure` confirmed via TablePlus
- [x] Step 3 — WebSocket relay + React dashboard (MUI X Charts)
- [x] Step 4 — Dockerize full stack (Mosquitto + TimescaleDB + Fastify)
- [ ] Step 5 — Deploy (Railway / Render / VPS)

**Currently working on: Step 5 — Cloud deployment**

## Backlog features

### 🏠 Rooms & Devices management
- **Créer / renommer / supprimer des rooms** (salon, cuisine, chambre…) via une interface d'administration
- **Assigner un device à une room** — relation `device → room` stockée en base
- **Vue par room** dans le dashboard : sélectionner une pièce et voir uniquement ses capteurs
- **Affichage multi-devices** dans une même room (graphiques empilés ou comparatifs)
- **Renommer un device** (label lisible "Capteur salon" au lieu de `device1`)

### 📊 Dashboard & historique
- **Affichage historique** avec filtres par date (date picker MUI X)
- **Multi-métriques** : température + humidité sur le même graphique (double axe Y)
- **Indicateurs temps réel** : valeur courante + min/max/moyenne sur la période sélectionnée

### 🔐 Authentification
- **Login / logout** avec session persistante (JWT ou cookie httpOnly)
- **Route protégée** : le dashboard et l'API ne sont accessibles qu'une fois authentifié
- **Gestion des rôles** (optionnel) : admin (gère rooms/devices) vs viewer (lecture seule)
- **Fastify plugin `@fastify/jwt`** pour sécuriser les routes REST et WebSocket

### 🔔 Alertes & notifications
- **Seuils configurables par métrique** (ex : alerte si température > 30°C)
- **Notification in-app** (toast MUI) quand un seuil est franchi via WebSocket
- **Historique des alertes** consultable dans l'UI

### 🏗️ Architecture & qualité
- **Adapter pattern** : interface commune `SensorAdapter` → implémentations `SimulatorAdapter` et `ESP32Adapter` (inversion de dépendance)
- **REST API CRUD** pour rooms et devices (en complément du WebSocket temps réel)
- **Validation des payloads** avec les schémas Fastify (JSON Schema) sur toutes les routes

## Notes

- Docker Desktop must be manually launched on Windows before `docker compose up`
- Node.js v20+ required for Fastify v5 compatibility
- Git repo at `C:\01_Dev\IoT`, private GitHub, managed via GitKraken (SSH)
- Named Docker volumes required to persist TimescaleDB data across restarts
- The architecture is metric-agnostic: new metrics (e.g. `humidity`) work automatically without backend changes
