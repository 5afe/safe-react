export interface ExceptionContent {
  description: string
  uiMessage?: string
}

const registry: Record<number, ExceptionContent> = {
  0: {
    description: 'No such error code',
  },
  100: {
    description: 'Invalid input in the address field',
    uiMessage: 'Please enter a valid address',
  },
}

export default registry
