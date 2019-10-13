import { readFileSync } from 'fs'
import * as YAML from 'yaml'
import { Openapi } from '../util'

export const loadSpecification: (filename: string) => Openapi = (filename: string): Openapi => {
  let filecontent: string
  let yaml: Openapi

  try {
    filecontent = readFileSync(filename, { encoding: 'utf8' })
  } catch (e) {
    process.stderr.write(`unable to load ${filename}`)
  }

  try {
    yaml = YAML.parse(filecontent)

    if (!yaml.servers) {
      yaml.servers = []
    }

    yaml.servers.unshift({ url: 'http://localhost:5000', description: 'Mock Server' })
  } catch (e) {
    process.stderr.write(`unable to parse contents of ${filename} - ${e}`)
  }

  return yaml
}
