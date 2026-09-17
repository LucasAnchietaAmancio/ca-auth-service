import type { NextFunction, Request, Response } from "express";
import type RateLimiterAdapterPort from "@ports/out/RateLimiterAdapterPort.js";

export default class RateLimitMiddleware {
    public constructor(private readonly rateLimiterAdapter: RateLimiterAdapterPort) {}

    public async execute(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            await this.rateLimiterAdapter.consume(`ip:${request.ip}`);
            
            next();
        } catch (error) {
            next(error);
        }
    }
}
