import * as Koa from 'koa'
import * as mount from 'koa-mount'
import * as serve from 'koa-static'
import { buildDocumenation } from './doc/build.documentation'
import { buildRoutes } from './routes'
import { generateResponseMap, loadSpecification } from './specification'
import { Openapi, ResponseMap } from './util'

const [, , filename]: string[] = process.argv

const port: number = 5000
const app: Koa = new Koa<{}, {}>()

const openapi: Openapi = loadSpecification(filename)
const responseMap: ResponseMap = generateResponseMap(openapi)
const documentationMiddleware: Koa.Middleware = buildDocumenation(openapi)
const routeMiddleware: Koa.Middleware = buildRoutes(responseMap)

app.use(mount('/ui', serve('view')))
app.use(documentationMiddleware)
app.use(routeMiddleware)

app.listen(port)
