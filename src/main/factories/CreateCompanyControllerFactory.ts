import CreateCompanyController from "@controllers/CreateCompanyController.js";
import CreateCompanyUseCase from "@use-cases/CreateCompanyUseCase.js";
import PostgresCompanyRepository from "@adapters/database/repositories/PostgresCompanyRepository.js";
import type { PrismaClient } from "@prisma/client";

export default class CreateCompanyControllerFactory {
  public static create(db: PrismaClient): CreateCompanyController {

    const companyRepository = new PostgresCompanyRepository(db);
    const createCompanyUseCase = new CreateCompanyUseCase(companyRepository);

    return new CreateCompanyController(createCompanyUseCase);
  }
}