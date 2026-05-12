import { Entity, ManyToOne, Property, Rel, PrimaryKeyProp, PrimaryKey, ManyToMany, Cascade, OneToOne, OneToMany, Collection } from "@mikro-orm/core";
import { Recluso } from "../recluso/recluso.entity.js";
import { Condena } from "../condena/condena.entity.js";



@Entity()
export class Pena {

    @PrimaryKey( {autoincrement: true })
    cod_pena !: number

    @Property({ nullable : false})
    fecha_ini !: Date
    
    @Property({unique : false, nullable : true})
    fecha_fin_estimada ?: Date
    
    @Property({unique : false, nullable : true})
    fecha_fin_real ?: Date
    
    @OneToMany(() => Condena, (condena) => condena.pena, {cascade: [Cascade.ALL],})
    condenas = new Collection<Condena>(this);
    
    @ManyToOne(() => Recluso, { nullable: false })
    recluso !: Rel<Recluso>
}
