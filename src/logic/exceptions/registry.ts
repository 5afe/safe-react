export interface ExceptionContent {
  description: string
  uiMessage?: string
}

/**
 * When creating a new error type, please try to group them semantically
 * with the existing errors in the same hundred. For example, if it's
 * related to fetching data from the backend, add it to the 6xx errors.
 * This is not a hard requirement, just a useful convention.
 */
const registry: Record<number, ExceptionContent> = {
  0: {
    description: 'No such error code',
  },
  100: {
    description: 'Invalid input in the address field',
    uiMessage: 'Please enter a valid address',
  },
  600: {
    description: 'Error fetching token list',
  },
  601: {
    description: 'Error fetching balances',
  },
}

export default registry
