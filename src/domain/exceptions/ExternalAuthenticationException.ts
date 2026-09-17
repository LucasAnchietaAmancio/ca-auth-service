
export default class ExternalAuthenticationException extends Error {
    public constructor(public message: string, public tag: string) {
        super(message);
        this.name = "ExternalAuthenticationException";
    }
}
