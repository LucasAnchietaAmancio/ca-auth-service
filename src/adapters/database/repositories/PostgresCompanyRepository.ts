import CompanyEntity from "@domain/entities/CompanyEntity.js";
import type CompanyRepositoryPort from "@ports/out/CompanyRepositoryPort.js";
import type { PrismaClient } from "@prisma/client";
import DatabaseException from "@exceptions/DatabaseException.js"

export default class PostgresCompanyRepository implements CompanyRepositoryPort {
    public constructor(
        private readonly db: PrismaClient,
    ) {}

    public async findById(companyId: string): Promise<CompanyEntity | null> {

        try {
            const company = await this.db.company.findUnique({where: { id: companyId }}); 
            
            return company ? CompanyEntity.restore(
                company.companyId,
                company.companyName,    
                company.email,
                company.password,
            ): null;
        } catch(err) {
            throw new DatabaseException("Ocorreu um erro ao realizar a busca por id", "DATABASE_EXCEPTION", {})
        }
    }

    public async findByEmail(email: string): Promise<CompanyEntity | null> {

        try {
            const company = await this.db.company.findUnique({where: { email: email }}); 
            
            return company ? CompanyEntity.restore(
                company.companyId,
                company.companyName,    
                company.email,
                company.password,
            ): null;
        } catch(err) {
            throw new DatabaseException("Ocorreu um erro ao realizar a busca por id", "DATABASE_EXCEPTION", {})
        }
    }

    public async save(company: CompanyEntity): Promise<void> {

        try {
            await this.db.company.create({
                data: {
                    id: company.companyId,
                    companyName: company.companyName,
                    email: company.email,
                    password: company.password,
                },
            });
        } catch(err) {
            throw new DatabaseException("Ocorreu um erro ao tentar salvar a empresa", "DATABASE_EXCEPTION", {})
        }
    }
}