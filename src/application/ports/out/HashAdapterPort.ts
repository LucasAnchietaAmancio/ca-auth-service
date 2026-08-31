export default interface HashAdapterPort {
    execute(password: string): Promise<string>;
}
