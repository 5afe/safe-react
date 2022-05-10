export const camelCaseToSpaces = (str: string): string => {
  return str
    .replace(/([A-Z][a-z0-9]+)/g, ' $1 ')
    .replace(/\s{2}/g, ' ')
    .trim()
}
