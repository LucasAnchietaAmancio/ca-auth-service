import EmailValueObject from "@domain/value-objects/EmailValueObject.js";

export default class CompanyEntity {
    private constructor(
        private readonly _companyId: string,
        public readonly companyName: string,
        private  _email: EmailValueObject,
        private  hashedPassword: string,
    ){}

    public static create(companyName: string, email: string, hashedPassword: string): CompanyEntity {
        return new CompanyEntity(crypto.randomUUID(), companyName, EmailValueObject.create(email), hashedPassword);
    }

    public get companyId(): string {
        return this._companyId;
    }

    public get email(): string {
        return this._email.getValue();
    }

}