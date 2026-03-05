# IoT Platform — Capteurs & Dashboard temps réel

Plateforme IoT pour collecter, stocker et visualiser des données de capteurs (ESP32) en temps réel.

## Architecture

```
ESP32 / Simulateur (capteurs)
        │  MQTT publish
        ▼
Mosquitto (broker MQTT — port 1883)
        │  subscribe
        ▼
Fastify (backend Node.js — port 3000)
        ├── sauvegarde → TimescaleDB         [à venir]
        └── push      → WebSocket            [à venir]
                              │
                              ▼
                    Dashboard React           [à venir]
```

## Stack technique

| Couche          | Techno                      | Pourquoi                                            |
|-----------------|-----------------------------|-----------------------------------------------------|
| Protocole IoT   | MQTT (Mosquitto)            | Standard IoT, léger, conçu pour les capteurs        |
| Backend         | Node.js + Fastify + TypeScript | Rapide, validation JSON native, adapté au streaming |
| Temps réel      | WebSocket                   | Relay MQTT → frontend avec contrôle côté serveur    |
| Base de données | TimescaleDB (PostgreSQL)    | Optimisée pour les time-series, SQL compatible      |
| Frontend        | React + Recharts            | Graphiques interactifs, API React simple            |
| DevOps          | Docker Compose              | Orchestration locale de tous les services           |

## Structure du projet

```
IoT/
├── docker-compose.yml        # Orchestration des services
├── mosquitto/
│   └── mosquitto.conf        # Config du broker MQTT
├── server/                   # Backend Fastify (TypeScript)
│   └── src/
│       └── index.ts          # Subscribe MQTT, log les messages
└── simulator/                # Simulateur ESP32
    └── simulator.js          # Publie des données de capteur factices
```

## Prérequis

- [Docker](https://www.docker.com/) & Docker Compose
- [Node.js](https://nodejs.org/) v20+

## Démarrage rapide

### 1. Lancer le broker MQTT

```bash
docker compose up -d
```

### 2. Démarrer le serveur

```bash
cd server
npm install
npm run dev
```

### 3. Lancer le simulateur (dans un autre terminal)

```bash
cd simulator
npm install
node simulator.js
```

Le simulateur publie un message MQTT sur le topic `maison/salon/temperature`.
Le serveur le reçoit et l'affiche dans sa console.

## Format des messages MQTT

**Topic :** `maison/salon/<type_capteur>`

**Payload JSON :**
```json
{
  "value": 23.4,
  "unit": "°C",
  "timestamp": "2026-03-06T10:00:00.000Z"
}
```

## Roadmap

- [x] Broker MQTT (Mosquitto) via Docker
- [x] Serveur Fastify abonné aux topics MQTT
- [x] Simulateur ESP32
- [ ] Persistance des données (TimescaleDB)
- [ ] WebSocket vers le frontend
- [ ] Dashboard React + Recharts
- [ ] Déploiement (Railway / Render / VPS)
