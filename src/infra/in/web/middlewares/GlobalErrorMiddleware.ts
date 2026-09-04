import type { NextFunction, Request, Response } from "express";
import CompanyNotFoundError from "@exceptions/CompanyNotFoundError.js";
import DatabaseException from "@exceptions/DatabaseException.js";
import InvalidEmailException from "@exceptions/InvalidEmailException.js";
import InvalidInputParams from "@exceptions/InvalidInputParams.js";
import InvalidPasswordException from "@exceptions/InvalidPasswordException.js";
import UserAlreadyExists from "@exceptions/UserAlreadyExists.js";

export default class GlobalErrorMiddleware {
    public static handle(error: unknown,_request: Request,response: Response,_next: NextFunction): void {
        if (error instanceof InvalidInputParams ||error instanceof InvalidEmailException ||error instanceof InvalidPasswordException) {
            this.send(response, 400, error.tag, error.message);
            return;
        }

        if (error instanceof UserAlreadyExists) {
            this.send(response, 409, error.tag, error.message);
            return;
        }

        if (error instanceof CompanyNotFoundError) {
            this.send(response, 404, error.tag, error.message);
            return;
        }

        if (error instanceof DatabaseException) {
            const statusCode = error.tag === "DUPLICATE_EMAIL" ? 409 : 503;
            this.send(response, statusCode, error.tag, error.message);
            return;
        }

        this.send(response, 500, "INTERNAL_SERVER_ERROR", "Ocorreu um erro interno no servidor");
    }

    private static send(response: Response,statusCode: number,code: string,message: string): void {
        response.status(statusCode).json({
            success: false,
            error: {
                code,
                message,
            },
        });
    }
}
