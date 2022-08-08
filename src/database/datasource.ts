import { DataSource, DataSourceOptions } from 'typeorm';
import { configDb } from '../config/config-db';

export const connectionSource = new DataSource({
  type: 'mysql',
  host: configDb.host,
  port: configDb.port,
  username: configDb.username,
  password: configDb.password,
  database: configDb.database,
  entities: [
    'dist/**/**/**/*.entity{.ts,.js}',
    'dist/**/**/*.entity{.ts,.js}',
    'dist/**/*.entity{.ts,.js}',
  ],
  bigNumberStrings: false,
  logging: configDb.logging,
  migrations: ['dist/migration/*.js'],
  synchronize: configDb.synchronize,
  autoLoadEntities: true,
  extra: {
    decimalNumbers: true,
  },
  cli: {
    migrationsDir: 'migration',
  },
} as DataSourceOptions);
