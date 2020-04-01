// @flow
import { List, Map } from 'immutable'
import { type Selector, createSelector, createStructuredSelector } from 'reselect'

import { safeParamAddressSelector } from '../store/selectors'

import type { AddressBook } from '~/logic/addressBook/model/addressBook'
import { getAddressBook } from '~/logic/addressBook/store/selectors'
import type { BalanceCurrencyType } from '~/logic/currencyValues/store/model/currencyValues'
import { currencyValuesListSelector, currentCurrencySelector } from '~/logic/currencyValues/store/selectors'
import { type Token } from '~/logic/tokens/store/model/token'
import { orderedTokenListSelector, tokensSelector } from '~/logic/tokens/store/selectors'
import { getEthAsToken } from '~/logic/tokens/utils/tokenHelpers'
import { isUserOwner } from '~/logic/wallets/ethAddresses'
import { networkSelector, providerNameSelector, userAccountSelector } from '~/logic/wallets/store/selectors'
import type { IncomingTransaction } from '~/routes/safe/store/models/incomingTransaction'
import { type Safe } from '~/routes/safe/store/models/safe'
import { type Transaction, type TransactionStatus } from '~/routes/safe/store/models/transaction'
import {
  type RouterProps,
  type SafeSelectorProps,
  safeActiveTokensSelector,
  safeBalancesSelector,
  safeBlacklistedTokensSelector,
  safeCancellationTransactionsSelector,
  safeIncomingTransactionsSelector,
  safeSelector,
  safeTransactionsSelector,
} from '~/routes/safe/store/selectors'
import { type GlobalState } from '~/store'

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
  transactions: List<Transaction | IncomingTransaction>,
  cancellationTransactions: List<Transaction>,
  addressBook: AddressBook,
}

const getTxStatus = (tx: Transaction, userAddress: string, safe: Safe): TransactionStatus => {
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
    const userConfirmed = tx.confirmations.filter(conf => conf.owner.address === userAddress).size === 1
    const userIsSafeOwner = safe.owners.filter(owner => owner.address === userAddress).size === 1
    txStatus = !userConfirmed && userIsSafeOwner ? 'awaiting_your_confirmation' : 'awaiting_confirmations'
  }

  if (tx.isSuccessful === false) {
    txStatus = 'failed'
  }

  return txStatus
}

export const grantedSelector: Selector<GlobalState, RouterProps, boolean> = createSelector(
  userAccountSelector,
  safeSelector,
  (userAccount: string, safe: Safe | typeof undefined): boolean => isUserOwner(safe, userAccount),
)

const safeEthAsTokenSelector: Selector<GlobalState, RouterProps, ?Token> = createSelector(
  safeSelector,
  (safe: Safe) => {
    if (!safe) {
      return undefined
    }

    return getEthAsToken(safe.ethBalance)
  },
)

export const extendedSafeTokensSelector: Selector<GlobalState, RouterProps, List<Token>> = createSelector(
  safeActiveTokensSelector,
  safeBalancesSelector,
  tokensSelector,
  safeEthAsTokenSelector,
  (safeTokens: List<string>, balances: Map<string, string>, tokensList: Map<string, Token>, ethAsToken: Token) => {
    const extendedTokens = Map().withMutations(map => {
      safeTokens.forEach((tokenAddress: string) => {
        const baseToken = tokensList.get(tokenAddress)
        const tokenBalance = balances.get(tokenAddress)

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

export const extendedTransactionsSelector: Selector<
  GlobalState,
  RouterProps,
  List<Transaction | IncomingTransaction>,
> = createSelector(
  safeSelector,
  userAccountSelector,
  safeTransactionsSelector,
  safeCancellationTransactionsSelector,
  safeIncomingTransactionsSelector,
  (safe, userAddress, transactions, cancellationTransactions, incomingTransactions) => {
    const cancellationTransactionsByNonce = cancellationTransactions.reduce((acc, tx) => acc.set(tx.nonce, tx), Map())
    const extendedTransactions = transactions.map((tx: Transaction) => {
      let extendedTx = tx

      if (!tx.isExecuted) {
        if (
          cancellationTransactionsByNonce.get(tx.nonce) &&
          cancellationTransactionsByNonce.get(tx.nonce).get('isExecuted')
        ) {
          extendedTx = tx.set('cancelled', true)
        }
      }

      return extendedTx.set('status', getTxStatus(extendedTx, userAddress, safe))
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
  cancellationTransactions: safeCancellationTransactionsSelector,
  currencySelected: currentCurrencySelector,
  currencyValues: currencyValuesListSelector,
  addressBook: getAddressBook,
})
