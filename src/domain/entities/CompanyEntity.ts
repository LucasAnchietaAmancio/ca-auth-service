import EmailValueObject from "@domain/value-objects/EmailValueObject.js";
import PasswordValueObject from "@domain/value-objects/PasswordValueObject.js";

export default class CompanyEntity {
    private constructor(
        private readonly _companyId: string,
        public readonly _companyName: string,
        private  _email: EmailValueObject,
        private  _password: PasswordValueObject,
    ){}

    public static create(companyName: string, email: string, password: string): CompanyEntity {
        return new CompanyEntity(crypto.randomUUID(), companyName, EmailValueObject.create(email), PasswordValueObject.create(password));
    }

    public get companyId(): string {
        return this._companyId;
    }

    public get email(): string {
        return this._email.getValue();
    }

    public get password(): string {
        return this._password.getValue();
    }

    public get companyName(): string {
        return this._companyName;
    }

    public static restore(companyId: string, companyName: string, email: string, password: string): CompanyEntity {
        return new CompanyEntity(companyId, companyName, EmailValueObject.restore(email), PasswordValueObject.restore(password));
    }

}