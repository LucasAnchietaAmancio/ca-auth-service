import InvalidTotpException from "@exceptions/InvalidTotpException.js";

export default class TotpSecretValueObject {
    private static readonly regex = /^[A-Z2-7]+=*$/;
    private constructor(
        private value: string,
        private readonly encrypted: boolean,
    ){}

    public static isValidTotpSecret(totpSecret: string): boolean {
        if(totpSecret.length < 16) return false;
        return this.regex.test(totpSecret);
    }

    public getValue(): string {
        return this.value;
    }

    public isEncrypted(): boolean {
        return this.encrypted;
    }

    public static create(totpSecret: string): TotpSecretValueObject {
        if(!this.isValidTotpSecret(totpSecret)) throw new InvalidTotpException("Segredo TOTP fornecido é inválido", "INVALID_TOTP_SECRET", {});
        return new TotpSecretValueObject(totpSecret, false);
    }

    public static restoreEncrypted(encryptedTotpSecret: string): TotpSecretValueObject {
        if (!encryptedTotpSecret || encryptedTotpSecret.trim().length === 0) {
            throw new InvalidTotpException("Segredo TOTP criptografado inválido", "INVALID_ENCRYPTED_TOTP_SECRET", {});
        }

        return new TotpSecretValueObject(encryptedTotpSecret, true);
    }
}
