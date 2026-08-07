
export default class CompanyEntity {
    public constructor(
        private readonly _companyId: string,
        public readonly companyName: string,
        private  _email: string,
        private  _hashedPassword: string,
    ){}

    public static create(companyName: string, email: string, hashedPassword: string): CompanyEntity {
        return new CompanyEntity(crypto.randomUUID(), companyName, email, hashedPassword);
    }

    public get companyId(): string {
        return this._companyId;
    }

    public get email(): string {
        return this._email;
    }

    public get hashedPassword(): string {
        return this._hashedPassword;
    }
}