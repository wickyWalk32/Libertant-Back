import { Router } from "express";
import { logIn, verifyCaptcha } from "./log-in.controller.js";
import { input_sanitizer } from "./log-in.controller.js";

export const loginRouter = Router()
loginRouter.post('/',input_sanitizer,verifyCaptcha, logIn)



/**
* @swagger
* /:
*   post:
*     tags: [Log-in]
*     summary: Solicitud de Login
*     security: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Usuario'      
*     responses:
*       202:
*         description: Verificacion exitosa
*         content:
*           application/json:
*              schema:
*                $ref: '#/components/schemas/ApiResponse'
*              example:
*                status: 202
*                token: shcnrjHJDMUEDKAÑl
*                data:
*                  nombre: Juan
*                  especial: true               
*       404:
*          description: "Usuario no encontrado"
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/ApiResponse'
*              example:
*                status: 404
*                message: "Usuario no encontrado"
*       401:
*         description: "Error de validacion"
*         content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/ApiResponse'
*              example:
*                status: 401
*                message: "Nombre de usuario o Contraseña incorrecta"
*/


