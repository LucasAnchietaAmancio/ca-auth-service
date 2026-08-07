import type GenerateSessionUseCasePort from "@ports/in/GenerateSessionUseCasePort.js";
import SessionEntity from "@domain/entities/SessionEntity.js";
import type ContaAzulPuppeteerAuthAdapterPort from "@ports/out/ContaAzulPuppeteerAuthAdapterPort.js";
import type CompanyRepositoryPort from "@ports/out/CompanyRepositoryPort.js";
import type GenerateSessionDto from "@dto/GenerateSessionDto.js";
import CompanyNotFoundError from "@domain/exceptions/CompanyNotFoundError.js";

export default class GenerateSessionUseCase implements GenerateSessionUseCasePort {
    public constructor(
        private readonly contaAzulPuppeteerAuthAdapter: ContaAzulPuppeteerAuthAdapterPort,
        private readonly companyRepository: CompanyRepositoryPort,
    ){}

    public async execute(dto: GenerateSessionDto): Promise<SessionEntity> {

        const company = await this.companyRepository.findById(dto.companyId);

        if(!company) throw new CompanyNotFoundError("Empresa não encontrada durante a busta", "NOT_FOUND", { companyId: dto.companyId });

        const authenticationResult = await this.contaAzulPuppeteerAuthAdapter.execute(company.email, company.hashedPassword);

        return SessionEntity.create(
            authenticationResult.cookieHeader,
            authenticationResult.expiresAt,
            authenticationResult.accessToken
        )   
    }
}
