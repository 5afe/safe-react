import registry, { ExceptionContent } from './registry'

// import { IS_PRODUCTION } from 'src/utils/constants'
class CodedException extends Error {
  public code: number
  public content: ExceptionContent

  static throwError(code: number) {
    const error = new CodedException(code)
    error.log()
    throw error
  }

  constructor(code: number, isTracked?: boolean, isLogged?: boolean) {
    super()
    const content = registry[code]
    this.code = code
    this.content = {
      ...content,
      isTracked: isTracked == null ? content.isTracked : isTracked,
      isLogged: isLogged == null ? content.isLogged : isLogged,
    }
    this.message = content.description
  }

  log(): void {
    console.error(this.code, this)
  }
}

export default CodedException
