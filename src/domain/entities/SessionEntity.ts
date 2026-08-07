
export default class SessionEntity {
    private constructor(
        private readonly _sessionId: string,
        private cookieHeader: string,
        private expiresAt: number,
        private acessToken: string,
    ){}

    public static create(cookieHeader: string, expiresAt: number, acessToken: string): SessionEntity {
        return new SessionEntity(crypto.randomUUID(), cookieHeader, expiresAt, acessToken);
    }

    public get sessionId(): string {
        return this._sessionId;
    }
}