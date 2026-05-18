# BackEnd-Proyecto

Integrantes: Chaparro Ignacio

Descripción:
Libertadnt es un sistema de gestión carcelario, se encarga de la administración tanto del personal de seguridad como de los reclusos, cuenta tanto con una base de datos para poder contabilizar e indicar cada preso y su sector asignado, como sus actividades diarias y el personal de seguridad asignado.

# Inicializar Proyecto

## Variables de ambiente (.env)

Crear archivo .env en carpeta BackEnd-Proyecto y nombrar las siguientes valiables de ambiente (ejemplo):

### Back-End

- API_URL = 'localhost:8080/'
- FRONTEND_URL= 'http://localhost:4200'
- DATABASE_PASSWORD = "password"

  #### jwt

- SECRET_KEY = clave_secreta_para_generar_verificar_token

  #### Captcha

- YOUR_SITE_KEY = clave_publica_del_google_captcha
- YOUR_SITE_SECRET_KEY = clave_secreta_del_google_captcha

#### Usuario precargado con todos los permisos

- USUARIO_MAIN_EMAIL = juansoyyo@gmail.com
- USUARIO_MAIN_PASSWORD = juansoyyo

### TESTS

- VALID_TOKEN_TEST = 'eyferferferferferefr'

## EJECUTAR APLICACION

Con el terminal (cmd, powershell) ubicarse en la carpeta /BackEnd-Proyecto

- pnpm install
- pnpm start

## Ejecutar Tests

- pnpm testdb (activar mikroorm en db de testing)
- pnpm test (Para ejecutar los tests armados con jest)

# Documentacion

Documentacion con swagger en http://localhost:8080/docs

# Deploy

# Deploy Backend con Cloudflare Tunnel — Libertant

## Requisitos previos

- Tener una cuenta en Cloudflare
- Tener un dominio agregado en Cloudflare Dashboard
- Tener el backend corriendo con `pnpm`
- Tener `cloudflared` instalado en Windows

## Opción gratuita

Cloudflare Tunnel incluye una opción gratuita que permite exponer servicios locales con HTTPS y dominio estable sin abrir puertos en el router. No apto para produccion.

- Ejecutar en powershel y copiar la url random generada

```powershell
cloudflared tunnel --url http://localhost:8080
```

---

# 1. Instalar cloudflared en Windows

Instalar desde PowerShell:

```powershell
winget install Cloudflare.cloudflared
```

O descargar manualmente:

https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/

Verificar instalación:

```powershell
cloudflared --version
```

---

# 2. Autenticar cloudflared

Iniciar sesión con Cloudflare:

```powershell
cloudflared tunnel login
```

Esto abrirá el navegador para autorizar acceso al dominio.

Las credenciales se guardan automáticamente en:

```txt
%USERPROFILE%\.cloudflared\
```

---

# 3. Crear un Tunnel

Crear el tunnel:

```powershell
cloudflared tunnel create libertant-backend
```

Cloudflare devolverá un `Tunnel ID` y generará automáticamente el archivo de credenciales.

---

# 4. Configurar el dominio

Crear el archivo:

```txt
C:\Users\TU_USUARIO\.cloudflared\config.yml
```

Contenido:

```yaml
tunnel: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
credentials-file: C:\Users\TU_USUARIO\.cloudflared\xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.json

ingress:
  - hostname: api.libertant.com
    service: http://localhost:3006

  - service: http_status:404
```

Reemplazar:

- `api.libertant.com`
- `TUNNEL_ID`
- paths reales de Windows

---

# 5. Crear el DNS automáticamente

Ejecutar:

```powershell
cloudflared tunnel route dns libertant-backend api.libertant.com
```

Esto crea automáticamente el registro DNS asociado al tunnel.

---

# 6. Levantar el backend y el tunnel

## Terminal 1 (WSL) — iniciar backend

- cd a ../BackEnd-Proyecto

```bash
pnpm start
```

## Terminal 2 (PowerShell) — iniciar tunnel

```powershell
cloudflared tunnel run libertant-backend
```

El backend quedará accesible desde:

```txt
https://api.libertant.com
```

---

# 7. Actualizar la URL en el frontend

Modificar en .env:

```txt
FRONTEND_URL = https://libertant-front-end.vercel.app
```

```ts
export const environment = {
  API_URL: 'https://api.libertant.com/',
};
```

Luego redeployar el frontend:

```bash
vercel deploy --prod
```

---

# 8. Actualizar la URL en el backend

En el `.env`:

```env
FRONTEND_URL=https://libertant-front-end.vercel.app
```

---

# Ejecutar cloudflared como servicio (Opcional)

Instalar como servicio de Windows:

```powershell
cloudflared service install
```

Iniciar el servicio:

```powershell
Start-Service cloudflared
```

Esto permite que el tunnel permanezca activo después de reinicios.

---

# Notas

- El backend debe tener CORS habilitado para:

```txt
https://libertant-front-end.vercel.app
```

---
