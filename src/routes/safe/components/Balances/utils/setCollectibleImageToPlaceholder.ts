import { SyntheticEvent } from 'react'

import NFTIcon from 'src/routes/safe/components/Balances/assets/nft_icon.png'

export const setCollectibleImageToPlaceholder = (error: SyntheticEvent<HTMLImageElement, Event>): void => {
  error.currentTarget.onerror = null
  error.currentTarget.src = NFTIcon
}
