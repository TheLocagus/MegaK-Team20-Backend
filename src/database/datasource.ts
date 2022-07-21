import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from '../config/config.example';

export const connectionSource = new DataSource({
  type: 'mysql',
  host: config.host,
  port: config.port,
  username: config.username,
  password: config.password,
  database: config.database,
  entities: [
    'dist/**/**/**/**.entity{.ts,.js}',
    'dist/**/**/**.entity{.ts,.js}',
    'dist/**/**.entity{.ts,.js}',
  ],
  bigNumberStrings: false,
  logging: config.logging,
  migrations: ['dist/migration/*.js'],
  synchronize: config.synchronize,
  autoLoadEntities: true,
  extra: {
    decimalNumbers: true,
  },
  cli: {
    migrationsDir: 'migration',
  },
} as DataSourceOptions);
