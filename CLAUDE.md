# IoT Sensor Dashboard — Project Context

## What this project is

A full-stack IoT learning project: an ESP32 publishes sensor data via MQTT, a Fastify backend persists it to TimescaleDB and relays it in real time via WebSocket to a React dashboard.

## Architecture

```
ESP32 (physical sensors)
    │  MQTT publish
    ▼
Mosquitto (MQTT broker)        ← Docker service
    │  subscribe
    ▼
Fastify v5 + TypeScript        ← Docker service  (server/)
    ├── persist → TimescaleDB  ← Docker service
    └── push   → WebSocket
                    │
                    ▼
            React + Recharts   (client/)
```

## Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Device      | ESP32 (physical kit)              |
| Protocol    | MQTT (via `mqtt` npm package)     |
| Broker      | Mosquitto                         |
| Backend     | Fastify v5, TypeScript, Node.js   |
| Database    | TimescaleDB (PostgreSQL extension)|
| DB client   | `pg` (Pool)                       |
| Real-time   | WebSocket (native `ws`)           |
| Frontend    | React + Recharts                  |
| Orchestration | Docker Compose                  |

## Folder structure

```
IoT/
├── server/          # Fastify backend (NOT "backend/")
│   └── src/
│       ├── index.ts
│       ├── db.ts    # pg.Pool + saveMeasure()
│       └── ...
├── client/          # React frontend
├── docker-compose.yml
└── CLAUDE.md
```

## Key conventions

- **TypeScript with tsx** (no build step in dev): `npx tsx server/src/index.ts`
- **ESModule imports require `.js` extension**: use `import { x } from './db.js'`, NOT `'./db'`
- **MQTT topic structure**: `maison/salon/device1/temperature`
  - `sensorId` and `metric` are extracted from topic via `topic.split('/')`, not from payload
- **SensorPayload interface**: `{ value: number }` only — timestamp handled by `DEFAULT NOW()` in DB
- **Docker Compose**: `volumes:` must be declared at root level, not inside a service block

## Database

- TimescaleDB running on `localhost:5432`
- Hypertable on `time` column for time-series performance
- `saveMeasure(sensorId, metric, value)` is the insert function in `server/src/db.ts`

## Dev commands

```bash
# Start infrastructure
docker compose up -d

# Run backend
npx tsx server/src/index.ts

# Connect to DB (TablePlus: localhost:5432)
```

## Current state (roadmap)

- [x] Step 1 — MQTT pipeline: ESP32 simulator → Mosquitto → Fastify (logged)
- [x] Step 2 — TimescaleDB persistence: `saveMeasure` confirmed via TablePlus
- [ ] Step 3 — WebSocket relay + React dashboard (Recharts)
- [ ] Step 4 — Dockerize full stack
- [ ] Step 5 — Deploy (Railway / Render / VPS)

**Currently working on: Step 3**

## Notes

- Docker Desktop must be manually launched on Windows before `docker compose up`
- Node.js v20+ required for Fastify v5 compatibility
- Git repo at `C:\01_Dev\IoT`, private GitHub, managed via GitKraken (SSH)
