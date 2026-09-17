import type { RedisClientType } from "redis";
import type SessionCacheAdapterPort from "@ports/out/SessionCacheAdapterPort.js";
import SessionEntity from "@entities/SessionEntity.js";
import CacheException from "@exceptions/CacheException.js";

export default class RedisSessionCacheAdapter implements SessionCacheAdapterPort {
    public constructor(private readonly client: RedisClientType) {}

    public async findByCompanyId(companyId: string): Promise<SessionEntity | null> {
        try {
            const cached = await this.client.get(`session:company:${companyId}`);
            if (!cached) return null;

            const session = JSON.parse(cached) as { sessionId: string; accessToken: string; expiresAt: number };
            if (!session.sessionId || !session.accessToken || !Number.isFinite(session.expiresAt)) {
                throw new CacheException("A sessão armazenada no cache é inválida", "INVALID_CACHED_SESSION", { companyId });
            }

            if (Date.now() >= session.expiresAt) {
                await this.client.del(`session:company:${companyId}`);
                return null;
            }

            return SessionEntity.restore(session.sessionId, session.accessToken, session.expiresAt);
        } catch (error) {
            if (error instanceof CacheException) throw error;
            throw new CacheException("Ocorreu um erro ao buscar a sessão no cache", "CACHE_READ_FAILED", {companyId, originalError: error instanceof Error ? error.message : "Erro desconhecido"});
        }
    }

    public async save(companyId: string, session: SessionEntity): Promise<void> {
        const ttlInSeconds = Math.ceil((session.expiresAt - Date.now()) / 1000);
        if (ttlInSeconds <= 0) return;

        try {
            await this.client.set(`session:company:${companyId}`, JSON.stringify({sessionId: session.sessionId,accessToken: session.accessToken,expiresAt: session.expiresAt}), { EX: ttlInSeconds });
        } catch (error) {
            throw new CacheException("Ocorreu um erro ao salvar a sessão no cache", "CACHE_WRITE_FAILED", {companyId,originalError: error instanceof Error ? error.message : "Erro desconhecido"});
        }
    }
}
