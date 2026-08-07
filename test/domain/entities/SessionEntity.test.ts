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
        expect(sessionEntity.sessionId).toBeDefined();
    });
});
