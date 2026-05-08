import { Request, Response, NextFunction } from "express"
import { orm } from "../shared/db/orm.js"
import { Administrador } from "./administrador.entity.js"
import dotenv from "dotenv"
import bcrypt from "bcrypt"
dotenv.config()

const em = orm.em.fork()
em.getRepository(Administrador)

function sanitizarInputDeAdministrador(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        dni: req.body.dni,
        fechaIniContrato: req.body.fechaIniContrato,
        fechaFinContrato: req.body.fechaFinContrato,
        contrasenia: req.body.contrasenia
    }
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if(req.body.sanitizedInput[key] === undefined){
            delete req.body.sanitizedInput[key]
        }
    })
    next()
}

async function getAll(req:Request, res:Response){
    try{
        const administradores = await em.getConnection().execute(`select * from administrador admin where admin.fecha_fin_contrato is null;`);
        res.status(201).json({ status: 201, data: administradores})
    } catch (error: any) {
        res.status(404).json({  status: 404})
    }
}

async function getOne(req: Request, res: Response){
    try {
        console.log(req.params.cod_administrador)
        const cod_administrador =  Number.parseInt(req.params.cod_administrador) 
        const elGuardia = await em.findOne(Administrador, { cod_administrador })
        res.status(201).json({  status: 201, data: elGuardia } )
    } catch (error: any){
        res.status(500).json({ message: error.message})
    }
}
//function generateToken(userData:Administrador){
//    return jwt.sign(userData,process.env.SECRET_KEY as string) 
//}
async function bootstrapAdmin(){
    try{
        const email = process.env.USUARIO_MAIN_EMAIL
        const password = process.env.USUARIO_MAIN_PASSWORD
        if(!email || !password){
          console.log("No esta definido el usuario admin principal en .env")
          return
        }
        const admin_existente = await em.findOne(Administrador,{email})
        if(!admin_existente){
            const hashed_password = await bcrypt.hash(password, 10);
            const adminCrear = {
                email:email,
                contrasenia:hashed_password,
                fechaCreacion: new Date(),
                especial:true
            } as Administrador
            const admin = em.create(Administrador,adminCrear)
            await em.persist(admin).flush();
            console.log("Admin user creado con exito")
        }
}catch(e){
  console.log(e)
}
}




export { getAll, getOne, sanitizarInputDeAdministrador,bootstrapAdmin }
