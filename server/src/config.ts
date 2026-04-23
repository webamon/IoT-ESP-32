export const config = {
  db: {
    host: process.env.DB_HOST ?? 'timescaledb',
    port: Number(process.env.DB_PORT ?? 5432),
    database: process.env.DB_NAME ?? 'iot_db',
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? 'iot',
  },
  mqtt: {
    url: process.env.MQTT_URL ?? 'mqtt://mosquitto:1883',
    topicPrefix: process.env.MQTT_TOPIC_PREFIX ?? 'maison',
  },
  server: {
    port: Number(process.env.PORT ?? 3000),
    host: process.env.HOST ?? '0.0.0.0',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET ?? 'enAvantGuingamp',
  },
}
