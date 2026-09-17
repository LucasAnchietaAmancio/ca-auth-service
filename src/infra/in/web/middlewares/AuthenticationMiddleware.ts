import { timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import AuthenticationException from "@exceptions/AuthenticationException.js";

export default class AuthenticationMiddleware {
    public constructor(private readonly accessToken: string) {}

    public execute(request: Request, response: Response, next: NextFunction): void {
        try {
            const accessToken = this.extractAccessToken(request);

            if (!accessToken || !this.isValidAccessToken(accessToken)) throw new AuthenticationException("Token de acesso inválido", "INVALID_ACCESS_TOKEN", {});

            next();
        } catch (error) {
            next(error);
        }
    }

    private extractAccessToken(request: Request): string | null {
        const authorization = request.headers.authorization;
        if (typeof authorization !== "string") return null;

        const [scheme, accessToken, ...remainingParts] = authorization.trim().split(" ");
        if (scheme !== "Bearer" || !accessToken || remainingParts.length > 0) return null;

        return accessToken;
    }

    private isValidAccessToken(accessToken: string): boolean {
        const expectedToken = Buffer.from(this.accessToken);
        const receivedToken = Buffer.from(accessToken);

        return expectedToken.length === receivedToken.length
            && timingSafeEqual(expectedToken, receivedToken);
    }
}
