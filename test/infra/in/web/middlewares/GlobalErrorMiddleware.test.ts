import { jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";

import GlobalErrorMiddleware from "../../../../../src/infra/in/web/middlewares/GlobalErrorMiddleware.js";
import CompanyNotFoundError from "@exceptions/CompanyNotFoundError.js";
import DatabaseException from "@exceptions/DatabaseException.js";
import InvalidInputParams from "@exceptions/InvalidInputParams.js";

describe("GlobalErrorMiddleware", () => {
    it("Deve converter um erro de entrada inválida em HTTP 400", () => {
        const response = createResponse();

        GlobalErrorMiddleware.handle(
            new InvalidInputParams("Dados inválidos", "INVALID_INPUT"),
            {} as Request,
            response as unknown as Response,
            jest.fn() as NextFunction,
        );

        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledWith({
            success: false,
            error: { code: "INVALID_INPUT", message: "Dados inválidos" },
        });
    });

    it("Deve converter empresa não encontrada em HTTP 404", () => {
        const response = createResponse();

        GlobalErrorMiddleware.handle(
            new CompanyNotFoundError("Empresa não encontrada", "NOT_FOUND", {}),
            {} as Request,
            response as unknown as Response,
            jest.fn() as NextFunction,
        );

        expect(response.status).toHaveBeenCalledWith(404);
    });

    it("Deve converter email duplicado em HTTP 409", () => {
        const response = createResponse();

        GlobalErrorMiddleware.handle(
            new DatabaseException("E-mail duplicado", "DUPLICATE_EMAIL", {}),
            {} as Request,
            response as unknown as Response,
            jest.fn() as NextFunction,
        );

        expect(response.status).toHaveBeenCalledWith(409);
    });

    it("Deve converter erro desconhecido em HTTP 500", () => {
        const response = createResponse();

        GlobalErrorMiddleware.handle(
            new Error("Erro interno"),
            {} as Request,
            response as unknown as Response,
            jest.fn() as NextFunction,
        );

        expect(response.status).toHaveBeenCalledWith(500);
        expect(response.json).toHaveBeenCalledWith({
            success: false,
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Ocorreu um erro interno no servidor",
            },
        });
    });
});

function createResponse(): jest.Mocked<Pick<Response, "status" | "json">> {
    const response = {
        status: jest.fn(),
        json: jest.fn(),
    };

    response.status.mockReturnValue(response as unknown as Response);

    return response as jest.Mocked<Pick<Response, "status" | "json">>;
}
