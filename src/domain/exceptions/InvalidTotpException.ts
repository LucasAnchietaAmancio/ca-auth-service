
export default class InvalidTotpException extends Error {
    public constructor(public message: string, public tag: string, public payload: object) {
        super(message);
        this.tag = tag;
        this.payload = payload;
    }
}