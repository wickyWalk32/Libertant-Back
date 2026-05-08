import { Router } from "express";
import { getAll, getOne, add, modificar,
   deleteOne, getSectoresXTurnoByDate,sanitizarInputSector } from "./sector.controller.js";

export const sectorRouter = Router()

sectorRouter.get('/', getAll)
sectorRouter.post('/',sanitizarInputSector, add)
sectorRouter.post('/:cod_sector',sanitizarInputSector, modificar)
sectorRouter.get('/:cod_sector', getOne)
sectorRouter.get('/turnos/:fecha', getSectoresXTurnoByDate)
sectorRouter.delete('/:cod_sector', deleteOne)




/**
* @swagger
* /sectores:
*   get:
*     tags: [Sector]
*     summary: Get todos los sectores
*     responses:
*       200:
*         description: Array de sectores
*         content:
*           application/json:
*             schema:
*                type: array
*                items:
*                  $ref: '#/components/schemas/Sector'
*       404:
*          description: "Not Found"
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/ApiResponse'
*              example:
*                status: 404
*                message: "Sectores not found"
* 
*   post:
*     tags: [Sector]
*     summary: Alta sector
*     requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/Sector'
*     responses:
*       201:
*         description: Sector creado con exito
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/ApiResponse'
*             example:
*               status: 201
*               mwssage: 'Sector Creado'
*       409:
*         description: "Conflicto. Ya existe sector con codigo elegido"
*         content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/ApiResponse'
*              example:
*                status: 409
*                message: "Error. Ya existe sector con codigo seleccionado"
*       500:
*         description: "Error Inesperado"
*         content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/ApiResponse'
*              example:
*                status: 500
*                message: "Error Inesperado"
* 
* /sectores/{cod_sector}:
*   get:
*     tags: [Sector]
*     summary: Get one sector
*     parameters:
*       - in: path
*         name: cod_sector
*         required: true
*         schema:
*           type: string
*         description: Código del sector
*     responses:
*       200:
*         description: Sector encontrado con exito
*         content:
*           application/json:
*             schema:
*               allOf:
*                - $ref: '#/components/schemas/ApiResponse'
*                - properties:
*                   data:
*                      $ref: '#/components/schemas/Sector'
*       500:
*         description: "Error Inesperado"
*         content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/ApiResponse'
*              example:
*                status: 500
*                message: "Error Inesperado"
* 
*   put:
*     tags: [Sector]
*     summary: Modificar sector
*     parameters:
*       - in: path
*         name: cod_sector
*         required: true
*         schema:
*           type: string
*         description: Código del sector
*     responses:
*       200:
*         description: "Sector modificado con exito"
*         content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/ApiResponse'
*              example:
*                status: 200
*                message: "Sector Modificado"
*       404:
*         description: "Not Found"
*         content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/ApiResponse'
*              example:
*                status: 404
*                message: "Sector no encontrado"
*       500:
*         description: "Error Inesperado"
*         content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/ApiResponse'
*              example:
*                status: 500
*                message: "Error Inesperado"
* 
*   delete:
*     tags: [Sector]
*     summary: Eliminar/Inhabilitar Sector
*     parameters:
*       - in: path
*         name: cod_sector
*         required: true
*         schema:
*           type: string
*           maxLength: 2
*         description: Código de sector
*     responses:
*       200:
*         description: Sector eliminado
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/ApiResponse'
*             example:
*               status: 200
*               message: "Sector eliminado"
*       500:
*         description: "Error Inesperado"
*         content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/ApiResponse'
*              example:
*                status: 500
*                message: "Error Inesperado"
* 
* /sectores/turnos/{fecha}:
*   get:
*     tags: [Sector]
*     summary: Get one sector
*     parameters:
*       - in: path
*         name: cod_sector
*         required: true
*         schema:
*           type: string
*         description: Código del sector
*     responses:
*       200:
*         description: Array de sectores
*         content:
*           application/json:
*             schema:
*                type: array
*                items:
*                  $ref: '#/components/schemas/Sector'
*       500:
*         description: "Error Inesperado"
*         content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/ApiResponse'
*              example:
*                status: 500
*                message: "Error Inesperado"
*/

