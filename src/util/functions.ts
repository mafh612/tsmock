export const sanitizeUrl: (url: string) => string = (url: string): string => {
  return url
    .replace(/}/g, '')
    .split('{')
    .join(':')
}

export interface KeyValue<T> {
  key: string
  value: T
}

export const objectToArray: <T>(obj: { [key: string]: T }) => Array<KeyValue<T>> = <T>(obj: {
  [key: string]: T
}): Array<KeyValue<T>> => {
  if (!obj) { return [] }

  return Object.keys(obj).map((key: string): { key: string; value: T } => {
    return { key, value: obj[key] }
  })
}
