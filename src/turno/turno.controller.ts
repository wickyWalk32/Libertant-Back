import { Request, Response, NextFunction } from "express"
import { Turno } from './turno.entity.js'
import { orm } from "../shared/db/orm.js"
import { Guardia } from "../guardia/guardia.entity.js";
import { Sector } from "../sector/sector.entity.js";
import { valibot_turno } from "./turno.schema.js";

const em = orm.em
em.getRepository(Sector)


async function turnoSanitizer(req:Request,res:Response,next:NextFunction){
  try{ 
    const incoming = await valibot_turno(req.body)
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
        const turnos = await em.find(Turno,{})
        res.status(200).json({ status:200, data: turnos})
    } catch (e:any) {
        res.status(404).json({ status:404, message:"No se encontro ningun turno"})
    }
}

async function getFromSector(req:Request, res:Response){
    try{
        const cod_sector =  req.params.cod_sector.toUpperCase()
        const turnos = await em.find(Turno,{sector:{cod_sector}})
        res.status(200).json({ status:200, data: turnos})
    } catch (e) {
        res.status(500).json({ status:500, message:"Error Inesperado"})
    }
}

async function add(req:Request, res:Response) {
    try{
      const guardia = await em.findOneOrFail(Guardia,{ cod_guardia:req.body.sanitized_input.cod_guardia })
      const sector = await em.findOneOrFail(Sector, {cod_sector: req.body.sanitized_input.cod_sector})
      if(guardia != null && sector!=null){
        const turno = {
            fecha:req.body.sanitized_input.fecha,
            tipo_turno:req.body.sanitized_input.tipo_turno,
            guardia,
            sector
        }
        em.create(Turno,turno)
        //em.persist(turno) error
        await em.flush()
        res.status(201).json({status:201, message:"Turno Creado"})
      }

    } catch (error: any) {
        console.log(error)
        res.status(500).json({ status: 500, message: error.message})
    }
}
async function addTurnos(req:Request, res:Response){
  try{
    const {cod_sector,dias,tipo_turno,guardias} = req.body
    const fechas = getFechasDeDiasSemana(dias);
    const sectores = await em.find(Sector,{});
    let cod_guardias:Guardia[]=[]
    for(const g of guardias){
      let guar = await em.findOne(Guardia, { cod_guardia: g.cod_guardia });
      if(guar?.fecha_fin_contrato){
        res.status(409).json({status:409,
          message:`Error: Guardia ${guar.nombre} ${guar.apellido}. Cod. ${guar.cod_guardia}
           no posee un contrato activo`})
           return;
      }
      cod_guardias.push(guar as Guardia);        
    }
    console.log(cod_guardias)
    let turno:Turno|false|string;
    let fechas_sin_turno = 0;
    let cant_turnos = 0;

    let turnos_creados:any = [];
    for(const guardia of cod_guardias){
        if(fechas_sin_turno===fechas.length)break;
        cant_turnos = 0
        fechas_sin_turno = 0
        for(const fecha of fechas){
            for(const sector of sectores){
                turno = await crearTurno(fecha,tipo_turno,guardia,sector)
                let situacion!:string
                if(turno){   
                  if(turno.cod_turno) situacion = 'EXISTENTE'
                  if(!turno.cod_turno) situacion = 'CREADO'
                  turnos_creados.push({turno,situacion})
                  cant_turnos +=1
                  break;                      
                }
                if(!turno && sector === sectores.at(-1)){
                    console.log(turno,sector, sectores.at(-1))
                   fechas_sin_turno+=1 
                   turnos_creados.push(fecha.toISOString().split("T")[0]+ ' OCUPADO')
                } 
            }
        }
    }
    let guardias_con_turno = '';
    for(let x = 0; x<cod_guardias.length;x++){
        guardias_con_turno += guardias[x].nombre+' ' +guardias[x].apellido+'. '
    }
    res.status(201).json({status:201, data:turnos_creados,
         message:`Se crearon/trajeron los turnos de los guardias: ${guardias_con_turno}`})
  }catch(e:any){
    res.status(500).json({status:500,message:e.error})
  }

}

async function deleteTurno(req:Request, res:Response){
    try{
    const{fecha,tipo_turno,cod_sector,cod_guardia}= req.params
    const tipo = tipo_turno as 'M' | 'T' | 'N'
    await em.nativeDelete(Turno,{fecha,tipo_turno:tipo,
        guardia: { cod_guardia: Number(cod_guardia) },
        sector: { cod_sector }
    })
    res.status(200).json({status:200, message: "Turno Eliminado"})
    } catch(e){
    console.log(e)
    res.status(500).json({status:500, message: "Error inesperado"})
    }
}

// dados dias de semana ej: lunes a a viernes dar fechas desde dia siguiente a hoy
//  hasta 2 meses despues
function getFechasDeDiasSemana(days:number[]) {
  const dates:Date[] = [];
  const today = new Date();
  const current = new Date(today);

  current.setDate(current.getDate()); // dia siguiente
  // current.setDate(current.getDate() + 1); // dia siguiente

  const end = new Date(today);
  end.setMonth(end.getMonth() + 2); // +2 meses

  while (current <= end) {
    if (days.includes(current.getDay())) {
      dates.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }

  return dates;
}




async function crearTurno(fecha:Date,tipo_turno:'M'|'T'|'N',
    guardia:Guardia, sector:Sector){
    try{
        const turno_existente = await em.findOne(Turno,{
            fecha:fecha.toISOString().split("T")[0],
            tipo_turno:tipo_turno,
            guardia:guardia,
            sector:sector
        })

        if(turno_existente!==null){ return turno_existente}
        const turnoData = {
            fecha:fecha.toISOString().split("T")[0],
            tipo_turno,
            guardia,
            sector
        }
        const turno = em.create(Turno,turnoData)
        em.persist(turno)
        await em.flush()
        return turnoData
    }catch(e){
        console.log(e)
        return false
    }
}


export { getAll, getFromSector, add, addTurnos, deleteTurno, turnoSanitizer}

