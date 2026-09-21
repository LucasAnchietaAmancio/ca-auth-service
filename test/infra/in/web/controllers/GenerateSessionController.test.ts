import { jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import GenerateSessionController from "@controllers/GenerateSessionController.js";
import type GenerateSessionUseCasePort from "@ports/in/GenerateSessionUseCasePort.js";
import InvalidInputParams from "@exceptions/InvalidInputParams.js";
import SessionEntity from "@entities/SessionEntity.js";

describe("GenerateSessionController", () => {
    it("deve solicitar uma sessão para uma empresa", async () => {
        const useCase: jest.Mocked<GenerateSessionUseCasePort> = {
            execute: jest.fn<GenerateSessionUseCasePort["execute"]>().mockResolvedValue(
                SessionEntity.restore("session-id", "access-token", 1_765_000_000),
            ),
        };
        const controller = new GenerateSessionController(useCase);
        const json = jest.fn();
        const status = jest.fn().mockReturnValue({ json });

        await controller.execute(
            { params: { companyId: " company-id " } } as unknown as Request,
            { status } as unknown as Response,
            jest.fn() as NextFunction,
        );

        expect(useCase.execute).toHaveBeenCalledWith({ companyId: "company-id" });
        expect(status).toHaveBeenCalledWith(201);
        expect(json).toHaveBeenCalledWith({
            success: true,
            payload: {
                sessionId: "session-id",
                accessToken: "access-token",
                expiresAt: 1_765_000_000,
            },
        });
    });

    it("deve rejeitar companyId inválido", async () => {
        const useCase: jest.Mocked<GenerateSessionUseCasePort> = { execute: jest.fn<GenerateSessionUseCasePort["execute"]>() };
        const next = jest.fn() as NextFunction;
        const controller = new GenerateSessionController(useCase);

        await controller.execute({ params: {} } as unknown as Request, {} as Response, next);

        expect(next).toHaveBeenCalledWith(expect.any(InvalidInputParams));
    });
});
