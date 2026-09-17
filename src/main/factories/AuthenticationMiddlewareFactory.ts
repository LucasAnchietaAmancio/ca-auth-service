import type Envs from "@config/Envs.js";
import AuthenticationMiddleware from "@middlewares/AuthenticationMiddleware.js";

export default class AuthenticationMiddlewareFactory {
    public static create(envs: Envs): AuthenticationMiddleware {
        return new AuthenticationMiddleware(envs.authentication.accessToken);
    }
}
