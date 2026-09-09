
export default interface OtplibTotpAdapterPort {
    execute(totpSecret: string): Promise<string>;
}