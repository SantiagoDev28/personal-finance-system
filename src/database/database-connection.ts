import { Client } from 'pg';
import { DatabaseConfig, readDatabaseConfig } from './database-config';

export function describeConnectionError(error: unknown): string {
  if (error instanceof AggregateError) {
    const details = error.errors
      .map((item: unknown) =>
        item instanceof Error ? item.message : String(item),
      )
      .filter((detail) => detail.trim().length > 0);
    if (details.length > 0) {
      return details.join('; ');
    }
  }
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
  ) {
    return error.code;
  }
  return 'error de conexión desconocido';
}

export async function assertDatabaseReachable(
  env: NodeJS.ProcessEnv,
): Promise<DatabaseConfig> {
  const databaseConfig = readDatabaseConfig(env);
  const client = new Client({
    host: databaseConfig.host,
    port: databaseConfig.port,
    user: databaseConfig.user,
    password: databaseConfig.password,
    database: databaseConfig.database,
    connectionTimeoutMillis: 3000,
  });

  try {
    await client.connect();
    return databaseConfig;
  } catch (error) {
    const detail = describeConnectionError(error);
    throw new Error(
      `No se pudo conectar a PostgreSQL en ${databaseConfig.host}:${databaseConfig.port}, base ${databaseConfig.database}. ${detail}`,
    );
  } finally {
    try {
      await client.end();
    } catch {
      // The socket was never opened.
    }
  }
}
