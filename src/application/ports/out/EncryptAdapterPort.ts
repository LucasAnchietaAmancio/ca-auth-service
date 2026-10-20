export default interface EncryptAdapterPort {
    encrypt(value: string): string;
    decrypt(encryptedValue: string): string;
}