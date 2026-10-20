import CryptoHashAdapter from "@adapters/hash/CryptoEncryptAdapter.js";
import CryptoException from "@exceptions/CryptoException.js";

describe("CryptoHashAdapter", () => {
    const secretKey = "super-secret-key-for-testing-purposes-very-long";

    it("Deve criptografar um valor com sucesso", () => {
        const adapter = new CryptoHashAdapter(secretKey);
        const valueToEncrypt = "sensitive-data";
        const encrypted = adapter.encrypt(valueToEncrypt);
        expect(encrypted).toBeDefined();
        expect(encrypted).not.toBe(valueToEncrypt);
        expect(typeof encrypted).toBe("string");
    });

    it("Deve descriptografar um valor criptografado com sucesso", () => {
        const adapter = new CryptoHashAdapter(secretKey);
        const originalValue = "sensitive-data";
        const encrypted = adapter.encrypt(originalValue);
        const decrypted = adapter.decrypt(encrypted);
        expect(decrypted).toBe(originalValue);
    });

    it("Deve lançar CryptoException ao descriptografar valor inválido", () => {
        const adapter = new CryptoHashAdapter(secretKey);
        expect(() => adapter.decrypt("invalid-encrypted-value-that-is-not-valid")).toThrow(CryptoException);
    });

    it("Deve lançar CryptoException quando tentando encriptar valor vazio", () => {
        const adapter = new CryptoHashAdapter(secretKey);
        expect(() => adapter.encrypt("")).toThrow(CryptoException);
    });

    it("Deve lançar CryptoException quando tentando descriptografar valor vazio", () => {
        const adapter = new CryptoHashAdapter(secretKey);
        expect(() => adapter.decrypt("")).toThrow(CryptoException);
    });

    it("Deve lançar CryptoException quando secretKey não é fornecida", () => {
        expect(() => new CryptoHashAdapter("")).toThrow(CryptoException);
    });

    it("Deve criptografar e descriptografar email", () => {
        const adapter = new CryptoHashAdapter(secretKey);
        const email = "empresa@teste.com";
        const encrypted = adapter.encrypt(email);
        const decrypted = adapter.decrypt(encrypted);
        expect(decrypted).toBe(email);
    });

    it("Deve criptografar e descriptografar senha", () => {
        const adapter = new CryptoHashAdapter(secretKey);
        const password = "Senha!@Forte123";
        const encrypted = adapter.encrypt(password);
        const decrypted = adapter.decrypt(encrypted);
        expect(decrypted).toBe(password);
    });

    it("Deve falhar ao descriptografar com secretKey diferente", () => {
        const adapter1 = new CryptoHashAdapter(secretKey);
        const adapter2 = new CryptoHashAdapter("different-secret-key-for-testing");
        const valueToEncrypt = "sensitive-data";
        const encrypted = adapter1.encrypt(valueToEncrypt);
        expect(() => adapter2.decrypt(encrypted)).toThrow(CryptoException);
    });

    it("Deve lançar CryptoException quando secretKey contém apenas espaços", () => {
        expect(() => new CryptoHashAdapter("   ")).toThrow(CryptoException);
    });
});


