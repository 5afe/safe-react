import { SyntheticEvent } from 'react'

import TokenPlaceholder from 'src/routes/safe/components/Balances/assets/token_placeholder.svg'

export const setImageToPlaceholder = (event: SyntheticEvent<HTMLImageElement, Event>): void => {
  const img = event.currentTarget
  if (!img.src.endsWith(TokenPlaceholder)) {
    img.src = TokenPlaceholder
  }
}
