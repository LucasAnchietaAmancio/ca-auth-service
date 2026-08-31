import type CreateCompanyDto from "@dto/CreateCompanyDto.js";
import CompanyEntity from "@domain/entities/CompanyEntity.js";

export default interface CreateCompanyUseCasePort {
    execute(dto: CreateCompanyDto): Promise<CompanyEntity>;
}