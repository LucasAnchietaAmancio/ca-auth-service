
export default class SessionEntity {
    private constructor(
        private readonly _sessionId: string,
        private _accessToken: string,
        private readonly _expiresAt: number,
    ){}

    public static create(accessToken: string, expiresAt: number): SessionEntity {
        return new SessionEntity(crypto.randomUUID(), accessToken, expiresAt);
    }

    public static restore(sessionId: string, accessToken: string, expiresAt: number): SessionEntity {
        return new SessionEntity(sessionId, accessToken, expiresAt);
    }

    public get sessionId(): string {
        return this._sessionId;
    }

    public get accessToken(): string {
        return this._accessToken;
    }

    public get expiresAt(): number {
        return this._expiresAt;
    }

    public isExpired(): boolean {
        return Date.now() >= this._expiresAt;
    }
}
