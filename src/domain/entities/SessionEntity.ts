
export default class SessionEntity {
    public constructor(
        private readonly sessionId: string,
        private cookieHeader: string,
        private expiresAt: number,
        private acessToken: string,
    ){}

    public static create(cookieHeader: string, expiresAt: number, acessToken: string): SessionEntity {
        const sessionId = crypto.randomUUID();
        return new SessionEntity(sessionId, cookieHeader, expiresAt, acessToken);
    }
}