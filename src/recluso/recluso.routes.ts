import { Router } from "express";
import { getAll, getOne,inscripcionActividad, sanitizarInputDeRecluso, addReclusoConCondenas, putRecluso,liberarRecluso} from "./recluso.controller.js";
import { isSpecialAdmin } from "../shared/verification/tokenVeryfication.js";

export const reclusoRouter = Router()

reclusoRouter.get('/', getAll)
reclusoRouter.post('/',sanitizarInputDeRecluso, addReclusoConCondenas)
reclusoRouter.get('/:id', getOne)
reclusoRouter.put('/:id',sanitizarInputDeRecluso, putRecluso)
reclusoRouter.put('/:id/inscripcion', inscripcionActividad)
reclusoRouter.put('/:id/liberar', isSpecialAdmin,liberarRecluso)

/**
* @swagger
* /reclusos:
*   get:
*     tags: [Recluso]
*     summary: Get todos los reclusos
*     responses:
*       200:
*         description: Array de Reclusos
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/ReclusoAll'
*       404:
*          description: "Not Found"
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/ApiResponse'
*              example:
*                status: 404
*                message: "Recluso not found"
*       500:
*         description: "Error Inesperado"
*         content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/ApiResponse'
*              example:
*                status: 500
*                message: "Error Inesperado"
*   post:
*     tags: [Recluso]
*     summary: Alta recluso con sus respectivas condenas
*     requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/ReclusoCondenas'
*     responses:
*       201:
*         description: Alta recluso
*         content:
*           application/json:
*              schema:
*                allOf:
*                  - $ref: '#/components/schemas/ApiResponse'
*                  - type: object
*                    properties:
*                      data:
*                        type: integer
*                        description: codigo del recluso
*              example:
*                status: 201
*                data: 1
*       403:
*          description: "Prohibido el ingreso de menores de edad"
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/ApiResponse'
*              example:
*                status: 403
*                message: "ERROR: Menor de edad"
*       409:
*          description: "Recluso con ese dni ya existe"
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/ApiResponse'
*              example:
*                status: 409
*                message: "El Recluso ya existe"
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
* /reclusos/{id}:
*   get:
*     tags: [Recluso]
*     summary: Get One Recluso
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*         description: Código del recluso
*     responses:
*       200:
*         description: Un Recluso
*         content:
*           application/json:
*              schema:
*               allOf:
*                - $ref: '#/components/schemas/ApiResponse'
*                - type: object
*                  properties:
*                     status:
*                       type: integer
*                       example: 200
*                     data:
*                       $ref: '#/components/schemas/ReclusoCondenas'
*       404:
*          description: "Not Found"
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/ApiResponse'
*              example:
*                status: 404
*                message: "Recluso not found"
*       500:
*         description: "Error Inesperado"
*         content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/ApiResponse'
*              example:
*                status: 500
*                message: "Error Inesperado"
*   put:
*      tags: [Recluso]
*      summary: Modificar recluso
*      parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*         description: Código del recluso
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/ReclusoBase'
*      responses:
*       '200':
*          description: Recluso Modificado
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/ReclusoBase'
*       '404':
*          description: Not Found
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/ApiResponse'
*              example:
*                status: 404
*                message: "ERROR: Recluso no encontrado"
*       '500':
*          description: Error Inesperado
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/ApiResponse'
*              example:
*                status: 500
*                message: "Error Inesperado"
* 
* /reclusos/{id}/inscripcion:
*   put:
*     tags: [Recluso]
*     summary: Inscripcion de recluso a actividad
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*         description: Código del recluso
*     requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                data:
*                  type: object
*                  properties:
*                    actividad_data:
*                      $ref: '#/components/schemas/Actividad'
*                    eliminar:
*                      type: boolean
*                      example: false
*     responses:
*       200:
*         description: Recluso inscripto
*         content:
*           application/json:
*              schema:
*                $ref: '#/components/schemas/ApiResponse'
*              example:
*                status: 200
*                message: "Recluso Inscripto"
* 
*       404:
*          description: "Not Found"
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/ApiResponse'
*              example:
*                status: 404
*                message: "ERROR: Recluso no encontrado"
*       409:
*          description: "Sin cupos"
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/ApiResponse'
*              example:
*                status: 409
*                message: "No hay mas cupos disponibles"
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
* /reclusos/{id}/liberar:
*   put:
*      tags: [Recluso]
*      summary: Liberacion de recluso
*      parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*         description: Código del recluso
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/ReclusoBase'
*      responses:
*       '200':
*          description: Recluso Liberado
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/ApiResponse'
*              example:
*                status: 200
*                message: "Recluso Liberado"
*       '404':
*          description: Not Found
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/ApiResponse'
*              example:
*                status: 404
*                message: "ERROR: Recluso no encontrado"
*       '500':
*          description: Error Inesperado
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/ApiResponse'
*              example:
*                status: 500
*                message: "Error Inesperado"
* 
*/
