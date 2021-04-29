import registry, { ExceptionContent } from './registry'

class CodedException extends Error {
  public code: number
  public content: ExceptionContent

  constructor(code: number, isTracked?: boolean, isLogged?: boolean) {
    super()
    const content = registry[code]
    this.code = code
    this.content = content
    this.message = content.description
    console.log(isTracked, isLogged)
  }

  log(): void {}
}

export default CodedException

/*
try {
  await fetchStuff()
} catch (e) {
  if (e instanceof CodedException) {
    e.handle()
  }
}
*/
