import { resolve } from 'path'
import { loadSpecification } from '../../src/specification'
import { Openapi } from '../../src/util'

describe('spec test', () => {
  test('loadSpecification', async () => {
    const openapi: Openapi = loadSpecification('__assets__/test.yml')
    expect(openapi).not.toBeUndefined()
  })
})
