import type CreateCompanyUseCasePort from "@ports/in/CreateCompanyUseCasePort.js";
import type { Request, Response, NextFunction } from "express";
import InvalidInputParams from "@domain/exceptions/InvalidInputParams.js";

export default class CreateCompanyController {
    public constructor(
        private readonly createCompanyUseCase: CreateCompanyUseCasePort
    ){}

    public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {companyName, email, password} = req.body ?? {};
    
            if (typeof companyName !== "string" || !companyName.trim()|| typeof email !== "string" || !email.trim()|| typeof password !== "string" || !password.trim()) {
                throw new InvalidInputParams("Dados obrigatórios para a requisição não enviados", "INVALID_INPUT");
            }

            const companyId = await this.createCompanyUseCase.execute({
                companyName: companyName.trim(),
                email: email.trim(),
                password,
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
