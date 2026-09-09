import CompanyEntity from "@entities/CompanyEntity.js";

export default interface CompanyRepositoryPort {
    findById(companyId: string): Promise<CompanyEntity | null>;
    findByEmail(email: string): Promise<CompanyEntity | null>;
    save(company: CompanyEntity): Promise<void>;
}