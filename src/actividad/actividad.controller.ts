import { Request, Response, NextFunction } from "express"
import { Actividad } from "./actividad.entity.js"
import { orm } from "../shared/db/orm.js"
import { valibot_actividad } from "./actividad.schema.js"
import { Sector } from "../sector/sector.entity.js"

const em = orm.em

async function sanitizarInputDeActividad(req : Request, res : Response, next: NextFunction){
  try{ 
    const incoming = await valibot_actividad(req.body)
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

async function getAll(req:Request, res:Response){
    try{
        const actividades = await em.find(Actividad, {});
        res.status(201).json(actividades)
    } catch (error: any) {
        res.status(404).json({ status: 404})
    }
}

async function getOne(req: Request, res: Response){
    try {
        const cod_actividad =  Number.parseInt(req.params.cod_actividad)
        const actividad = await em.findOneOrFail(Actividad,
             { cod_actividad:cod_actividad },{ populate: ['reclusos'] })
        res.status(201).json(actividad)
    } catch (error: any){
        res.status(404).json({ message: 'Actividad No Encontrada'})
    }
}

async function add(req: Request, res: Response){
    try{
        const cant_act_per_day = await em.count(Actividad,
            {dia_de_la_semana: req.body.sanitized_input.dia_de_la_semana})
        if(cant_act_per_day>=3){
       return res.status(409).json({status:409 ,message:'Excede la Cantidad Maxima de Actividades por Dia'})
        }
        const sector = await em.find(Sector,{cod_sector:req.body.sanitized_input.cod_sector})
        if(sector.length===0)return res.status(409).json({status:409 ,message:'El Sector No esta cargado'})
        em.create(Actividad,req.body.sanitized_input)
        await em.flush()
        res.status(201).json({status:201,message:'Actividad Creada'})
    } catch (error: any) {
        console.log(error)
        res.status(500).json({message : error.message})
    }
}

async function update(req: Request, res: Response) {
    try{
        const id_actividad = Number(req.params.cod_actividad)
        const actividad = await em.findOne(Actividad, {cod_actividad:id_actividad})
        if(actividad!=null) {
            console.log(req.body.sanitized_input)
            em.assign(actividad, req.body.sanitized_input)
            await em.flush()
            res.status(200).json({ message: 'Actividad Modificada'})
        } else {
            res.status(404).json({message:'Actividad No Encontrada'})
            return
        }
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message : error.message })
    }
}

async function deleteOne(req:Request,res:Response){
    try{
        const cod_act = Number(req.params.cod_actividad)
        const actividad = await em.findOne(Actividad,{cod_actividad:cod_act})
        if(actividad!=null){
         await em.removeAndFlush(actividad)
        res.status(200).json({message:'Acividad Eliminada'})    
        }else{
            res.status(404).json({message:'Actividad a Eliminar no Encontrada'})
            return
        }

    }catch(error:any){
        res.status(500).json({message:error.message})
    }
}


export { getAll, getOne, add, update, sanitizarInputDeActividad,deleteOne }









