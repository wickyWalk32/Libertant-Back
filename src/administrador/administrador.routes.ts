import { Router } from "express";
import { getAll, getOne, sanitizarInputDeAdministrador,bootstrapAdmin} from "./administrador.controller.js";

export const administradorRouter = Router()

administradorRouter.get('/', getAll)
administradorRouter.get('/:cod_administrador', getOne)
administradorRouter.get('/',bootstrapAdmin)
