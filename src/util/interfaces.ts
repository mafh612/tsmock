export interface ResponseMap {
  [method: string]: {
    [url: string]: {
      [status: number]: {
        [mediatype: string]: {
          generated: any
          example: any
        }
      }
    }
  }
}

export interface Reference {
  $ref: string
}

export interface Openapi {
  openapi: string
  info: Info
  servers: Server[]
  paths: { [key: string]: Path }
  components: Components
}

export interface Components {
  parameters: { [key: string]: Parameter }
  responses: { [key: string]: Response }
  schemas: { [key: string]: Schema }
}

export interface Parameter extends Reference {
  allowEmptyValue: boolean
  deprecated: boolean
  description: string
  in: string
  name: string
  required: boolean
  schema: Schema
}

export interface Schema extends Reference {
  additionalProperties: Schema
  allOf: Schema[]
  anyOf: Schema
  default: string
  deprecated: boolean
  description: string
  discriminator: Discriminator
  enum: string[]
  example: any
  externalDocs: ExternalDocumentation
  format: string
  items: Schema
  oneOf: Schema[]
  pattern: string
  properties: { [key: string]: Schema }
  readonly: boolean
  required: string[]
  title: string
  type: string
  writeonly: boolean
  xml: XML
  // maxItems: string
  // maxLength: string
  // maxProperties: string
  // maximum: string
  // minItems: string
  // minLength: string
  // minProperties: string
  // minimum: string
  // multipleOf: string
  // not: string
  // uniqueItems: string
  // exclusiveMaximum: string
  // exclusiveMinimum: string
}

export interface MediaType {
  encoding: { [key: string]: Encoding }
  example: any
  examples: { [key: string]: any }
  schema: Schema
}

export interface Info {
  title: string
  description: string
  termsOfService: string
  contact: Contact
  license: License
  version: string
}

export interface Contact {
  name: string
  url: string
  email: string
}

export interface License {
  name: string
  url: string
}

export interface Server {
  url: string
  description: string
  variables?: { [key: string]: ServerVariableObject }
}

export interface ServerVariableObject {
  enum: string[]
  default: string
  description: string
}
export interface PathIndexSignature {
  [key: string]: Operation
}

export interface Path extends Reference {
  summary: string
  description: string
  get: Operation
  put: Operation
  post: Operation
  delete: Operation
  options: Operation
  head: Operation
  patch: Operation
  trace: Operation
  servers: Server[]
  parameters: Parameter[]
}

export interface Operation {
  tags: string[]
  summary: string
  description: string
  externalDocs: ExternalDocumentation
  operationId: string
  parameters: Parameter[]
  requestBody: RequestBody
  responses: { [key: string]: Response }
  deprecated: boolean
  security: { [key: string]: string[] }
  servers: Server[]
}

export interface ExternalDocumentation {
  description: string
  url: string
}

export interface Response extends Reference {
  content: { [key: string]: MediaType }
  description: string
  headers: { [key: string]: Parameter }
  links: { [key: string]: Link }
}

// Link struct link field
export interface Link {
  description: string
  operationId: string
  operationRef: string
  parameters: { [key: string]: Parameter }
  requestBody: any
  server: Server
}

export interface Encoding {
  allowReserved: boolean
  contentinterface: string
  explode: boolean
  headers: { [key: string]: Parameter }
  style: string
}

export interface Discriminator {
  propertyName: string
  mapping: { [key: string]: string }
}

export interface XML {
  name: string
  namespace: string
  prefix: string
  attribute: boolean
  wrapped: boolean
}

export interface RequestBody {
  description: string
  content: { [key: string]: MediaType }
  required: boolean
}
