import { createClient, type RedisClientType } from "redis";
import CacheException from "@exceptions/CacheException.js";

export default class RedisClientFactory {
    public static async create(url: string): Promise<RedisClientType> {
        try {
            const client = createClient({ url });
            client.on("error", (error: Error) => {
                console.error("Redis client error:", error.message);
            });
            await client.connect();

            return client;
        } catch (error) {
            throw new CacheException("Não foi possível conectar ao Redis", "CACHE_CONNECTION_FAILED", {
                originalError: error instanceof Error ? error.message : "Erro desconhecido",
            });
        }
    }
}
