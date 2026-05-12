import { Router } from "express";
import { getAll, getOne, add, modificar, sanitizarInputDeCondena } from "./condena.controller.js";

export const condenaRouter = Router()

condenaRouter.get('/', getAll)
condenaRouter.get('/:cod_condena', getOne)
condenaRouter.post('/', sanitizarInputDeCondena, add)
condenaRouter.put('/:cod_pena/:nro_condena',sanitizarInputDeCondena , modificar)


/**
* @swagger
* /condenas/{cod_condena}:
*   put:
*     tags: [Condena]
*     summary: Modificar condena
*     parameters:
*       - in: path
*         name: cod_condena
*         required: true
*         schema:
*           type: integer
*         description: Código de la condena
*     requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/CondenaBase'
*     responses:
*       200:
*         description: Condena modificada con exito
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/ApiResponse'
*             example:
*               status: 200
*               message: "Condena Modificada"
*       404:
*          description: "Not Found"
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/ApiResponse'
*              example:
*                status: 404
*                message: "Condena No Encontrada"
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