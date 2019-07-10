// @flow
import { List, Map } from 'immutable'
import { createSelector, createStructuredSelector, type Selector } from 'reselect'
import { isAfter } from 'date-fns'
import {
  safeSelector,
  safeActiveTokensSelector,
  safeBalancesSelector,
  type RouterProps,
  type SafeSelectorProps,
} from '~/routes/safe/store/selectors'
import { providerNameSelector, userAccountSelector, networkSelector } from '~/logic/wallets/store/selectors'
import { type Safe } from '~/routes/safe/store/models/safe'
import { type Owner } from '~/routes/safe/store/models/owner'
import { type GlobalState } from '~/store'
import { sameAddress } from '~/logic/wallets/ethAddresses'
import { safeTransactionsSelector } from '~/routes/safe/store/selectors/index'
import { orderedTokenListSelector, tokensSelector } from '~/logic/tokens/store/selectors'
import { type Token } from '~/logic/tokens/store/model/token'
import { type Transaction, type TransactionStatus } from '~/routes/safe/store/models/transaction'
import { type TokenBalance } from '~/routes/safe/store/models/tokenBalance'
import { safeParamAddressSelector } from '../store/selectors'
import { getEthAsToken } from '~/logic/tokens/utils/tokenHelpers'

export type SelectorProps = {
  safe: SafeSelectorProps,
  provider: string,
  tokens: List<Token>,
  activeTokens: List<Token>,
  userAddress: string,
  network: string,
  safeUrl: string,
  transactions: List<Transaction>,
}

const getTxStatus = (tx: Transaction, safe: Safe): TransactionStatus => {
  let txStatus = 'awaiting_confirmations'

  if (tx.executionTxHash) {
    txStatus = 'success'
  } else if (tx.cancelled) {
    txStatus = 'cancelled'
  } else if (tx.confirmations.size === safe.threshold) {
    txStatus = 'awaiting_execution'
  }

  return txStatus
}

export const grantedSelector: Selector<GlobalState, RouterProps, boolean> = createSelector(
  userAccountSelector,
  safeSelector,
  (userAccount: string, safe: Safe | typeof undefined): boolean => {
    if (!safe) {
      return false
    }

    if (!userAccount) {
      return false
    }

    const owners: List<Owner> = safe.get('owners')
    if (!owners) {
      return false
    }

    return owners.find((owner: Owner) => sameAddress(owner.address, userAccount)) !== undefined
  },
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

const extendedSafeTokensSelector: Selector<GlobalState, RouterProps, List<Token>> = createSelector(
  safeActiveTokensSelector,
  safeBalancesSelector,
  tokensSelector,
  safeEthAsTokenSelector,
  (safeTokens: List<string>, balances: List<TokenBalance>, tokensList: Map<string, Token>, ethAsToken: Token) => {
    const extendedTokens = Map().withMutations((map) => {
      safeTokens.forEach((tokenAddress: string) => {
        const baseToken = tokensList.get(tokenAddress)
        const tokenBalance = balances.find(tknBalance => tknBalance.address === tokenAddress)

        if (baseToken) {
          map.set(tokenAddress, baseToken.set('balance', tokenBalance ? tokenBalance.balance : '0'))
        }
      })

      if (ethAsToken) {
        map.set(ethAsToken.address, ethAsToken)
      }
    })

    return extendedTokens.toList()
  },
)

const extendedTransactionsSelector: Selector<GlobalState, RouterProps, List<Transaction>> = createSelector(
  safeSelector,
  safeTransactionsSelector,
  (safe, transactions) => {
    const extendedTransactions = transactions.map((tx: Transaction) => {
      let extendedTx = tx

      // If transactions is not executed, but there's a transaction with the same nonce submitted later
      // it means that the transaction was cancelled (Replaced) and shouldn't get executed
      let replacementTransaction
      if (!tx.isExecuted) {
        replacementTransaction = transactions.findLast(
          transaction => transaction.nonce === tx.nonce && isAfter(transaction.submissionDate, tx.submissionDate),
        )
        if (replacementTransaction) {
          extendedTx = tx.set('cancelled', true)
        }
      }

      return extendedTx.set('status', getTxStatus(extendedTx, safe))
    })

    return extendedTransactions
  },
)

export default createStructuredSelector<Object, *>({
  safe: safeSelector,
  provider: providerNameSelector,
  tokens: orderedTokenListSelector,
  activeTokens: extendedSafeTokensSelector,
  granted: grantedSelector,
  userAddress: userAccountSelector,
  network: networkSelector,
  safeUrl: safeParamAddressSelector,
  transactions: extendedTransactionsSelector,
})
