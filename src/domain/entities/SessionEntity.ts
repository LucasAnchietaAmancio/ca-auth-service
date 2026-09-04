
export default class SessionEntity {
    private constructor(
        private readonly _sessionId: string,
        private _cookieHeader: string,
        private _expiresAt: number,
        private _accessToken: string,
    ){}

    public static create(cookieHeader: string, expiresAt: number, accessToken: string): SessionEntity {
        return new SessionEntity(crypto.randomUUID(), cookieHeader, expiresAt, accessToken);
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

    public get expiresAt(): number {
        return this._expiresAt;
    }
}
