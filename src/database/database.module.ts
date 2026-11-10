import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';
import { readDatabaseConfig } from './database-config';

export const DATABASE_POOL = Symbol('DATABASE_POOL');

@Global()
@Module({
    providers: [
        {
            provide: DATABASE_POOL,
            useFactory: () => {
                const config = readDatabaseConfig(process.env);

                return new Pool({
                    ...config,
                    connectionTimeoutMillis: 3000,
                    max: 10,
                });
            },
        },
    ],
    exports: [DATABASE_POOL],
})
export class DatabaseModule { }