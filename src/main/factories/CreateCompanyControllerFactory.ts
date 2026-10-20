import CreateCompanyController from "@controllers/CreateCompanyController.js";
import CreateCompanyUseCase from "@use-cases/CreateCompanyUseCase.js";
import PostgresCompanyRepository from "@adapters/database/repositories/PostgresCompanyRepository.js";
import CryptoHashAdapter from "@adapters/hash/CryptoEncryptAdapter.js";
import type { PrismaClient } from "@prisma/client";
import type Envs from "@config/Envs.js";

export default class CreateCompanyControllerFactory {
  public static create(db: PrismaClient, envs: Envs): CreateCompanyController {

    const companyRepository = new PostgresCompanyRepository(db);
    const cryptoAdapter = new CryptoHashAdapter(envs.crypto.secretKey);
    const createCompanyUseCase = new CreateCompanyUseCase(companyRepository, cryptoAdapter);

    return new CreateCompanyController(createCompanyUseCase);
  }
}
