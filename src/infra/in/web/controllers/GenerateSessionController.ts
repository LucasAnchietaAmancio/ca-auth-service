import type GenerateSessionUseCasePort from "@ports/in/GenerateSessionUseCasePort.js";
import InvalidInputParams from "@exceptions/InvalidInputParams.js";
import type { NextFunction, Request, Response } from "express";

export default class GenerateSessionController {
    public constructor(private readonly generateSessionUseCase: GenerateSessionUseCasePort) {}

    public async execute(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const { companyId } = request.params;
            if (typeof companyId !== "string" || !companyId.trim()) throw new InvalidInputParams("companyId é obrigatório", "INVALID_INPUT");

            const session = await this.generateSessionUseCase.execute({ companyId: companyId.trim() });
            response.status(201).json({ success: true, payload: { sessionId: session.sessionId }});
        } catch (error) {
            next(error);
        }
    }
}
