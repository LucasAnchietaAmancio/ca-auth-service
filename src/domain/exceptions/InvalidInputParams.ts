
export default class InvalidInputParams extends Error {
    public constructor(public message: string, public tag: string) {
        super(message);
        this.tag = tag;
    }
}