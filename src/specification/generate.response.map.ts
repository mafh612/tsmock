import {
  KeyValue,
  MediaType,
  objectToArray,
  Openapi,
  Operation,
  Parameter,
  Path,
  Response,
  ResponseMap,
  sanitizeUrl,
  Schema
} from '../util'

let spec: Openapi
const methods: string[] = ['delete', 'get', 'head', 'options', 'patch', 'post', 'put']

export const generateResponseMap: (src: Openapi) => ResponseMap = (src: Openapi): ResponseMap => {
  spec = src
  const responseMap: ResponseMap = {}
  objectToArray<Path>(src.paths).forEach((pathKv: KeyValue<Path>) => {
    const url: string = sanitizeUrl(pathKv.key)
    const path: Path = pathKv.value

    // initialize responseMap
    responseMap[url] = {}

    // cycle methods
    methods.forEach((method: string) => {
      if (method in path) {
        const operation: Operation = (path as any)[method]

        // initialize methods for urls
        responseMap[url][method] = {}

        // cycle responses
        objectToArray(operation.responses).forEach((resKv: KeyValue<Response>) => {
          const response: Response = resKv.value

          // initialize responses for ,methods
          responseMap[url][method][+resKv.key] = {}

          // cycle schemas
          objectToArray(response.content).forEach((mtKv: KeyValue<MediaType>) => {
            const mediaType: MediaType = mtKv.value
            let schema: Schema

            if (mediaType.schema.$ref) {
              schema = resolveReference(mediaType.schema.$ref) as Schema
            } else if (mediaType.schema.type) {
              schema = mediaType.schema
            }

            responseMap[url][method][+resKv.key][mtKv.key] = {
              example: generateFromExample(schema),
              generated: generateFromProperties(schema)
            }
          })
        })
      }
    })
  })

  return responseMap
}

const generateFromProperties: (schema: Schema) => any = (schema: Schema): any => {
  if (!schema) {
    return
  }

  let generated: any

  if (schema.type === 'string') {
    generated = 'OK'
  }

  if (schema.properties) {
    generated = {}
    const properties: { [key: string]: Schema } = schema.properties

    Object.keys(properties).forEach((propertyKey: string) => {
      if (properties[propertyKey].$ref) {
        const subschema: Schema = resolveReference(properties[propertyKey].$ref) as Schema

        generated[propertyKey] = generateFromProperties(subschema)
      }

      const property = properties[propertyKey]

      switch (property.type) {
        case 'boolean':
          generated[propertyKey] = true
          break
        case 'number':
          generated[propertyKey] = handleNumberFormats(property.format)
          break
        case 'string':
          generated[propertyKey] = handleStringFormats(property.format)
          break
      }
    })
  }

  return generated
}

const handleNumberFormats: (format: string) => number = (format: string): number => {
  switch (format) {
    case 'int32':
      return 16000
    case 'int64':
      return 32000
    case 'float':
      return +(Math.random() * 2).toPrecision(8)
    case 'double':
      return +(Math.random() * 2).toPrecision(2)
    default:
      return Math.ceil(Math.random() * 2)
  }
}

const handleStringFormats: (format: string) => string = (format: string): string => {
  switch (format) {
    case 'byte':
      return 'ZW5jb2RlIGJhc2U2NA=='
    case 'binary':
      return '10000001'
    case 'date':
      return new Date().toLocaleDateString()
    case 'date-time':
      return new Date().toISOString()
    case 'password':
      return '********'
    default:
      return 'text'
  }
}

const generateFromExample: (schema: Schema) => object = (schema: Schema): object => {
  return schema && schema.example
}

export const resolveReference: (ref: string) => Schema | Parameter | Response = (
  ref: string
): Schema | Parameter | Response => {
  const [, , type, name] = ref.split('/')

  switch (type) {
    case 'schemas':
      return spec.components[type][name] as Schema
    case 'parameters':
      return spec.components[type][name] as Parameter
    case 'responses':
      return spec.components[type][name] as Response
    default:
      return
  }
}
