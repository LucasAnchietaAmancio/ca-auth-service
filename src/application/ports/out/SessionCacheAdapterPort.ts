import SessionEntity from "@entities/SessionEntity.js";

export default interface SessionCacheAdapterPort {
    findByCompanyId(companyId: string): Promise<SessionEntity | null>;
    save(companyId: string, session: SessionEntity): Promise<void>;
}