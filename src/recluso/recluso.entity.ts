import 'reflect-metadata'; 
import { Entity, PrimaryKey, Property, ManyToMany, OneToMany, OneToOne, Collection, Cascade } from "@mikro-orm/core";
import { Actividad } from "../actividad/actividad.entity.js";
import { Condena } from "../condena/condena.entity.js";
import { Pena } from "../pena/pena.entity.js";

@Entity()
export class Recluso {
    
    @PrimaryKey({ nullable: false, unique: true})
    cod_recluso !: number ; // el !: significa que esta propiedad no puede ser nula
    
    @Property({ nullable: false})
    nombre !: string ;
    
    @Property({ nullable: false})
    apellido !: string;
    
    @Property({ nullable: false, type:'string'}) // type number has int limits ( 2,147,483,647 max or error)
    dni !: number;
    
    @Property({ nullable: false})
    fecha_nac !: Date;

    @ManyToMany(() => Actividad, (actividad) => actividad.reclusos, {eager: true,owner:true}) //, cascade: [Cascade.ALL], owner: false
    actividades = new Collection<Actividad>(this);
    
    @OneToMany(()=>Pena, pena => pena.recluso, {cascade: [Cascade.ALL],eager: true})
    penas = new Collection<Pena>(this);
    

    // METODOS
 asignarPena(condenas:Condena[]){
  let anios = 0
  let meses = 0
  let dias = 0
  condenas.forEach((condena)=>{
    anios+=condena.duracion_anios
    meses+=condena.duracion_meses
    dias+=condena.duracion_dias

  })

        let pena:Pena
        pena = new Pena()
        const fecha_ini = new Date()
        pena.fecha_ini = new Date()
        pena.fecha_fin_estimada = fecha_ini
        pena.fecha_fin_estimada.setFullYear(pena.fecha_fin_estimada.getFullYear() + anios);
        pena.fecha_fin_estimada.setMonth(pena.fecha_fin_estimada.getMonth() + meses);
        pena.fecha_fin_estimada.setDate(pena.fecha_fin_estimada.getDate() + dias);
        //this.penas.push(pena)
        condenas.forEach((condena)=>{
          condena.pena = pena
        })
      
  }
asignarPena_(condenas: Condena[]) {

  let anios = 0;
  let meses = 0;
  let dias = 0;

  condenas.forEach((condena) => {
    anios += condena.duracion_anios;
    meses += condena.duracion_meses;
    dias += condena.duracion_dias;
  });

  const pena = new Pena();
  pena.recluso = this;
  const fechaInicio = new Date();
  pena.fecha_ini = fechaInicio;
  const fechaFin = new Date(fechaInicio);

  fechaFin.setFullYear(fechaFin.getFullYear() + anios);
  fechaFin.setMonth(fechaFin.getMonth() + meses);
  fechaFin.setDate(fechaFin.getDate() + dias);

  pena.fecha_fin_estimada = fechaFin;
  pena.condenas = new Collection<Condena>(pena);
  this.penas.add(pena);

  for (const condena of condenas) {

    // si condena NO es entidad, esto es clave:
    const c = condena instanceof Condena? condena: new Condena();
    Object.assign(c, condena);

    c.pena = pena;
    pena.condenas.add(c);
  }

  return pena;
}
}

