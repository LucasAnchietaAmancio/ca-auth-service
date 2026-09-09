import CompanyEntity from "@entities/CompanyEntity.js";
import type CompanyRepositoryPort from "@ports/out/CompanyRepositoryPort.js";
import type { PrismaClient } from "@prisma/client";
import DatabaseException from "@exceptions/DatabaseException.js"

export default class PostgresCompanyRepository implements CompanyRepositoryPort {
    public constructor(
        private readonly db: PrismaClient,
    ) {}

    public async findById(companyId: string): Promise<CompanyEntity | null> {

        try {
            const company = await this.db.company.findUnique({where: { companyId: companyId }}); 
            
            return company ? CompanyEntity.restore(
                company.companyId,
                company.companyName,    
                company.email,
                company.password,
                company.totpSecret
            ): null;
        } catch(err) {
            throw new DatabaseException("Ocorreu um erro ao realizar a busca por id", "DATABASE_EXCEPTION", { originalError: err instanceof Error ? err.message : "Erro desconhecido" })
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
                company.totpSecret
            ): null;
        } catch(err) {
            throw new DatabaseException("Ocorreu um erro ao realizar a busca por e-mail", "DATABASE_EXCEPTION", { originalError: err instanceof Error ? err.message : "Erro desconhecido" })
        }
    }

    public async save(company: CompanyEntity): Promise<void> {

        try {
            await this.db.company.create({
                data: {
                    companyId: company.companyId,
                    companyName: company.companyName,
                    email: company.email,
                    password: company.password,
                    totpSecret: company.totpSecret
                },
            });
        } catch(err) {
            if(typeof err === "object" && err !== null && "code" in err && err.code === "P2002") throw new DatabaseException("Já existe uma empresa cadastrada com o e-mail fornecido", "DUPLICATE_EMAIL", {originalError: err})
            throw new DatabaseException("Ocorreu um erro ao tentar salvar a empresa", "DATABASE_EXCEPTION", { originalError: err instanceof Error ? err.message : "Erro desconhecido"})
        }
    }
}
