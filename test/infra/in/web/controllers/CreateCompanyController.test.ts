import { jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import CreateCompanyController from "../../../../../src/infra/in/web/controllers/CreateCompanyController.js";
import InvalidInputParams from "@exceptions/InvalidInputParams.js";
import type CreateCompanyUseCasePort from "@ports/in/CreateCompanyUseCasePort.js";

describe("CreateCompanyController", () => {
    it("Deve remover espaços do nome e email antes de executar o caso de uso", async () => {
        const createCompanyUseCase: jest.Mocked<CreateCompanyUseCasePort> = {
            execute: jest.fn<CreateCompanyUseCasePort["execute"]>().mockResolvedValue("company-id"),
        };
        const controller = new CreateCompanyController(createCompanyUseCase);
        const json = jest.fn();
        const status = jest.fn().mockReturnValue({ json });
        const request = {
            body: {
                companyName: "  Empresa Teste  ",
                email: "  Email@Teste.Com  ",
                password: " password!@123A ",
            },
        } as Request;
        const response = { status } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await controller.execute(request, response, next);

        expect(createCompanyUseCase.execute).toHaveBeenCalledWith({
            companyName: "Empresa Teste",
            email: "Email@Teste.Com",
            password: " password!@123A ",
        });
        expect(status).toHaveBeenCalledWith(201);
        expect(json).toHaveBeenCalledWith({
            success: true,
            payload: { companyId: "company-id" },
        });
    });

    it("Deve encaminhar erro caso os dados não sejam strings válidas", async () => {
        const createCompanyUseCase: jest.Mocked<CreateCompanyUseCasePort> = {
            execute: jest.fn<CreateCompanyUseCasePort["execute"]>(),
        };
        const controller = new CreateCompanyController(createCompanyUseCase);
        const request = {
            body: { companyName: "Empresa Teste", email: [], password: "password!@123A" },
        } as Request;
        const response = {} as Response;
        const next = jest.fn() as NextFunction;

        await controller.execute(request, response, next);

        expect(createCompanyUseCase.execute).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(expect.any(InvalidInputParams));
    });

    it("Deve encaminhar erro caso o body não seja enviado", async () => {
        const createCompanyUseCase: jest.Mocked<CreateCompanyUseCasePort> = {
            execute: jest.fn<CreateCompanyUseCasePort["execute"]>(),
        };
        const controller = new CreateCompanyController(createCompanyUseCase);
        const request = {} as Request;
        const response = {} as Response;
        const next = jest.fn() as NextFunction;

        await controller.execute(request, response, next);

        expect(createCompanyUseCase.execute).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(expect.any(InvalidInputParams));
    });
});
