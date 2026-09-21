export default class EnvironmentError extends Error {
    public constructor(public readonly key: string, message: string) {
        super(message);
        this.name = "EnvironmentError";
    }
}
