import { Request, Response, NextFunction } from "express"
import { orm } from "../shared/db/orm.js"
import { Sector } from "./sector.entity.js"
import { valibot_sector } from "./sector.schema.js"
import { Turno } from "../turno/turno.entity.js"
import { Actividad } from "../actividad/actividad.entity.js"

const em = orm.em
em.getRepository(Sector)

async function sanitizarInputSector(req: Request, res: Response, next: NextFunction){
  try{ 
    const incoming = await valibot_sector(req.body)
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
        const sectores = await em.find(Sector, {habilitado:true})
        res.status(201).json(sectores)
    } catch (e:any) {
        res.status(404).json({ status: 404, message:e.error})
    }
}

async function getSectoresXTurnoByDate(req:Request,res:Response){
    try{
        const sectores = await em
        .createQueryBuilder(Sector, 's')
        .leftJoinAndSelect(
            's.turnos', 't',
            { fecha: req.params.fecha }
         )
        .leftJoinAndSelect('t.guardia', 'g')
        .where('s.habilitado = ?', [true])
        .getResult();
        res.status(201).json(sectores)
    }catch(e){
        console.log(e)
        res.status(500).json({ status: 500, message:e})
    }
}

async function add(req : Request, res : Response){
    try{
        const sector_duplicado = await em.findOne(Sector,req.body.sanitized_input.cod_sector)
        if(sector_duplicado!=null){
            res.status(409).json({status:409, message:"Error. Ya existe sector con codigo seleccionado"})
            return}
        const sector = em.create(Sector,req.body.sanitized_input)
        await em.persist(sector).flush();
        res.status(201).json({status:200, message:"Sector Guardado"})
    }catch(error:any){
        res.status(500).json({status:500, message:"Error inesperado. No se ha podido guardar el sector"})
    }
}

async function getOne(req: Request, res: Response){
    try {
        const cod_sector =  req.params.cod_sector
        const sector = await em.findOneOrFail(Sector, { cod_sector })
        res.status(200).json({ status: 200, data: sector } )
    } catch (error: any){
        res.status(404).json({status: 404})
    }
}


async function modificar(req:Request,res:Response){
    try{
        const sector = await em.findOneOrFail(Sector,{cod_sector: req.params.cod_sector.toUpperCase()})
        if(!sector.habilitado)return res.status(409).json({sataus:409, message:"ERROR: Sector deshabilitado"})
        if(sector!=null){
            em.assign(sector,req.body.sanitized_input)
            await em.flush()
            res.status(200).json({status:200, message:"Sector Modificado"})
        }
        if(sector===null)res.status(404).json({sataus:404, message:"ERROR: Sector no encontrado"})
    }catch{
        res.status(500).json({sataus:500, message:"Error Inesperado"})
    }
}



async function deleteOne(req:Request, res:Response){
    try{
        const cod_sector = req.params.cod_sector
        const today = new Date().toISOString().split('T')[0];
        const turnos = await em.find(Turno,{sector:{cod_sector}})
        const past_turnos = turnos.filter((t)=>t.fecha<=today)
        const future_turnos = turnos.filter((t)=>t.fecha>today)
        if(turnos.length === 0){
            const sector =  await em.findOne(Sector,{cod_sector},{populate:['actividades']})
            if(sector !==null){
                if(sector.actividades.length===0){
                    await em.nativeDelete(Sector,{cod_sector})
                    res.status(200).json({status:200, message:"Sector Eliminado"})
                }else{
                    em.assign(sector,{habilitado:false,})
                    em.flush()
                    await em.nativeDelete(Actividad,{cod_sector: {cod_sector}});
                    res.status(200).json({status:200, message:"Sector Inhabilitado"})                    
                }
            }
        }else if(past_turnos.length !== 0){
          const sector = await em.findOneOrFail(Sector,{cod_sector})
          em.assign(sector,{habilitado:false,})
          em.flush()
          if(future_turnos.length !== 0) await em.nativeDelete(Turno, {sector: {cod_sector},fecha: { $gt: today },});
          res.status(200).json({status:200, message:"Sector Inhabilitado"})
        }
    }catch(e){
        console.log(e)
        res.status(500).json({status:500, message:"Error Inesperado"})
    }
}



export { getAll, getOne, deleteOne, add, modificar,sanitizarInputSector, getSectoresXTurnoByDate }
