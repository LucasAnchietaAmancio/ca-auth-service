import EmailValueObject from "@value-objects/EmailValueObject.js";
import PasswordValueObject from "@value-objects/PasswordValueObject.js";
import TotpSecretValueObject from "@value-objects/TotpSecretValueObject.js";

export default class CompanyEntity {
    private constructor(
        private readonly _companyId: string,
        public readonly _companyName: string,
        private  _email: EmailValueObject,
        private  _password: PasswordValueObject,
        private _totpSecret: TotpSecretValueObject
    ){}

    public static create(companyName: string, email: string, password: string, totpSecret: string): CompanyEntity {
        return new CompanyEntity(crypto.randomUUID(), companyName, EmailValueObject.create(email), PasswordValueObject.create(password), TotpSecretValueObject.create(totpSecret));
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

    public get totpSecret(): string {
        return this._totpSecret.getValue();
    }

    public updatePassword(encryptedPassword: string): void {
        this._password = PasswordValueObject.restoreEncrypted(encryptedPassword);
    }

    public updateTotpSecret(encryptedTotpSecret: string): void {
        this._totpSecret = TotpSecretValueObject.restoreEncrypted(encryptedTotpSecret);
    }

    public static restore(companyId: string, companyName: string, email: string, encryptedPassword: string, encryptedTotpSecret: string): CompanyEntity {
        return new CompanyEntity(companyId, companyName, EmailValueObject.restore(email), PasswordValueObject.restoreEncrypted(encryptedPassword), TotpSecretValueObject.restoreEncrypted(encryptedTotpSecret));
    }

}
