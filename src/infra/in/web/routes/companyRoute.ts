import { Router } from "express";
import type { PrismaClient } from "@prisma/client";
import CreateCompanyControllerFactory from "@factories/CreateCompanyControllerFactory.js";
import CreateCompanyController from "@controllers/CreateCompanyController.js";

export default class CompanyRoute {
    private readonly router: Router;
    private readonly createCompanyController: CreateCompanyController;

    public constructor(private readonly db: PrismaClient) {
        this.router = Router();
        this.createCompanyController = CreateCompanyControllerFactory.create(this.db);
    }

    public registerRoutes(): Router {
        this.router.post("/companies",this.createCompanyController.execute.bind(this.createCompanyController));
        return this.router;
    }
}