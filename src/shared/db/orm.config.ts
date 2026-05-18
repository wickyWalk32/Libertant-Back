import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Options, MySqlDriver } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import dotenv from "dotenv";

dotenv.config()
const dbNombre = 'libertant2'
const DB_NAME = process.env.DATABASE_NAME
const DB_TEST_NAME = process.env.DATABASE_TEST_NAME
const DB_PASSWORD = process.env.DATABASE_PASSWORD
const DB_USERNAME = process.env.DATABASE_USERNAME
const DB_HOST = process.env.DATABASE_HOST
const DB_PORT = process.env.DATABASE_PORT
const config: Options = {
  driver: MySqlDriver,
  dbName: dbNombre,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  clientUrl: 'mysql://'+`${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, // mysql://username:password@localhost:3306/your_database_name
  highlighter: new SqlHighlighter(),
  debug: true,

};

const config_test: Options = {
  driver: MySqlDriver,
  dbName: DB_TEST_NAME,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  clientUrl: 'mysql://'+`${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_TEST_NAME}`, // mysql://username:password@localhost:3306/your_database_name
  highlighter: new SqlHighlighter(),
  debug: true,
      schemaGenerator: { // nunca utilizar en produccion, solo en la etapa de desarrollo
        disableForeignKeys: true,
        createForeignKeyConstraints: true,
        ignoreSchema: []
    }
};

export  {config, config_test};