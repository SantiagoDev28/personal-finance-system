export const DATABASE_ENV_KEYS = [
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_USER',
  'DATABASE_PASSWORD',
  'DATABASE_NAME',
] as const;

export type DatabaseConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

export function readDatabaseConfig(env: NodeJS.ProcessEnv): DatabaseConfig {
  const missing = DATABASE_ENV_KEYS.filter((key) => !env[key]?.trim());
  if (missing.length > 0) {
    throw new Error(
      `Falta la configuración de conexión a PostgreSQL: ${missing.join(', ')}. Copia .env.example a .env y completa esos valores.`,
    );
  }

  const port = Number(env.DATABASE_PORT);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('DATABASE_PORT debe ser un entero mayor que 0.');
  }

  return {
    host: env.DATABASE_HOST!.trim(),
    port,
    user: env.DATABASE_USER!.trim(),
    password: env.DATABASE_PASSWORD!.trim(),
    database: env.DATABASE_NAME!.trim(),
  };
}
