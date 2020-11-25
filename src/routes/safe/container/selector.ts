import { List, Map } from 'immutable'
import { createSelector } from 'reselect'

import { Token } from 'src/logic/tokens/store/model/token'
import { tokenListSelector, tokensSelector } from 'src/logic/tokens/store/selectors'
import { getEthAsToken } from 'src/logic/tokens/utils/tokenHelpers'
import { isUserAnOwner, sameAddress } from 'src/logic/wallets/ethAddresses'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'

import {
  safeActiveTokensSelector,
  safeBalancesSelector,
  safeParamAddressFromStateSelector,
  safeSelector,
} from 'src/logic/safe/store/selectors'
import { SafeRecord } from 'src/logic/safe/store/models/safe'
import { AppReduxState } from 'src/store'
import { MODULE_TRANSACTIONS_REDUCER_ID } from 'src/logic/safe/store/reducer/moduleTransactions'
import { ModuleTxServiceModel } from 'src/logic/safe/store/actions/transactions/fetchTransactions/loadModuleTransactions'
import {
  SafeModuleTransaction,
  TransactionStatus,
  TransactionTypes,
} from 'src/logic/safe/store/models/types/transaction'
import { SPENDING_LIMIT_MODULE_ADDRESS } from 'src/utils/constants'

export const grantedSelector = createSelector(
  userAccountSelector,
  safeSelector,
  (userAccount: string, safe: SafeRecord): boolean => isUserAnOwner(safe, userAccount),
)

const safeEthAsTokenSelector = createSelector(safeSelector, (safe?: SafeRecord): Token | undefined => {
  if (!safe) {
    return undefined
  }

  return getEthAsToken(safe.ethBalance)
})

export const extendedSafeTokensSelector = createSelector(
  safeActiveTokensSelector,
  safeBalancesSelector,
  tokensSelector,
  safeEthAsTokenSelector,
  (safeTokens, balances, tokensList, ethAsToken): List<Token> => {
    const extendedTokens = Map<string, Token>().withMutations((map) => {
      safeTokens.forEach((tokenAddress) => {
        const baseToken = tokensList.get(tokenAddress)
        const tokenBalance = balances?.get(tokenAddress)

        if (baseToken) {
          map.set(tokenAddress, baseToken.set('balance', tokenBalance || '0'))
        }
      })
    })

    if (ethAsToken) {
      return extendedTokens.set(ethAsToken.address, ethAsToken).toList()
    }

    return extendedTokens.toList()
  },
)

export const safeKnownCoins = createSelector(
  tokensSelector,
  safeEthAsTokenSelector,
  (safeTokens, nativeCoinAsToken): List<Token> => {
    if (nativeCoinAsToken) {
      return safeTokens.set(nativeCoinAsToken.address, nativeCoinAsToken).toList()
    }

    return safeTokens.toList()
  },
)

const moduleTransactionsSelector = (state: AppReduxState) => state[MODULE_TRANSACTIONS_REDUCER_ID]

export const modulesTransactionsBySafeSelector = createSelector(
  moduleTransactionsSelector,
  safeParamAddressFromStateSelector,
  (moduleTransactions, safeAddress): ModuleTxServiceModel[] => {
    // no module tx for the current safe so far
    if (!moduleTransactions || !safeAddress || !moduleTransactions[safeAddress]) {
      return []
    }

    return moduleTransactions[safeAddress]
  },
)

export const safeModuleTransactionsSelector = createSelector(
  tokenListSelector,
  modulesTransactionsBySafeSelector,
  (tokens, safeModuleTransactions): SafeModuleTransaction[] => {
    return safeModuleTransactions.map((moduleTx) => {
      // if not spendingLimit module tx, then it's an generic module tx
      const type = sameAddress(moduleTx.module, SPENDING_LIMIT_MODULE_ADDRESS)
        ? TransactionTypes.SPENDING_LIMIT
        : TransactionTypes.MODULE

      // TODO: this is strictly attached to Spending Limit Module.
      //  This has to be moved nearest the module info rendering.
      // add token info to the model, so data can be properly displayed in the UI
      let tokenInfo
      if (type === TransactionTypes.SPENDING_LIMIT) {
        if (moduleTx.data) {
          // if `data` is defined, then it's a token transfer
          tokenInfo = tokens.find(({ address }) => sameAddress(address, moduleTx.to))
        } else {
          // if `data` is not defined, then it's an ETH transfer
          // ETH does not exist in the list of tokens, so we recreate the record here
          tokenInfo = getEthAsToken(0)
        }
      }

      return {
        ...moduleTx,
        safeTxHash: moduleTx.transactionHash,
        executionTxHash: moduleTx.transactionHash,
        status: TransactionStatus.SUCCESS,
        tokenInfo,
        type,
      }
    })
  },
)
