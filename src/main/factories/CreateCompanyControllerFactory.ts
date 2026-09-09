import CreateCompanyController from "@controllers/CreateCompanyController.js";
import CreateCompanyUseCase from "@use-cases/CreateCompanyUseCase.js";
import PostgresCompanyRepository from "@adapters/database/repositories/PostgresCompanyRepository.js";
import CryptoHashAdapter from "@adapters/hash/CryptoHashAdapter.js";
import type { PrismaClient } from "@prisma/client";

export default class CreateCompanyControllerFactory {
  public static create(db: PrismaClient): CreateCompanyController {

    const companyRepository = new PostgresCompanyRepository(db);
    const cryptoAdapter = new CryptoHashAdapter(process.env.SECRET_KEY || "");
    const createCompanyUseCase = new CreateCompanyUseCase(companyRepository, cryptoAdapter);

    return new CreateCompanyController(createCompanyUseCase);
  }
}