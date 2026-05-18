//import { MikroORM } from "@mikro-orm/core";
import { MikroORM } from '@mikro-orm/mysql';
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import dotenv from "dotenv";

dotenv.config()

const DB_NAME = process.env.DATABASE_NAME
const DB_PASSWORD = process.env.DATABASE_PASSWORD
const DB_USERNAME = process.env.DATABASE_USERNAME
const DB_HOST = process.env.DATABASE_HOST
const DB_PORT = process.env.DATABASE_PORT

export const orm = await MikroORM.init({
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    dbName: DB_NAME,
    clientUrl: 'mysql://'+`${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
     // mysql://username:password@localhost:3306/your_database_name
    highlighter: new SqlHighlighter(),
    debug: true,
    
    schemaGenerator: { // nunca utilizar en produccion, solo en la etapa de desarrollo
        disableForeignKeys: true,
        createForeignKeyConstraints: true,
        ignoreSchema: []
    }
    
})


export const syncSchema = async() => {
    const generator = orm.getSchemaGenerator()
    await generator.dropSchema()  // solo en las etapas de desarrollo
    await generator.createSchema()  // solo en las etapas de desarrollo
    await generator.updateSchema()
}


