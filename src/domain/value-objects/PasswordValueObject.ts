import InvalidPasswordException from "@exceptions/InvalidPasswordException.js";

export default class PasswordValueObject {
    private static readonly regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    
    private constructor(
        private value: string,
        private readonly encrypted: boolean,
    ){}

    public static isValidPassword(password: string): boolean {
        if(password.length < 8) return false;
        return this.regex.test(password);
    }

    public getValue(): string {
        return this.value;
    }

    public isEncrypted(): boolean {
        return this.encrypted;
    }

    public static create(password: string): PasswordValueObject {
        if(!this.isValidPassword(password)) throw new InvalidPasswordException("Senha fornecida é inválida", "INVALID_PASSWORD", {});
        return new PasswordValueObject(password, false);
    }

    public static restoreEncrypted(encryptedPassword: string): PasswordValueObject {
        if (!encryptedPassword || encryptedPassword.trim().length === 0) {
            throw new InvalidPasswordException("Senha criptografada inválida para o processo de restauração de entidade", "INVALID_ENCRYPTED_PASSWORD", {});
        }

        return new PasswordValueObject(encryptedPassword, true);
    }
}
