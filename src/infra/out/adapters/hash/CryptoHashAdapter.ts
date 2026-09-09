import CryptoJS from "crypto-js";
import type CryptoHashAdapterPort from "@ports/out/CryptoHashAdapterPort.js";
import CryptoException from "@exceptions/CryptoException.js";

export default class CryptoHashAdapter implements CryptoHashAdapterPort {
    constructor(private readonly secretKey: string) {
        if (!secretKey || secretKey.trim().length === 0) throw new CryptoException("A SECRET_KEY não foi fornecida.", "INVALID_SECRET_KEY", {});
    }

    public encrypt(value: string): string {
        try {
            if (!value || value.trim().length === 0) throw new CryptoException("Valor para criptografia não foi fornecido.", "INVALID_VALUE", {});

            return CryptoJS.AES.encrypt(value, this.secretKey).toString();
        
        } catch (err) {
            if (err instanceof CryptoException) throw err;
            throw new CryptoException("Erro ao criptografar valor", "ENCRYPTION_FAILED", { originalError: err instanceof Error ? err.message : "Erro desconhecido" });
        }
    }

    public decrypt(encryptedValue: string): string {
        try {
            if (!encryptedValue || encryptedValue.trim().length === 0) throw new CryptoException("Valor criptografado não foi fornecido.", "INVALID_ENCRYPTED_VALUE", {});

            const bytes = CryptoJS.AES.decrypt(encryptedValue, this.secretKey);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);

            if (!decrypted) throw new CryptoException("Falha ao descriptografar valor, verifique a chave secreta", "DECRYPTION_FAILED", {});

            return decrypted;
        } catch (err) {
            if (err instanceof CryptoException) throw err;
            throw new CryptoException("Erro ao descriptografar valor", "DECRYPTION_FAILED", { originalError: err instanceof Error ? err.message : "Erro desconhecido" });
        }
    }
}
