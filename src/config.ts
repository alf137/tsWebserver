import type { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile()
const env = process.env

export type APIConfig = {
  fileServerHits: number;
  port: number;
  platform: string;
};

export type DBConfig = {
  dbURL:string
  migrationPath: string
}

type Config = {
  api: APIConfig;
  db: DBConfig
}

export const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

export const config = {
  db: {
    dbURL: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig,
  },
  api: {
    fileServerHits: 0,
    port: Number(envOrThrow("PORT")),
    platform: String(envOrThrow("PLATFORM"))
  }
}  

// helper

function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}
