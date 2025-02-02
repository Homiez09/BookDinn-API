import { Elysia } from 'elysia'
import { bearer } from '@elysiajs/bearer'
import { jwt } from '@elysiajs/jwt'

export const middleware = new Elysia()
.use(bearer())
.use(jwt({
  secret: process.env.JWT_SECRET || 'secret key', 
}))