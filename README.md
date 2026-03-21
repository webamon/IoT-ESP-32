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
        ├── sauvegarde → TimescaleDB
        └── push      → WebSocket
                              │
                              ▼
                    Dashboard React           [à venir]
```

## Stack technique

| Couche          | Techno                            | Pourquoi                                            |
| --------------- | --------------------------------- | --------------------------------------------------- |
| Protocole IoT   | MQTT (Mosquitto)                  | Standard IoT, léger, conçu pour les capteurs        |
| Backend         | Node.js + Fastify v5 + TypeScript | Rapide, validation JSON native, adapté au streaming |
| Temps réel      | WebSocket                         | Relay MQTT → frontend avec contrôle côté serveur    |
| Base de données | TimescaleDB (PostgreSQL)          | Optimisée pour les time-series, SQL compatible      |
| Frontend        | React + Recharts                  | Graphiques interactifs, API React simple            |
| DevOps          | Docker Compose                    | Orchestration locale de tous les services           |

## Structure du projet

```
IoT/
├── docker-compose.yml        # Orchestration des services
├── mosquitto/
│   └── mosquitto.conf        # Config du broker MQTT
├── server/                   # Backend Fastify (TypeScript)
│   └── src/
│       ├── index.ts          # Point d'entrée, route WebSocket
│       ├── transport/
│       │   └── mqtt.ts       # Abonnement MQTT, parsing des messages
│       ├── services/
│       │   └── sensor-service.ts  # Logique métier
│       └── persistence/
│           └── db.ts         # Pool PostgreSQL, saveMeasure()
├── client/                   # Frontend React
└── simulator/                # Simulateur ESP32
    └── simulator.js          # Publie des données de capteur factices
```

## Prérequis

- [Docker](https://www.docker.com/) & Docker Compose
- [Node.js](https://nodejs.org/) v20+

## Démarrage rapide

```bash
docker compose up -d
```

Tous les services (Mosquitto, Fastify, TimescaleDB) démarrent automatiquement.

Pour lancer le simulateur (hors Docker) :

```bash
cd simulator
npm install
node simulator.js
```

## Format des messages MQTT

**Topic :** `maison/salon/<deviceId>`

**Payload JSON :**

```json
{
  "measures": {
    "temperature": 23.4,
    "humidity": 60
  }
}
```

**WebSocket :** `ws://localhost:3000/sensor-measures`

## Roadmap

- [x] Broker MQTT (Mosquitto) via Docker
- [x] Serveur Fastify abonné aux topics MQTT
- [x] Simulateur ESP32
- [x] Persistance des données (TimescaleDB)
- [x] WebSocket vers le frontend
- [ ] Dashboard React + Recharts
- [ ] Déploiement (Railway / Render / VPS)
