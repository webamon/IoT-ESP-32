# IoT Platform — Capteurs & Dashboard temps réel

Plateforme IoT pour collecter, stocker et visualiser des données de capteurs (ESP32) en temps réel.

## Architecture

```
ESP32 / Simulateur (capteurs)
        │  MQTT publish  (topic: maison/salon/<deviceId>)
        ▼
Mosquitto (broker MQTT — port 1883)     ← Docker
        │  subscribe
        ▼
Fastify (backend Node.js — port 3000)   ← Docker
        ├── sauvegarde → TimescaleDB    ← Docker
        └── push      → WebSocket
                              │
                              ▼
                    Dashboard React (MUI + MUI X Charts)
```

## Stack technique

| Couche          | Techno                            | Pourquoi                                            |
| --------------- | --------------------------------- | --------------------------------------------------- |
| Protocole IoT   | MQTT (Mosquitto)                  | Standard IoT, léger, conçu pour les capteurs        |
| Backend         | Node.js + Fastify v5 + TypeScript | Rapide, validation JSON native, adapté au streaming |
| Temps réel      | WebSocket                         | Relay MQTT → frontend avec contrôle côté serveur    |
| Base de données | TimescaleDB (PostgreSQL)          | Optimisée pour les time-series, SQL compatible      |
| Frontend        | React + MUI + MUI X Charts        | Composants Material Design, graphiques time-series  |
| DevOps          | Docker Compose                    | Orchestration locale de tous les services           |

## Structure du projet

```
IoT/
├── docker-compose.yml        # Orchestration des services
├── mosquitto/
│   └── mosquitto.conf        # Config du broker MQTT
├── server/                   # Backend Fastify (TypeScript)
│   ├── Dockerfile
│   └── src/
│       ├── index.ts          # Point d'entrée, WebSocket
│       ├── transport/
│       │   └── mqtt.ts       # Abonnement MQTT, parsing des messages
│       ├── services/
│       │   └── sensor-service.ts  # Logique métier (handleSensorData)
│       └── persistence/
│           └── db.ts         # Pool PostgreSQL, saveMeasure()
├── client/                   # Frontend React
└── simulator/
    └── simulator.js          # Simulateur ESP32 (publie des données factices)
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
node simulator/simulator.js
```

## Format des messages MQTT

**Topic :** `maison/<room>/<deviceId>`

**Payload JSON :**

```json
{
  "measures": {
    "temperature": 23.4,
    "humidity": 60
  }
}
```

Le backend est metric-agnostic : ajouter une nouvelle métrique dans le payload ne nécessite aucun changement côté serveur.

**WebSocket :** `ws://localhost:3000/sensor-measures`

## Roadmap

- [x] Broker MQTT (Mosquitto) via Docker
- [x] Serveur Fastify abonné aux topics MQTT
- [x] Simulateur ESP32
- [x] Persistance des données (TimescaleDB)
- [x] WebSocket vers le frontend
- [x] Dashboard React (MUI + MUI X Charts)
- [x] Dockerisation complète du stack
- [ ] Déploiement cloud (Railway / Render / VPS)

## Backlog features

### 🏠 Rooms & Devices
- Créer / renommer / supprimer des rooms via une interface d'administration
- Assigner un device à une room, renommer un device
- Vue par room dans le dashboard (filtrage par pièce)
- Affichage multi-devices comparatif dans une même room

### 📊 Dashboard & historique
- Historique avec filtres par date (MUI X Date Pickers)
- Multi-métriques sur un même graphique (température + humidité)
- Indicateurs temps réel : valeur courante, min / max / moyenne

### 🔐 Authentification
- Login / logout avec JWT (`@fastify/jwt`)
- Routes API et WebSocket protégées
- Gestion des rôles : admin vs viewer

### 🔔 Alertes
- Seuils configurables par métrique
- Notifications in-app (toast MUI) via WebSocket
- Historique des alertes

### 🏗️ Architecture
- Adapter pattern : interface `SensorAdapter` → implémentations simulateur et ESP32
- REST API CRUD pour rooms et devices
