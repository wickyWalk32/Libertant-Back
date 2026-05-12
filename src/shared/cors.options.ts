//options for cors midddleware
import cors from 'cors'
import dotenv from 'dotenv'

const FRONTEND_URL = process.env.FRONTEND_URL

export const corsOptions: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'Authorization',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: `${FRONTEND_URL}`,
  preflightContinue: false,
};