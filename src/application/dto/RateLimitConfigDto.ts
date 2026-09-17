export default interface RateLimitConfigDto {
    keyPrefix: string;
    points: number;
    durationInSeconds: number;
    blockDurationInSeconds: number;
}
