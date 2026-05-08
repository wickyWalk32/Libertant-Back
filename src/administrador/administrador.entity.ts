import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Administrador {
    @PrimaryKey({ nullable: false, unique: true, primary: true })
    cod_administrador !: number
    
    @Property({ nullable: false})
    especial !: boolean

    @Property({ nullable: false, unique:true})
    email !: string

    @Property({ nullable: false})
    fechaCreacion !: Date

    @Property({nullable: false})
    contrasenia !: string
}   
