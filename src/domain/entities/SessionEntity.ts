
export default class SessionEntity {
    private constructor(
        private readonly _sessionId: string,
        private _cookieHeader: string,
        private expiresAt: number,
        private _accessToken: string,
    ){}

    public static create(cookieHeader: string, expiresAt: number, acessToken: string): SessionEntity {
        return new SessionEntity(crypto.randomUUID(), cookieHeader, expiresAt, acessToken);
    }

    public get sessionId(): string {
        return this._sessionId;
    }

    public get cookieHeader(): string {
        return this._cookieHeader;
    }

    public get accessToken(): string {
        return this._accessToken;
    }
}