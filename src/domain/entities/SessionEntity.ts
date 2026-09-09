
export default class SessionEntity {
    private constructor(
        private readonly _sessionId: string,
        private _accessToken: string,
    ){}

    public static create(accessToken: string): SessionEntity {
        return new SessionEntity(crypto.randomUUID(), accessToken);
    }

    public get sessionId(): string {
        return this._sessionId;
    }

    public get accessToken(): string {
        return this._accessToken;
    }
}
