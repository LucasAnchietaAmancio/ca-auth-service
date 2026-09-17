import { jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import RateLimitMiddleware from "@middlewares/RateLimitMiddleware.js";
import type RateLimiterAdapterPort from "@ports/out/RateLimiterAdapterPort.js";
import RateLimitException from "@exceptions/RateLimitException.js";

describe("RateLimitMiddleware", () => {
    it("deve permitir a requisição quando o limite não foi excedido", async () => {
        const rateLimiterAdapter: jest.Mocked<RateLimiterAdapterPort> = {
            consume: jest.fn<RateLimiterAdapterPort["consume"]>(),
        };
        const middleware = new RateLimitMiddleware(rateLimiterAdapter);
        const next = jest.fn() as NextFunction;

        await middleware.execute({ ip: "127.0.0.1" } as Request, {} as Response, next);

        expect(rateLimiterAdapter.consume).toHaveBeenCalledWith("ip:127.0.0.1");
        expect(next).toHaveBeenCalledWith();
    });

    it("deve encaminhar o erro quando o limite foi excedido", async () => {
        const error = new RateLimitException("Limite excedido", "RATE_LIMIT_EXCEEDED", {});
        const rateLimiterAdapter: jest.Mocked<RateLimiterAdapterPort> = {
            consume: jest.fn<RateLimiterAdapterPort["consume"]>().mockRejectedValue(error),
        };
        const middleware = new RateLimitMiddleware(rateLimiterAdapter);
        const next = jest.fn() as NextFunction;

        await middleware.execute({ ip: "127.0.0.1" } as Request, {} as Response, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
