// @flow
import { List, Map } from 'immutable'
import {
  createSelector,
  createStructuredSelector,
  type Selector,
} from 'reselect'
import {
  safeSelector,
  safeActiveTokensSelector,
  safeBalancesSelector,
  safeBlacklistedTokensSelector,
  safeTransactionsSelector,
  safeIncomingTransactionsSelector,
  type RouterProps,
  type SafeSelectorProps,
} from '~/routes/safe/store/selectors'
import {
  providerNameSelector,
  userAccountSelector,
  networkSelector,
} from '~/logic/wallets/store/selectors'
import { type Safe } from '~/routes/safe/store/models/safe'
import { type GlobalState } from '~/store'
import { isUserOwner } from '~/logic/wallets/ethAddresses'
import {
  orderedTokenListSelector,
  tokensSelector,
} from '~/logic/tokens/store/selectors'
import { type Token } from '~/logic/tokens/store/model/token'
import {
  type Transaction,
  type TransactionStatus,
} from '~/routes/safe/store/models/transaction'
import { safeParamAddressSelector } from '../store/selectors'
import { getEthAsToken } from '~/logic/tokens/utils/tokenHelpers'
import {
  currencyValuesListSelector,
  currentCurrencySelector,
} from '~/logic/currencyValues/store/selectors'
import type { BalanceCurrencyType } from '~/logic/currencyValues/store/model/currencyValues'
import type { IncomingTransaction } from '~/routes/safe/store/models/incomingTransaction'

export type SelectorProps = {
  safe: SafeSelectorProps,
  provider: string,
  tokens: List<Token>,
  activeTokens: List<Token>,
  blacklistedTokens: List<Token>,
  userAddress: string,
  network: string,
  safeUrl: string,
  currencySelected: string,
  currencyValues: BalanceCurrencyType[],
  transactions: List<Transaction | IncomingTransaction>
}

const getTxStatus = (
  tx: Transaction,
  userAddress: string,
  safe: Safe,
): TransactionStatus => {
  let txStatus
  if (tx.executionTxHash) {
    txStatus = 'success'
  } else if (tx.cancelled) {
    txStatus = 'cancelled'
  } else if (tx.confirmations.size === safe.threshold) {
    txStatus = 'awaiting_execution'
  } else if (tx.creationTx) {
    txStatus = 'success'
  } else if (!tx.confirmations.size) {
    txStatus = 'pending'
  } else {
    const userConfirmed = tx.confirmations.filter((conf) => conf.owner.address === userAddress)
      .size === 1
    const userIsSafeOwner = safe.owners.filter((owner) => owner.address === userAddress).size === 1
    txStatus = !userConfirmed && userIsSafeOwner
      ? 'awaiting_your_confirmation'
      : 'awaiting_confirmations'
  }

  return txStatus
}

export const grantedSelector: Selector<
  GlobalState,
  RouterProps,
  boolean
> = createSelector(
  userAccountSelector,
  safeSelector,
  (userAccount: string, safe: Safe | typeof undefined): boolean => isUserOwner(safe, userAccount),
)

const safeEthAsTokenSelector: Selector<
  GlobalState,
  RouterProps,
  ?Token
> = createSelector(safeSelector, (safe: Safe) => {
  if (!safe) {
    return undefined
  }

  return getEthAsToken(safe.ethBalance)
})

const extendedSafeTokensSelector: Selector<
  GlobalState,
  RouterProps,
  List<Token>
> = createSelector(
  safeActiveTokensSelector,
  safeBalancesSelector,
  tokensSelector,
  safeEthAsTokenSelector,
  (
    safeTokens: List<string>,
    balances: Map<string, string>,
    tokensList: Map<string, Token>,
    ethAsToken: Token,
  ) => {
    const extendedTokens = Map().withMutations((map) => {
      safeTokens.forEach((tokenAddress: string) => {
        const baseToken = tokensList.get(tokenAddress)
        const tokenBalance = balances.get(tokenAddress)

        if (baseToken) {
          map.set(tokenAddress, baseToken.set('balance', tokenBalance || '0'))
        }
      })

      if (ethAsToken) {
        map.set(ethAsToken.address, ethAsToken)
      }
    })

    return extendedTokens.toList()
  },
)

const extendedTransactionsSelector: Selector<
  GlobalState,
  RouterProps,
  List<Transaction | IncomingTransaction>
> = createSelector(
  safeSelector,
  userAccountSelector,
  safeTransactionsSelector,
  safeIncomingTransactionsSelector,
  (safe, userAddress, transactions, incomingTransactions) => {
    const extendedTransactions = transactions.map((tx: Transaction) => {
      let extendedTx = tx

      // If transactions are not executed, but there's a transaction with the same nonce submitted later
      // it means that the transaction was cancelled (Replaced) and shouldn't get executed
      let replacementTransaction
      if (!tx.isExecuted) {
        replacementTransaction = transactions.size > 1
          && transactions.findLast(
            (transaction) => transaction.isExecuted
              && typeof transaction.nonce !== 'undefined'
              && transaction.nonce >= tx.nonce,
          )
        if (replacementTransaction) {
          extendedTx = tx.set('cancelled', true)
        }
      }

      return extendedTx.set(
        'status',
        getTxStatus(extendedTx, userAddress, safe),
      )
    })

    return List([...extendedTransactions, ...incomingTransactions])
  },
)

export default createStructuredSelector<Object, *>({
  safe: safeSelector,
  provider: providerNameSelector,
  tokens: orderedTokenListSelector,
  activeTokens: extendedSafeTokensSelector,
  blacklistedTokens: safeBlacklistedTokensSelector,
  granted: grantedSelector,
  userAddress: userAccountSelector,
  network: networkSelector,
  safeUrl: safeParamAddressSelector,
  transactions: extendedTransactionsSelector,
  currencySelected: currentCurrencySelector,
  currencyValues: currencyValuesListSelector,
})
