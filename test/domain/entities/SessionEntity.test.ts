import SessionEntity from "@domain/entities/SessionEntity.js";

describe("SessionEntity",() => {
    it("Deve criar uma instância de SessionEntity com os valores fornecidos", () => {
        const sessionEntity =  SessionEntity.create(
            "x-ca-auth",
            7132164360,
            "value-acess-token"
        );
        expect(sessionEntity).toBeInstanceOf(SessionEntity);
    });

    it("Deve criar uma instância de SessionEntity com um sessionId gerado automaticamente", () => {
        const sessionEntity =  SessionEntity.create(
            "x-ca-auth",
            7132164360,
            "value-acess-token"
        );
        expect(sessionEntity.sessionId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
});
