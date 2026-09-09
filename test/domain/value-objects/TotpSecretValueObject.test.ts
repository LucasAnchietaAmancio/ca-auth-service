import TotpSecretValueObject from "@value-objects/TotpSecretValueObject.js";
import InvalidTotpException from "@exceptions/InvalidTotpException.js";

describe("TotpSecretValueObject", () => {
    it("Deve aceitar um segredo TOTP Base32 válido", () => {
        const secret = TotpSecretValueObject.create("JBSWY3DPEBLW64TMMQQQ");

        expect(secret.getValue()).toBe("JBSWY3DPEBLW64TMMQQQ");
        expect(secret.isEncrypted()).toBe(false);
    });

    it("Deve rejeitar um segredo TOTP inválido", () => {
        expect(() => TotpSecretValueObject.create("segredo-invalido")).toThrow(InvalidTotpException);
    });

    it("Deve restaurar um segredo TOTP criptografado", () => {
        const secret = TotpSecretValueObject.restoreEncrypted("encrypted_totp_secret");

        expect(secret.getValue()).toBe("encrypted_totp_secret");
        expect(secret.isEncrypted()).toBe(true);
    });
});
