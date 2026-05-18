//librerias y modulos
import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import { syncSchema } from '../src/shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'

// Routers
import { guardiaRouter } from '../src/guardia/guardia.routes.js'
import { actividadRouter } from '../src/actividad/actividad.routes.js'
import { condenaRouter } from '../src/condena/condena.routes.js'
import { celdaRouter } from '../src/celda/celda.routes.js'
import { sectorRouter } from '../src/sector/sector.routes.js'
import { administradorRouter } from '../src/administrador/administrador.routes.js'
import { penaRouter } from '../src/pena/pena.routes.js'
import { reclusoRouter } from '../src/recluso/recluso.routes.js'
import { turnoRouter } from '../src/turno/turno.routes.js'
import { verificarToken } from '../src/shared/verification/tokenVeryfication.js'
import { config_test } from '../src/shared/db/orm.config.js'
import { corsOptions } from '../src/shared/cors.options.js'
import { MikroORM } from '@mikro-orm/mysql'




//misc
export const app = express()

app.use(cors(corsOptions))
app.use(express.json())


export const orm_test = await MikroORM.init(config_test);
app.use((req, res, next) => {
  RequestContext.create(orm_test.em, next)
})

app.use('/end-testing', (req, res, next)=>{
  res.once('finish', async () => {
  await orm_test.schema.dropSchema();
  await orm_test.schema.createSchema(); 
  console.log('Request happenned')
  res.status(200).json({ status: 200 })
  });
    next(); // Continue down the middleware chain
});

app.use('/administradores', administradorRouter)
app.use(verificarToken)
app.use('/actividades', actividadRouter)
app.use('/guardias', guardiaRouter)
app.use('/penas', penaRouter)
app.use('/sectores', sectorRouter)
app.use('/reclusos', reclusoRouter)
app.use('/condenas', condenaRouter)
app.use('/sectores', sectorRouter)
app.use('/celdas', celdaRouter)
app.use('/turnos', turnoRouter)
app.use((_, res) => {
    return res.status(404).send({ message: 'Resource not found' })
})

const generator = orm_test.schema;
// await syncSchema()  // solo en etapas de desarrollo  
  await generator.dropSchema();
  await generator.createSchema();
  // await generator.updateSchema();

// listen
app.listen(8081, () => {
    console.log('server correctly running at 8081')
})