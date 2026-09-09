import type GenerateSessionDto from "@dto/GenerateSessionDto.js";
import SessionEntity from "@entities/SessionEntity.js";

export default interface GenerateSessionUseCasePort {
    execute(dto: GenerateSessionDto): Promise<SessionEntity>;
}