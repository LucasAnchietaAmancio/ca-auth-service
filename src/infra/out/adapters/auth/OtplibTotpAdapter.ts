import { generate } from "otplib";
import type TotpAdapterPort from "@ports/out/TotpAdapterPort.js";
import InvalidTotpException from "@exceptions/InvalidTotpException.js";
import TotpSecretValueObject from "@value-objects/TotpSecretValueObject.js";

export default class OtplibTotpAdapter implements TotpAdapterPort {
    public async execute(secret: string): Promise<string> {
        try {
            const epoch = Math.floor(Date.now() / 1000);
            const secondsRemaining = 30 - (epoch % 30);

            if (secondsRemaining < 15) {
                const tempoDeEspera = (secondsRemaining + 1) * 1000;
                await new Promise(resolve => setTimeout(resolve, tempoDeEspera));
            }

            const totpSecret = TotpSecretValueObject.create(secret).getValue();
            return await generate({ secret: totpSecret });
        } catch (err) {
            throw new InvalidTotpException("Erro ao gerar código TOTP", "TOTP_GENERATION_FAILED", { originalError: err instanceof Error ? err.message : "Erro desconhecido" });
        }
    }
}
