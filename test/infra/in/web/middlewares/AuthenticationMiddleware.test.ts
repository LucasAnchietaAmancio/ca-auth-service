import { jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import AuthenticationMiddleware from "@middlewares/AuthenticationMiddleware.js";
import AuthenticationException from "@exceptions/AuthenticationException.js";

describe("AuthenticationMiddleware", () => {
    const accessToken = "a-long-access-token";

    it("deve permitir uma requisição com Bearer token válido", () => {
        const middleware = new AuthenticationMiddleware(accessToken);
        const next = jest.fn() as NextFunction;

        middleware.execute(requestWithAuthorization(`Bearer ${accessToken}`), {} as Response, next);

        expect(next).toHaveBeenCalledWith();
    });

    it("deve rejeitar uma requisição sem Bearer token", () => {
        const middleware = new AuthenticationMiddleware(accessToken);
        const next = jest.fn() as NextFunction;

        middleware.execute(requestWithAuthorization(undefined), {} as Response, next);

        expect(next).toHaveBeenCalledWith(expect.any(AuthenticationException));
    });

    it("deve rejeitar uma requisição com token inválido", () => {
        const middleware = new AuthenticationMiddleware(accessToken);
        const next = jest.fn() as NextFunction;

        middleware.execute(requestWithAuthorization("Bearer invalid-token"), {} as Response, next);

        expect(next).toHaveBeenCalledWith(expect.any(AuthenticationException));
    });
});

function requestWithAuthorization(authorization: string | undefined): Request {
    return { headers: { authorization } } as Request;
}
