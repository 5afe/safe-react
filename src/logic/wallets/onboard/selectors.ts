import { createSelector } from 'reselect'

import { currentChainId } from 'src/logic/config/store/selectors'
import { getOnboardState } from 'src/logic/wallets/onboard/index'
import type { ChainId } from 'src/config/chain'

export const shouldSwitchWalletChain = createSelector(
  [currentChainId, () => getOnboardState()],
  (currentChainId: ChainId, { chain, account }: ReturnType<typeof getOnboardState>): boolean => {
    return !!account.address && chain.id !== currentChainId
  },
)
