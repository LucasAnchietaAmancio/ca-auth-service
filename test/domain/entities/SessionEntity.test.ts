import SessionEntity from "@domain/entities/SessionEntity.js";

describe("SessionEntity",() => {
    it("Deve criar uma instância de SessionEntity a partir do token interno", () => {
        const sessionEntity = SessionEntity.create("value-access-token", 1_765_000_000);
        expect(sessionEntity).toBeInstanceOf(SessionEntity);
        expect(sessionEntity.accessToken).toBe("value-access-token");
        expect(sessionEntity.expiresAt).toBe(1_765_000_000);
    });

    it("Deve criar uma instância de SessionEntity com um sessionId gerado automaticamente", () => {
        const sessionEntity = SessionEntity.create("value-access-token", 1_765_000_000);
        expect(sessionEntity.sessionId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
});
