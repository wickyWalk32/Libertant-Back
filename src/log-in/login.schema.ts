import * as v from "valibot"

export const LogInSchema = v.object({
  user_name: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(4),
    v.maxLength(35),
    v.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Formato de email Invalido')
  ),
    password: v.pipe(
    v.string(),
    v.minLength(4),
    v.maxLength(35),
    v.regex(/^[a-zA-Z0-9]+$/)
  ),
  captchaToken: v.pipe(
    v.string('El token debe ser string'),
    v.minLength(1,'El token esta vacio'),
  )
})