import { SyntheticEvent } from 'react'

import TokenPlaceholder from 'src/routes/safe/components/Balances/assets/token_placeholder.svg'

export const setImageToPlaceholder = (error: SyntheticEvent<HTMLImageElement, Event>): void => {
  error.currentTarget.onerror = null
  error.currentTarget.src = TokenPlaceholder
}
