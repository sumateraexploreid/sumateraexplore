import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from "pg";

declare global {
  var __sePgPool: Pool | undefined;
}

function getConnectionString(): string {
  const url = process.env.DATABASE_URL || process.env.DIRECT_URL;
  if (!url) {
    throw new Error("DATABASE_URL or DIRECT_URL is not configured.");
  }
  return url;
}

export function getPool(): Pool {
  if (!global.__sePgPool) {
    global.__sePgPool = new Pool({
      connectionString: getConnectionString(),
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 20_000,
      connectionTimeoutMillis: 8_000,
    });
  }
  return global.__sePgPool;
}

export async function dbQuery<T extends QueryResultRow = QueryResultRow>(
  sql: string,
  params: unknown[] = [],
): Promise<QueryResult<T>> {
  return getPool().query<T>(sql, params);
}

export async function dbTransaction<T>(
  fn: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function checkDbHealth(): Promise<{
  connected: boolean;
  latencyMs: number;
  error?: string;
}> {
  const start = Date.now();
  try {
    await dbQuery("SELECT 1 AS ok");
    return { connected: true, latencyMs: Date.now() - start };
  } catch (err) {
    return {
      connected: false,
      latencyMs: Date.now() - start,
      error: err instanceof Error ? err.message : "Database unreachable",
    };
  }
}

