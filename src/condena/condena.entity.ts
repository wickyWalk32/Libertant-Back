import { Entity, PrimaryKey, Property, ManyToMany, Cascade, Rel, ManyToOne, PrimaryKeyProp } from "@mikro-orm/core";
import { Recluso } from "../recluso/recluso.entity.js";
import { Pena } from "../pena/pena.entity.js";
import { Sector } from "../sector/sector.entity.js";
import { emit } from "process";

@Entity()
export class Condena {
    
    @ManyToOne(() => Pena, {nullable: false,})
    pena!: Rel<Pena>;

    @PrimaryKey({autoincrement:true})
    nro_condena!: number;
    
    @Property( {nullable: true, unique: false} )
    descripcion ?: string
    
    @Property( {nullable: false, unique: false} )
    duracion_anios !: number
    
    @Property( {nullable: false, unique: false} )
    duracion_meses !: number
    
    @Property( {nullable: false, unique: false} )
    duracion_dias !: number
    
    @Property( {nullable: false, unique: false} )
    orden_de_gravedad !: number

    //METODOS
    // dada una condena, modificar la pena.fecha_fin_estimada
modificarPena(condena_modificada:Condena, fecha_liberacion_estimada:Date){
    const anios = condena_modificada.duracion_anios - this.duracion_anios
    const meses = condena_modificada.duracion_meses - this.duracion_meses
    const dias = condena_modificada.duracion_dias - this.duracion_dias
    if(this.pena!=undefined){
    try{
        const fecha = new Date(fecha_liberacion_estimada)
        fecha.setFullYear(fecha.getFullYear() + anios);
        fecha.setMonth(fecha.getMonth() + meses);
        fecha.setDate(fecha.getDate() + dias);
        this.pena.fecha_fin_estimada = fecha
        return this.pena.fecha_fin_estimada
    } catch (e){
        console.log(e)
    }
    }
}

}
