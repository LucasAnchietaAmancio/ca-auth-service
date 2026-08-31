import type CreateCompanyDto from "@dto/CreateCompanyDto.js";

export default interface CreateCompanyUseCasePort {
    execute(dto: CreateCompanyDto): Promise<string>;
}