//librerias y modulos
import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import { syncSchema } from './shared/db/orm.js'
import { MikroORM, RequestContext } from '@mikro-orm/core'

// Routers
import { guardiaRouter } from './guardia/guardia.routes.js'
import { actividadRouter } from './actividad/actividad.routes.js'
import { condenaRouter } from './condena/condena.routes.js'
import { celdaRouter } from './celda/celda.routes.js'
import { sectorRouter } from './sector/sector.routes.js'
import { administradorRouter } from './administrador/administrador.routes.js'
import { penaRouter } from './pena/pena.routes.js'
import { reclusoRouter } from './recluso/recluso.routes.js'
import { turnoRouter } from './turno/turno.routes.js'
import { verificarToken } from './shared/verification/tokenVeryfication.js'

import { config } from './shared/db/orm.config.js'
import { corsOptions } from './shared/cors.options.js'
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./../swagger.js";
import { loginRouter } from './log-in/log-in.routes.js'
import { bootstrapAdmin } from './administrador/administrador.controller.js'


//misc
export const app = express()

app.use(cors(corsOptions))
app.use(express.json())


app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));



const orm = await MikroORM.init(config);
app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})

app.use('/log-in',loginRouter)
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
await bootstrapAdmin()

// await syncSchema()  // solo en etapas de desarrollo  

// listen
app.listen(8080, () => {
    console.log('server correctly running at 8080')
})

