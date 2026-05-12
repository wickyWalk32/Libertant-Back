import { Entity, PrimaryKey, Property, OneToMany, Collection } from "@mikro-orm/core";
import { Actividad } from "../actividad/actividad.entity.js";
import { Turno } from "../turno/turno.entity.js";

@Entity()
export class Sector {
    @PrimaryKey({ nullable: false, unique: true})
    cod_sector !: string

    @Property({ nullable: false, unique: true})
    nombre !: string

    @Property({ nullable: false, unique: false})
    descripcion !: string

    @Property({ nullable: true, unique: false})
    habilitado !: boolean

    @OneToMany(()=> Actividad ,(actividad)=>actividad.cod_sector)
    actividades:Actividad[]=[]

    @OneToMany(() => Turno,(turno)=>turno.sector)
    turnos = new Collection<Turno>(this);
}
