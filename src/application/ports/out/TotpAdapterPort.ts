
export default interface TotpAdapterPort {
    execute(totpSecret: string): Promise<string>;
}