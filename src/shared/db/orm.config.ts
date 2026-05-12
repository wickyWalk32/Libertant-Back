import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Options, MySqlDriver } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import dotenv from "dotenv";

dotenv.config()
const dbNombre = 'libertant2'
const API_URL = process.env.API_URL
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD

const config: Options = {
  driver: MySqlDriver,
  dbName: dbNombre,
  // folder-based discovery setup, using common filename suffix
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  // we will use the ts-morph reflection, an alternative to the default reflect-metadata provider
  // check the documentation for their differences: https://mikro-orm.io/docs/metadata-providers
  //metadataProvider: TsMorphMetadataProvider, // use deault
  clientUrl: 'mysql://admin:'+`${DATABASE_PASSWORD}`+'@'+`${API_URL}`+dbNombre, // mysql://username:password@localhost:3306/your_database_name
  highlighter: new SqlHighlighter(),
  // enable debug mode to log SQL queries and discovery information
  debug: true,

};

const config_test: Options = {
  driver: MySqlDriver,
  dbName: 'libertant_test',
  // folder-based discovery setup, using common filename suffix
 
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  // we will use the ts-morph reflection, an alternative to the default reflect-metadata provider
  // check the documentation for their differences: https://mikro-orm.io/docs/metadata-providers
  //metadataProvider: TsMorphMetadataProvider, // use deault
  clientUrl: 'mysql://admin:'+`${process.env.DATABASE_PASSWORD}`+'@localhost:3306/'+dbNombre, // mysql://username:password@localhost:3306/your_database_name
  highlighter: new SqlHighlighter(),
  // enable debug mode to log SQL queries and discovery information
  debug: true,
      schemaGenerator: { // nunca utilizar en produccion, solo en la etapa de desarrollo
        disableForeignKeys: true,
        createForeignKeyConstraints: true,
        ignoreSchema: []
    }
};

export  {config, config_test};