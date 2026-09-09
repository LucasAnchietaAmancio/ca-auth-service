import type { PrismaClient } from "@prisma/client";
import GenerateSessionController from "@controllers/GenerateSessionController.js";
import GenerateSessionUseCase from "@use-cases/GenerateSessionUseCase.js";
import PostgresCompanyRepository from "@adapters/database/repositories/PostgresCompanyRepository.js";
import CryptoHashAdapter from "@adapters/hash/CryptoHashAdapter.js";
import OtplibTotpAdapter from "@adapters/auth/OtplibTotpAdapter.js";
import ContaAzulPuppeteerAuthAdapter from "@adapters/auth/ContaAzulPuppeteerAuthAdapter.js";

export default class GenerateSessionControllerFactory {
    public static create(db: PrismaClient): GenerateSessionController {
        const companyRepository = new PostgresCompanyRepository(db);
        const cryptoAdapter = new CryptoHashAdapter(process.env.SECRET_KEY || "");
        const totpAdapter = new OtplibTotpAdapter();
        const contaAzulAdapter = new ContaAzulPuppeteerAuthAdapter(totpAdapter);
        const useCase = new GenerateSessionUseCase(contaAzulAdapter, companyRepository, cryptoAdapter);

        return new GenerateSessionController(useCase);
    }
}
