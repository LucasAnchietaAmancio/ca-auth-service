import { Router } from "express";
import type { PrismaClient } from "@prisma/client";
import CreateCompanyControllerFactory from "@factories/CreateCompanyControllerFactory.js";
import CreateCompanyController from "@controllers/CreateCompanyController.js";
import GenerateSessionControllerFactory from "@factories/GenerateSessionControllerFactory.js";
import GenerateSessionController from "@controllers/GenerateSessionController.js";
import type Envs from "@config/Envs.js";
import type { RedisClientType } from "redis";
import SessionRequestRateLimitMiddlewareFactory from "@factories/SessionRequestRateLimitMiddlewareFactory.js";
import RateLimitMiddleware from "@middlewares/RateLimitMiddleware.js";

export default class CompanyRoute {
    private readonly router: Router;
    private readonly createCompanyController: CreateCompanyController;
    private readonly generateSessionController: GenerateSessionController;
    private readonly sessionRequestRateLimitMiddleware: RateLimitMiddleware;

    public constructor(private readonly db: PrismaClient, envs: Envs, redisClient: RedisClientType) {
        this.router = Router();
        this.createCompanyController = CreateCompanyControllerFactory.create(this.db, envs);
        this.generateSessionController = GenerateSessionControllerFactory.create(this.db, envs, redisClient);
        this.sessionRequestRateLimitMiddleware = SessionRequestRateLimitMiddlewareFactory.create(redisClient, envs);
    }

    public registerRoutes(): Router {
        this.router.post("/companies",this.createCompanyController.execute.bind(this.createCompanyController));
        this.router.post(
            "/companies/:companyId/sessions",
            this.sessionRequestRateLimitMiddleware.execute.bind(this.sessionRequestRateLimitMiddleware),
            this.generateSessionController.execute.bind(this.generateSessionController),
        );
        return this.router;
    }
}
