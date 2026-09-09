import type ContaAzulAuthAdapterResponseDto from "@dto/ContaAzulAuthAdapterResponseDto.js"

export default interface ContaAzulPuppeteerAuthAdapterPort {
    execute(email: string, password: string, totpSecret: string): Promise<ContaAzulAuthAdapterResponseDto>;
}
