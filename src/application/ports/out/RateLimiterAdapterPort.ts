export default interface RateLimiterAdapterPort {
    consume(key: string): Promise<void>;
}
