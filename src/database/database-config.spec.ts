import { readDatabaseConfig } from './database-config';
import { describeConnectionError } from './database-connection';

const completeEnv = {
  DATABASE_HOST: 'localhost',
  DATABASE_PORT: '5432',
  DATABASE_USER: 'finance',
  DATABASE_PASSWORD: 'finance_local_only',
  DATABASE_NAME: 'personal_finance',
};

describe('readDatabaseConfig', () => {
  it('reads a complete local configuration', () => {
    expect(readDatabaseConfig(completeEnv)).toEqual({
      host: 'localhost',
      port: 5432,
      user: 'finance',
      password: 'finance_local_only',
      database: 'personal_finance',
    });
  });

  it('names every missing variable and does not invent a connection', () => {
    expect(() => readDatabaseConfig({})).toThrow(
      'Falta la configuración de conexión a PostgreSQL: DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME.',
    );
  });

  it('rejects a blank value', () => {
    expect(() =>
      readDatabaseConfig({ ...completeEnv, DATABASE_NAME: '   ' }),
    ).toThrow('DATABASE_NAME');
  });

  it('rejects a port that is not a positive integer', () => {
    expect(() =>
      readDatabaseConfig({ ...completeEnv, DATABASE_PORT: '5432.5' }),
    ).toThrow('DATABASE_PORT debe ser un entero mayor que 0.');
  });
});

describe('describeConnectionError', () => {
  it('uses the refused address when Node groups both connection attempts', () => {
    const error = new AggregateError([
      new Error('connect ECONNREFUSED ::1:5432'),
      new Error('connect ECONNREFUSED 127.0.0.1:5432'),
    ]);

    expect(describeConnectionError(error)).toBe(
      'connect ECONNREFUSED ::1:5432; connect ECONNREFUSED 127.0.0.1:5432',
    );
  });
});
