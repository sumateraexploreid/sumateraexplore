import { NextRequest } from "next/server";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export function checkRateLimit(
  key: string,
  windowMs: number,
  maxRequests: number,
): { allowed: boolean; retryAfter?: number; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    return {
      allowed: false,
      retryAfter: Math.ceil((record.resetAt - now) / 1000),
      remaining: 0,
    };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count };
}

export function createRateLimiter(
  windowMs: number,
  maxRequests: number,
  keyPrefix = "admin",
) {
  return (req: NextRequest) => {
    const ip = getClientIp(req);
    const key = `${keyPrefix}:${ip}`;
    return checkRateLimit(key, windowMs, maxRequests);
  };
}

export const adminLoginRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts per 15 minutes
  "admin_login",
);

export const adminApiRateLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  30, // 30 requests per minute
  "admin_api",
);

export const adminMutationRateLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  20, // 20 mutations per minute
  "admin_mutation",
);