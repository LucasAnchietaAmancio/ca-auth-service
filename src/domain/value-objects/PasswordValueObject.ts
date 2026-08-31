import InvalidPasswordException from "@exceptions/InvalidPasswordException.js";

export default class PasswordValueObject {
    private static readonly regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    
    private constructor(
        private value: string,
    ){}

    public static isValidPassword(password: string): boolean {
        if(password.length < 8) return false;
        return this.regex.test(password);
    }

    public getValue(): string {
        return this.value;
    }

    public static create(password: string): PasswordValueObject {
        if(!this.isValidPassword(password)) throw new InvalidPasswordException("Senha fornecida é inválida", "INVALID_PASSWORD", {});
        return new PasswordValueObject(password);
    }
}