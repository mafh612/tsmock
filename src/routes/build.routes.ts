import { Context, Middleware } from 'koa'
import * as KoaRouter from 'koa-router'
import { Methods, MockParam, Next, ResponseMap, sanitizeUrl } from '../util'

interface DefinedResponses {
  [status: number]: { [mediatype: string]: { generated: any; example: any } }
}

const router: KoaRouter = new KoaRouter<{}, {}>()

export const buildRoutes: (responseMap: ResponseMap) => Middleware = (responseMap: ResponseMap): Middleware => {
  Object.keys(responseMap).forEach((urlKey: string) => {
    const url: string = sanitizeUrl(urlKey)
    Object.keys(responseMap[url]).forEach((methodKey: Methods) => {
      router[methodKey](url, createMiddleware(responseMap[urlKey][methodKey]))
    })
  })

  return router.routes()
}

export const createMiddleware: (definedResponses: DefinedResponses) => Middleware = (
  definedResponses: DefinedResponses
): Middleware => {
  return (ctx: Context, next: Next): Promise<void> => {
    const status: number = +getParameter(MockParam.STATUS, ctx) || 200
    const mediatype: string = getParameter(MockParam.MEDIATYPE, ctx)
    const responsetype: 'generated' | 'example' = getParameter(MockParam.RESPONSETYPE, ctx) as 'generated' | 'example'
    const body: object = getBody(definedResponses, status, mediatype, responsetype)

    ctx.status = !!body ? status : 409
    ctx.set('Content-Type', mediatype)
    ctx.body = !!body ? body : { ERROR: 'requested content not implemented', definedResponses }

    return next()
  }
}

export const getParameter: (mockParam: MockParam, ctx: Context) => string = (
  mockParam: MockParam,
  ctx: Context
): string => {
  if (ctx.cookies.get(mockParam)) {
    return ctx.cookies.get(mockParam)
  } else if (ctx.get(mockParam)) {
    return ctx.get(mockParam)
  } else if (ctx.request.query[mockParam]) {
    return ctx.request.query[mockParam]
  } else {
    return
  }
}

export const getBody: (
  definedResponses: DefinedResponses,
  status: number,
  mediatype: string,
  responsetype: 'generated' | 'example'
) => object = (
  definedResponses: DefinedResponses,
  status: number,
  mediatype: string,
  responsetype: 'generated' | 'example'
): object => {
  try {
    const firstStatusKey: number = +Object.keys(definedResponses)[0]
    const statusObj: { [mediatype: string]: { generated: any; example: any } } =
      status && definedResponses && definedResponses[status]
        ? definedResponses[status]
        : definedResponses[firstStatusKey]

    const firstMediatypeKey: string = Object.keys(statusObj)[0]
    const mediatypeObj: { generated: any; example: any } =
      statusObj && statusObj[mediatype] ? statusObj[mediatype] : statusObj[firstMediatypeKey]

    const responsetypeObj: any =
      mediatypeObj && mediatypeObj[responsetype]
        ? mediatypeObj[responsetype]
        : mediatypeObj.example
        ? mediatypeObj.example
        : mediatypeObj.generated

    return responsetypeObj
  } catch (e) {
    console.log(e) // tslint:disable-line
  }
}
