import InvalidEmailException from "@exceptions/InvalidEmailException.js";

export default class EmailValueObject {
    private static readonly regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    private constructor(
        private value: string,
    ){}

    public static isValidEmail(email: string): boolean {
        return this.regex.test(email);
    }

    public getValue(): string {
        return this.value;
    }

    public static create(email: string): EmailValueObject {
        if(!this.isValidEmail(email.trim().toLowerCase())) throw new InvalidEmailException("E-mail fornecido é inválido", "INVALID_EMAIL", { email });
        return new EmailValueObject(email.trim().toLowerCase());
    }

    public static restore(email: string): EmailValueObject {
        if(!this.isValidEmail(email.trim().toLowerCase())) throw new InvalidEmailException("E-mail fornecido é invalida para o processo de restauração de entidade", "INVALID_EMAIL", { email });
        return new EmailValueObject(email.trim().toLowerCase());
    }
}
