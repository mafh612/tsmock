import { Middleware } from 'koa'
import * as KoaRouter from 'koa-router'
import { resolve } from 'path'
import { buildRoutes } from '../../src/routes'

beforeAll(() => {
  process.argv[2] = resolve('__assets__', 'petstore.yaml')
})

describe('routes test', () => {
  test('buildRoutes', async () => {
    const middleware: Middleware = buildRoutes({})
    expect(middleware).toBeInstanceOf(Object)
  })
})
