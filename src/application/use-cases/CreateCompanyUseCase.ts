import type CreateCompanyUseCasePort from "@ports/in/CreateCompanyUseCasePort.js";
import type CompanyRepositoryPort from "@ports/out/CompanyRepositoryPort.js";
import type HashAdapterPort from "@ports/out/HashAdapterPort.js";
import type CreateCompanyDto from "@dto/CreateCompanyDto.js";
import CompanyEntity from "@domain/entities/CompanyEntity.js";

export default class CreateCompanyUseCase implements CreateCompanyUseCasePort {
    public constructor(
        private readonly companyRepository: CompanyRepositoryPort,
        private readonly hashAdapter: HashAdapterPort
    ){}

    public async execute(dto: CreateCompanyDto): Promise<CompanyEntity> {
        const hashedPassword = await this.hashAdapter.execute(dto.password);
        const company = CompanyEntity.create(dto.companyName, dto.email, hashedPassword);
        return await this.companyRepository.save(company);
    }

}