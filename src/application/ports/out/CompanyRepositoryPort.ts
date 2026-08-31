import CompanyEntity from "@domain/entities/CompanyEntity.js";

export default interface CompanyRepositoryPort {
    findById(companyId: string): Promise<CompanyEntity | null>;
    save(company: CompanyEntity): Promise<CompanyEntity>;
}