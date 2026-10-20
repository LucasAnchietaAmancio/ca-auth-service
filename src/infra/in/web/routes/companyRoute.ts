import { Router } from "express";
import type { PrismaClient } from "@prisma/client";
import CreateCompanyControllerFactory from "@factories/CreateCompanyControllerFactory.js";
import CreateCompanyController from "@controllers/CreateCompanyController.js";
import GenerateSessionControllerFactory from "@factories/GenerateSessionControllerFactory.js";
import GenerateSessionController from "@controllers/GenerateSessionController.js";
import type Envs from "@config/Envs.js";
import type { RedisClientType } from "redis";

export default class CompanyRoute {
    private readonly router: Router;
    private readonly createCompanyController: CreateCompanyController;
    private readonly generateSessionController: GenerateSessionController;

    public constructor(private readonly db: PrismaClient, envs: Envs, redisClient: RedisClientType) {
        this.router = Router();
        this.createCompanyController = CreateCompanyControllerFactory.create(this.db, envs);
        this.generateSessionController = GenerateSessionControllerFactory.create(this.db, envs, redisClient);
    }

    public registerRoutes(): Router {
        this.router.post("/companies",this.createCompanyController.execute.bind(this.createCompanyController));
        this.router.post("/companies/:companyId/sessions", this.generateSessionController.execute.bind(this.generateSessionController));
        return this.router;
    }
}
