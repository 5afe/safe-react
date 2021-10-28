import { CONTRACT_ERROR_CODES } from 'src/logic/contracts/contracts.d'

export const isSafeError = (error: Error): boolean => {
  return Object.entries(CONTRACT_ERROR_CODES)
    .flatMap((v) => v)
    .some((v) => Object.values(error).includes(v))
}

export const getSafeError = (error: Error): string =>
  isSafeError(error) ? CONTRACT_ERROR_CODES[error.name] : error.message
