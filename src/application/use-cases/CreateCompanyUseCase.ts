import type CreateCompanyUseCasePort from "@ports/in/CreateCompanyUseCasePort.js";
import type CompanyRepositoryPort from "@ports/out/CompanyRepositoryPort.js";
import type CreateCompanyDto from "@dto/CreateCompanyDto.js";
import CompanyEntity from "@domain/entities/CompanyEntity.js";
import UserAlreadyExists from "@exceptions/UserAlreadyExists.js";

export default class CreateCompanyUseCase implements CreateCompanyUseCasePort {
    public constructor(
        private readonly companyRepository: CompanyRepositoryPort,
    ){}

    public async execute(dto: CreateCompanyDto): Promise<string> {

        const userAlready = await this.companyRepository.findByEmail(dto.email);
        
        if(userAlready) throw new UserAlreadyExists("Já existe um usuário com esse e-mail cadastrado", "USER_ALREADY_EXISTS", { email: dto.email })

        const company = CompanyEntity.create(dto.companyName, dto.email, dto.password);

        await this.companyRepository.save(company);

        return company.companyId;
    }

}