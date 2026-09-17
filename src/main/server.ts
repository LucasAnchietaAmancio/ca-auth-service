import "dotenv/config";
import { PrismaClient } from "@prisma/client";

import App from "./app/App.js";
import Envs from "./config/Envs.js";
import RedisClientFactory from "@adapters/config/RedisClientFactory.js";

const envs = new Envs(process.env);
const db = new PrismaClient({ datasources: { db: { url: envs.database.postgres.uri } } });
const redisClient = await RedisClientFactory.create(envs.cache.redis.url);
const app = new App(db, envs, redisClient).getApp();
const port = envs.server.port;

const server = app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`);
});
