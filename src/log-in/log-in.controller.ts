
import { Request, Response, NextFunction } from "express"
import { orm } from "../shared/db/orm.js"
import { Administrador } from '../administrador/administrador.entity.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { LogInSchema } from "./login.schema.js"
import bcrypt from "bcrypt"
import * as v from "valibot"
dotenv.config()

function input_sanitizer(req: Request, res:Response, next:NextFunction){
    try{
        req.body.sanitized_input = v.parse(LogInSchema, req.body)
    }catch (e){
        console.log(e)
          if (v.isValiError<typeof LogInSchema>(e)) {
         console.log(e.issues);
         res.status(401).json({status:401, message:e.issues[0].message})
         return
  }
    }
    next()
}




function generateToken(userData:Administrador){
    return jwt.sign(userData,process.env.SECRET_KEY as string) 
}
// , {expiresIn: '1h'}

const em = orm.em
em.getRepository(Administrador)
async function logIn(req: Request, res: Response){
    // SE GENERA EL TOKEN Y E ENVIA AL CLIENTE
    try {
        const email = req.body.user_name //email
        const administrador = await em.findOneOrFail(Administrador, { email })
    if(!administrador) return res.status(401).json({ status: 401, message: "Email incorrecto"} )
        const jwtToken = generateToken(Object.assign({},administrador))
    const valid_password = await bcrypt.compare(req.body.password, administrador.contrasenia);
        if(valid_password){
            res.status(202).json(
              { 
                status: 202,
                data:{ email:administrador.email,
                       especial:administrador.especial } ,
                token: jwtToken
              } )
        } else {
            res.status(401).json({ status: 401, message: "Contraseña incorrecta"} )
        }
    } catch (error: any){
        res.status(404).json({ status: 404, message: "Usuario no encontrado"} )
    }
}


async function verifyCaptcha(req: Request, res: Response,next:NextFunction){
  const secret = process.env.YOUR_SITE_SECRET_KEY;
  const params = new URLSearchParams();
  params.append("secret", secret!);
  params.append("response", req.body.sanitized_input.captchaToken);
  const response = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params
    }
  );

  const data = await response.json();
  console.log("captcha result:", data);
    if (!data.success) {
      return res.status(403).json({message: "Captcha verification failed",});
    }
    next()
}
export { logIn, generateToken, input_sanitizer,verifyCaptcha }