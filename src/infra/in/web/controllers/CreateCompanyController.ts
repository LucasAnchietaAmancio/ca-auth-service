import type CreateCompanyUseCasePort from "@ports/in/CreateCompanyUseCasePort.js";
import type { Request, Response, NextFunction } from "express";
import InvalidInputParams from "@exceptions/InvalidInputParams.js";

export default class CreateCompanyController {
    public constructor(
        private readonly createCompanyUseCase: CreateCompanyUseCasePort
    ){}

    public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {companyName, email, password, totpSecret} = req.body ?? {};
    
            if (typeof companyName !== "string" || !companyName.trim()|| typeof email !== "string" || !email.trim()|| typeof password !== "string" || !password.trim() || typeof totpSecret !== "string" || !totpSecret.trim()) {
                throw new InvalidInputParams("Dados obrigatórios para a requisição não enviados", "INVALID_INPUT");
            }

            const companyId = await this.createCompanyUseCase.execute({
                companyName: companyName.trim(),
                email: email.trim(),
                password,
                totpSecret: totpSecret.trim()
            });

            res.status(201).json({ 
                success: true,
                payload: {
                    companyId: companyId
                }
            });

        } catch(err) {
            next(err)
        }
    }
}
