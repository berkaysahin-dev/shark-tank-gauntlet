/**
 * Hybrid Rate Limiter & Circuit Breaker for Server-Side Free Live AI.
 * - Uses Upstash Redis REST API when UPSTASH_REDIS_REST_URL & UPSTASH_REDIS_REST_TOKEN are set.
 * - Falls back to an in-memory per-IP + global daily cap when Redis is not configured.
 * - Protects server API keys from viral traffic spikes or automated abuse.
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  globalRemaining: number;
  reason?: "ip_limit" | "global_cap";
}

const DEFAULT_IP_DAILY_LIMIT = 12; // ~1 full 5-juror session (11 calls) + 1 retry per day
const DEFAULT_GLOBAL_DAILY_LIMIT = 500; // Hard circuit breaker for server-sponsored Free Live AI

function getIntEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getTodayBucket(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

// In-memory fallback store (per server instance)
interface MemoryBucket {
  day: string;
  globalCount: number;
  ipCounts: Map<string, number>;
}

const memoryStore: MemoryBucket = {
  day: getTodayBucket(),
  globalCount: 0,
  ipCounts: new Map(),
};

function resetMemoryIfNewDay(today: string) {
  if (memoryStore.day !== today) {
    memoryStore.day = today;
    memoryStore.globalCount = 0;
    memoryStore.ipCounts.clear();
  }
}

async function upstashIncrWithTtl(
  url: string,
  token: string,
  key: string,
  ttlSeconds: number
): Promise<number | null> {
  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, ttlSeconds, "NX"],
      ]),
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{ result?: number }>;
    const count = data?.[0]?.result;
    return typeof count === "number" ? count : null;
  } catch {
    return null;
  }
}

async function upstashGetInt(url: string, token: string, key: string): Promise<number> {
  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return 0;
    const data = (await res.json()) as { result?: string | number | null };
    const parsed = Number(data?.result ?? 0);
    return Number.isFinite(parsed) ? parsed : 0;
  } catch {
    return 0;
  }
}

export function extractClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "anonymous";
}

export async function checkAndConsumeFreeAiQuota(ip: string): Promise<RateLimitResult> {
  const ipLimit = getIntEnv("GAUNTLET_FREE_IP_DAILY_LIMIT", DEFAULT_IP_DAILY_LIMIT);
  const globalLimit = getIntEnv("GAUNTLET_FREE_GLOBAL_DAILY_LIMIT", DEFAULT_GLOBAL_DAILY_LIMIT);
  const today = getTodayBucket();
  const safeIp = ip.replace(/[^a-zA-Z0-9.:_-]/g, "_").slice(0, 64) || "anonymous";

  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    const globalKey = `gauntlet:free:global:${today}`;
    const ipKey = `gauntlet:free:ip:${today}:${safeIp}`;
    const ttl = 60 * 60 * 26; // 26h safety window

    const globalCount = await upstashIncrWithTtl(upstashUrl, upstashToken, globalKey, ttl);
    if (globalCount !== null) {
      if (globalCount > globalLimit) {
        return {
          allowed: false,
          remaining: 0,
          limit: ipLimit,
          globalRemaining: 0,
          reason: "global_cap",
        };
      }

      const ipCount = await upstashIncrWithTtl(upstashUrl, upstashToken, ipKey, ttl);
      if (ipCount !== null) {
        if (ipCount > ipLimit) {
          return {
            allowed: false,
            remaining: 0,
            limit: ipLimit,
            globalRemaining: Math.max(0, globalLimit - globalCount),
            reason: "ip_limit",
          };
        }
        return {
          allowed: true,
          remaining: Math.max(0, ipLimit - ipCount),
          limit: ipLimit,
          globalRemaining: Math.max(0, globalLimit - globalCount),
        };
      }
    }
  }

  // Fallback: in-memory per-instance rate limiter
  resetMemoryIfNewDay(today);

  if (memoryStore.globalCount >= globalLimit) {
    return {
      allowed: false,
      remaining: 0,
      limit: ipLimit,
      globalRemaining: 0,
      reason: "global_cap",
    };
  }

  const currentIpCount = memoryStore.ipCounts.get(safeIp) ?? 0;
  if (currentIpCount >= ipLimit) {
    return {
      allowed: false,
      remaining: 0,
      limit: ipLimit,
      globalRemaining: Math.max(0, globalLimit - memoryStore.globalCount),
      reason: "ip_limit",
    };
  }

  memoryStore.globalCount += 1;
  memoryStore.ipCounts.set(safeIp, currentIpCount + 1);

  return {
    allowed: true,
    remaining: Math.max(0, ipLimit - (currentIpCount + 1)),
    limit: ipLimit,
    globalRemaining: Math.max(0, globalLimit - memoryStore.globalCount),
  };
}

export async function peekFreeAiQuota(ip: string): Promise<{ remaining: number; limit: number; globalRemaining: number }> {
  const ipLimit = getIntEnv("GAUNTLET_FREE_IP_DAILY_LIMIT", DEFAULT_IP_DAILY_LIMIT);
  const globalLimit = getIntEnv("GAUNTLET_FREE_GLOBAL_DAILY_LIMIT", DEFAULT_GLOBAL_DAILY_LIMIT);
  const today = getTodayBucket();
  const safeIp = ip.replace(/[^a-zA-Z0-9.:_-]/g, "_").slice(0, 64) || "anonymous";

  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    const [globalCount, ipCount] = await Promise.all([
      upstashGetInt(upstashUrl, upstashToken, `gauntlet:free:global:${today}`),
      upstashGetInt(upstashUrl, upstashToken, `gauntlet:free:ip:${today}:${safeIp}`),
    ]);
    return {
      remaining: Math.max(0, ipLimit - ipCount),
      limit: ipLimit,
      globalRemaining: Math.max(0, globalLimit - globalCount),
    };
  }

  resetMemoryIfNewDay(today);
  const ipCount = memoryStore.ipCounts.get(safeIp) ?? 0;
  return {
    remaining: Math.max(0, ipLimit - ipCount),
    limit: ipLimit,
    globalRemaining: Math.max(0, globalLimit - memoryStore.globalCount),
  };
}
