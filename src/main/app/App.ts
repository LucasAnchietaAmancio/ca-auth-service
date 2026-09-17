import express, { type Express } from "express";
import type { PrismaClient } from "@prisma/client";
import CompanyRoute from "@routes/CompanyRoute.js";
import GlobalErrorMiddleware from "@middlewares/GlobalErrorMiddleware.js";
import type Envs from "@config/Envs.js";
import type { RedisClientType } from "redis";

export default class App {
    private readonly app: Express;

    public constructor(db: PrismaClient, envs: Envs, redisClient: RedisClientType) {
        this.app = express();
        this.app.use(express.json());

        const companyRoute = new CompanyRoute(db, envs, redisClient);
        this.app.use("/v1", companyRoute.registerRoutes());
        this.app.use(GlobalErrorMiddleware.handle.bind(GlobalErrorMiddleware));
    }

    public getApp(): Express {
        return this.app;
    }
}
