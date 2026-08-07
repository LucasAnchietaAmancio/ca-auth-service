import type PuppeteerAuthAdapterResponseDto from "@dto/PuppeteerAuthAdapterResponseDto.js"

export default interface ContaAzulPuppeteerAuthAdapterPort {
    execute(email: string, hashedPassword: string): Promise<PuppeteerAuthAdapterResponseDto>;
}