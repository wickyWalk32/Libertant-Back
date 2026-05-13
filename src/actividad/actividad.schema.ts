import * as v from 'valibot';

function horaAMinutos(hora: string): number {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}

const HHMM_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const actividadSchema = v.pipe(
  v.object({
    
    cod_actividad: v.optional(
      v.pipe(
        v.number(),
        v.minValue(1)
      )
    ),

    nombre: v.pipe(
      v.string(),
      v.trim(),
      v.minLength(1, 'Nombre requerido'),
      v.maxLength(100, 'Máximo 100 caracteres')
    ),

    descripcion: v.optional(
      v.pipe(
        v.string(),
        v.trim(),
        v.maxLength(500, 'Descripción demasiado larga')
      )
    ),

    dia_de_la_semana: v.pipe(
      v.string(),
      v.trim(),
      v.transform((value)=>value.toLowerCase()),
      v.picklist(
        [
          'lunes',
          'martes',
          'miercoles',
          'miércoles',
          'jueves',
          'viernes',
          'sabado',
          'sábado',
          'domingo'
        ],
        'Día inválido'
      )
    ),

    hora_inicio: v.pipe(
      v.string(),
      v.regex(
        HHMM_REGEX,
        'Formato inválido HH:mm'
      ),

      v.check((hora) => {
        const minutos = horaAMinutos(hora);
        return minutos >= 720 && minutos <= 1080;
      }, 'Hora inicio debe ser entre 12:00 y 18:00')
    ),

    hora_fin: v.pipe(
      v.string(),
      v.regex(
        HHMM_REGEX,
        'Formato inválido HH:mm'
      )
    ),

    cant_cupos: v.pipe(
      v.union([v.string(), v.number()]),
      v.transform((value) => Number(value)),
      v.number('La cantidad de cupos debe ser un número'),
      v.minValue(5, 'Debe haber al menos 5 cupos')
    ),

    cod_sector: v.pipe(
      v.string(),
      v.trim(),
      v.transform(value=>value.toUpperCase()),
      v.regex(
        /^[A-Za-z]{1,2}$/,
        'Solo letras (A-Z), máximo 2 caracteres'
      )
),

    reclusos: v.optional(
      v.array(
        v.object({
          cod_recluso: v.pipe(
            v.number(),
            v.minValue(1) )
        })
      )
    )

  }),

  v.forward(
    v.check((actividad) => {
      const inicio = horaAMinutos(actividad.hora_inicio);
      const fin = horaAMinutos(actividad.hora_fin);
      const diferencia = fin - inicio;
      return diferencia >= 60 && diferencia <= 120;
    }, 'La duración debe ser entre 1 y 2 horas'),
    ['hora_fin']
  )

);

export const valibot_actividad = v.safeParserAsync(actividadSchema)