import { objectToArray, sanitizeUrl } from '../../src/util'

describe('functions', () => {
  test('sanitizeUrl', async () => {
    expect(sanitizeUrl('/test/{parameter}')).toEqual('/test/:parameter')
  })

  test('objectToArray', async () => {
    const testObj: { [key: string]: string } = {
      key: 'value'
    }

    expect(objectToArray(testObj)).toEqual([{ key: 'key', value: 'value' }])
  })

  test('objectToArray - undefined object', async () => {
    const testObj: { [key: string]: string } = undefined

    expect(objectToArray(testObj)).toEqual([])
  })
})
