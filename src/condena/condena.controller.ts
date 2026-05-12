import { Request, Response, NextFunction } from "express"
import { orm } from "../shared/db/orm.js"
import { Condena } from "./condena.entity.js"
import { Pena } from "../pena/pena.entity.js"
import { valibot_condena } from "./condena.schema.js"

const em = orm.em
em.getRepository(Condena)

async function sanitizarInputDeCondena(req : Request, res : Response, next: NextFunction){
  try{ 
    const incoming = await valibot_condena(req.body)
    if (!incoming.success){
        console.log("incomming issues: ")
        console.log(incoming.issues)
        return res.status(400).json({status:400, message: incoming.issues[0].message})
    }
    req.body.sanitized_input = incoming.output
    next()

  }catch(error){
    console.log(error)
    return res.status(500).json({status:500, message: "Error Inesperado"})
  }
}

async function getAll(req : Request, res : Response){
    try{
        const condenas = await em.find(Condena,{})                         
        if(condenas!==null)res.status(201).json(condenas)
        if(condenas===null)res.status(404).json({ status: 404,message: "Not Found"})
    } catch (error: any) {
        res.status(500).json({ status: 500,message: 'Error Fatal'})
    }
}
 

async function getOne(req: Request, res: Response){
    try {
        const cod_pena =  Number.parseInt(req.params.cod_pena) //
        const nro_condena =  Number.parseInt(req.params.nro_condena) //
        const condena = await em.findOne(Condena, { pena:{cod_pena},nro_condena })
        res.status(201).json({ data: condena} )
    } catch (error: any){
        res.status(500).json({ message: 'error'})
    }
}

async function add(req: Request, res: Response){
    try{
        em.create(Condena, req.body.sanitized_input)
        await em.flush()
        res.status(201).json({status:201, message: 'Condena Creada'})
    } catch (error: any) {
        res.status(500).json({status:500, message : error}) 
    }
}

async function modificar(req: Request, res: Response) {
    try{
        const cod_pena = Number(req.params.cod_pena)
        const nro_condena = Number(req.params.nro_condena)
        const condena = await em.findOne(Condena,
             { pena:{cod_pena},nro_condena },{ populate: ['pena'] } )
        if(condena !== null && condena.pena !== undefined){
            const pena = condena.pena
            condena.modificarPena(req.body.sanitized_input,pena.fecha_fin_estimada as Date)
            em.assign(condena,req.body.sanitized_input)
            await em.flush()
            res.status(200).json({message: "Condena Modificada"})
        } else {
            res.status(404).json({message: 'condena no encontrada'})
        }
    } catch (error: any) {
        res.status(500).json({message : error})
    }
}

export { getAll, getOne, add, modificar, sanitizarInputDeCondena }
