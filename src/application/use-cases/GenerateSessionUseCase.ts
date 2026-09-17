import type GenerateSessionUseCasePort from "@ports/in/GenerateSessionUseCasePort.js";
import SessionEntity from "@entities/SessionEntity.js";
import type ContaAzulAuthAdapterPort from "@ports/out/ContaAzulAuthAdapterPort.js";
import type CompanyRepositoryPort from "@ports/out/CompanyRepositoryPort.js";
import type GenerateSessionDto from "@dto/GenerateSessionDto.js";
import CompanyNotFoundError from "@exceptions/CompanyNotFoundError.js";
import type EncryptAdapterPort from "@ports/out/EncryptAdapterPort.js";
import type SessionCacheAdapterPort from "@ports/out/SessionCacheAdapterPort.js";

export default class GenerateSessionUseCase implements GenerateSessionUseCasePort {
    public constructor(
        private readonly puppeteerContaAzulAuthAdapter: ContaAzulAuthAdapterPort,
        private readonly companyRepository: CompanyRepositoryPort,
        private readonly cryptoAdapter: EncryptAdapterPort,
        private readonly sessionCacheAdapter: SessionCacheAdapterPort
    ){}

    public async execute(dto: GenerateSessionDto): Promise<SessionEntity> {

        const company = await this.companyRepository.findById(dto.companyId);

        if(!company) throw new CompanyNotFoundError("Empresa não encontrada durante a busca", "NOT_FOUND", { companyId: dto.companyId });

        const cachedSession = await this.sessionCacheAdapter.findByCompanyId(dto.companyId);
        console.log(cachedSession);
        if(cachedSession && !cachedSession.isExpired()) {
            return cachedSession;
        }

        const password = this.cryptoAdapter.decrypt(company.password);
        const totpSecret = this.cryptoAdapter.decrypt(company.totpSecret);

        const authenticationResult = await this.puppeteerContaAzulAuthAdapter.execute(company.email, password, totpSecret);

        const session = SessionEntity.create(
            authenticationResult.accessToken,
            authenticationResult.expiresAt,
        );

        await this.sessionCacheAdapter.save(dto.companyId, session);
        
        return session;
    }
}
