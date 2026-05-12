import * as v from 'valibot';

export const reclusoSchema = v.object({
  cod_recluso: v.optional(v.number()),

  nombre: v.pipe(
    v.string(),
    v.minLength(1, 'El nombre es obligatorio'),
    v.maxLength(35, 'Máximo 35 caracteres'),
    v.regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,"No usar numeros ni caracteres especiales")
  ),

  apellido: v.pipe(
    v.string(),
    v.minLength(1, 'El apellido es obligatorio'),
    v.maxLength(35, 'Máximo 35 caracteres'),
    v.regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,"No usar numeros ni caracteres especiales")
  ),

  dni: v.pipe(
    v.number(),
    v.minValue(10000000, 'DNI inválido')
  ),

  fecha_nac: v.pipe(
    v.union([v.string(), v.date()]),
    v.transform((value) => new Date(value)),
    v.check((date) => !isNaN(date.getTime()), 'Fecha inválida')
  ),

  pena: v.optional(
    v.object({
  fecha_ini: v.pipe(
    v.union([v.string(), v.date()]),
    v.transform((value) => new Date(value)),
    v.check((date) => !isNaN(date.getTime()), 'Fecha inválida')
  ),

  condenas: v.optional(v.array(v.any()))
    })
  ),

});


export const valibot_recluso = v.safeParserAsync(reclusoSchema)