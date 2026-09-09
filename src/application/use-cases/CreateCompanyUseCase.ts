import type CreateCompanyUseCasePort from "@ports/in/CreateCompanyUseCasePort.js";
import type CompanyRepositoryPort from "@ports/out/CompanyRepositoryPort.js";
import type CryptoHashAdapterPort from "@ports/out/CryptoHashAdapterPort.js";
import type CreateCompanyDto from "@dto/CreateCompanyDto.js";
import CompanyEntity from "@entities/CompanyEntity.js";
import UserAlreadyExists from "@exceptions/UserAlreadyExists.js";
import CryptoException from "@exceptions/CryptoException.js";

export default class CreateCompanyUseCase implements CreateCompanyUseCasePort {
    public constructor(
        private readonly companyRepository: CompanyRepositoryPort,
        private readonly cryptoAdapter: CryptoHashAdapterPort,
    ){}

    public async execute(dto: CreateCompanyDto): Promise<string> {
        const company = CompanyEntity.create(dto.companyName, dto.email, dto.password, dto.totpSecret);

        const emailUserAlreadyExists = await this.companyRepository.findByEmail(company.email);
        
        if(emailUserAlreadyExists) throw new UserAlreadyExists("Já existe um usuário com esse e-mail cadastrado", "USER_ALREADY_EXISTS", { email: company.email })

        const encryptedPassword = this.cryptoAdapter.encrypt(company.password);
        const encryptedTotpSecret = this.cryptoAdapter.encrypt(company.totpSecret);

        if (!encryptedPassword || encryptedPassword.trim().length === 0) throw new CryptoException("Falha na geração do hash da senha", "CRYPTO_GENERATION_FAILED", {});
        if (!encryptedTotpSecret || encryptedTotpSecret.trim().length === 0) throw new CryptoException("Falha na geração da criptografia do segredo TOTP", "CRYPTO_GENERATION_FAILED", {});

        company.updatePassword(encryptedPassword);
        company.updateTotpSecret(encryptedTotpSecret);

        await this.companyRepository.save(company);

        return company.companyId;
    }

}
