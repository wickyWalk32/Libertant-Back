import * as v from 'valibot';

export const sectorSchema = v.object({

  cod_sector: v.pipe(
    v.string(),
    v.trim(),
    v.transform((value) => value.toUpperCase()),
    v.regex(
      /^[A-Z]{1,2}$/,
      'Solo letras A-Z, máximo 2 caracteres'
    )
  ),

  nombre: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, 'Nombre requerido'),
    v.maxLength(100, 'Máximo 100 caracteres'),
    v.regex(
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ1-9\s]+$/,
      'Solo letras y espacios'
    )
  ),

  descripcion: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, 'Descripción requerida'),
    v.maxLength(500, 'Máximo 500 caracteres')
  ),
  habilitado: v.pipe(
  v.nullable(v.optional(v.boolean())),
  v.transform((value) => value ?? true)
),

  actividades: v.optional(
    v.array(
      v.object({
        cod_actividad: v.pipe(
          v.number(),
          v.minValue(1)
        )
      })
    )
  )

});

export const valibot_sector = v.safeParserAsync(sectorSchema)