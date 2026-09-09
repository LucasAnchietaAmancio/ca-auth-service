import type GenerateSessionUseCasePort from "@ports/in/GenerateSessionUseCasePort.js";
import SessionEntity from "@entities/SessionEntity.js";
import type ContaAzulPuppeteerAuthAdapterPort from "@ports/out/ContaAzulPuppeteerAuthAdapterPort.js";
import type CompanyRepositoryPort from "@ports/out/CompanyRepositoryPort.js";
import type GenerateSessionDto from "@dto/GenerateSessionDto.js";
import CompanyNotFoundError from "@exceptions/CompanyNotFoundError.js";
import type CryptoHashAdapterPort from "@ports/out/CryptoHashAdapterPort.js";

export default class GenerateSessionUseCase implements GenerateSessionUseCasePort {
    public constructor(
        private readonly contaAzulPuppeteerAuthAdapter: ContaAzulPuppeteerAuthAdapterPort,
        private readonly companyRepository: CompanyRepositoryPort,
        private readonly cryptoAdapter: CryptoHashAdapterPort,
    ){}

    public async execute(dto: GenerateSessionDto): Promise<SessionEntity> {

        const company = await this.companyRepository.findById(dto.companyId);

        if(!company) throw new CompanyNotFoundError("Empresa não encontrada durante a busca", "NOT_FOUND", { companyId: dto.companyId });

        const password = this.cryptoAdapter.decrypt(company.password);
        const totpSecret = this.cryptoAdapter.decrypt(company.totpSecret);
        const authenticationResult = await this.contaAzulPuppeteerAuthAdapter.execute(company.email, password, totpSecret);

        return SessionEntity.create(
            authenticationResult.accessToken,
        )   
    }
}
