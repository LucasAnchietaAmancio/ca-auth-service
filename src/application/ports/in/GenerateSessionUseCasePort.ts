import type GenerateSessionDto from "@dto/GenerateSessionDto.js";
import SessionEntity from "@domain/entities/SessionEntity.js";

export default interface GenerateSessionUseCasePort {
    execute(command: GenerateSessionDto): Promise<SessionEntity>;
}