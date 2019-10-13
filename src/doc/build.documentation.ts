import { Context, Middleware } from 'koa'
import * as KoaRouter from 'koa-router'
import { Openapi } from '../util'

export const buildDocumenation: (openapi: Openapi) => Middleware = (openapi: Openapi): Middleware => {
  const router: KoaRouter = new KoaRouter<{}, {}>()

  router.get(
    '/ui/doc',
    async (ctx: Context, next: () => Promise<void>): Promise<void> => {
      ctx.body = openapi

      return next()
    }
  )

  return router.routes()
}
