export default interface CryptoHashAdapterPort {
    encrypt(value: string): string;
    decrypt(encryptedValue: string): string;
}