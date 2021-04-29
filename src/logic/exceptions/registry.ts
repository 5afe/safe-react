export interface ExceptionContent {
  code: number
  description: string
  uiMessage?: string
  isTracked: boolean
  isLogged: boolean
}

const registry: Record<number, ExceptionContent> = {
  100: {
    code: 100,
    description: 'Invalid input in the address field',
    uiMessage: 'Please enter a valid address',
    isTracked: false,
    isLogged: false,
  },
}

export default registry
