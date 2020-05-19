import { List, Map } from 'immutable'
import { createSelector } from 'reselect'

import {} from 'src/logic/tokens/store/model/token'
import { tokensSelector } from 'src/logic/tokens/store/selectors'
import { getEthAsToken } from 'src/logic/tokens/utils/tokenHelpers'
import { isUserOwner } from 'src/logic/wallets/ethAddresses'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import {} from 'src/routes/safe/store/models/safe'
import {} from 'src/routes/safe/store/models/transaction'
import {
  safeActiveTokensSelector,
  safeBalancesSelector,
  safeCancellationTransactionsSelector,
  safeIncomingTransactionsSelector,
  safeSelector,
  safeTransactionsSelector,
} from 'src/routes/safe/store/selectors'
import {} from 'src/store'

const getTxStatus = (tx, userAddress, safe) => {
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
    const userConfirmed = tx.confirmations.filter((conf) => conf.owner === userAddress).size === 1
    const userIsSafeOwner = safe.owners.filter((owner) => owner.address === userAddress).size === 1
    txStatus = !userConfirmed && userIsSafeOwner ? 'awaiting_your_confirmation' : 'awaiting_confirmations'
  }

  if (tx.isSuccessful === false) {
    txStatus = 'failed'
  }

  return txStatus
}

export const grantedSelector = createSelector(userAccountSelector, safeSelector, (userAccount, safe) =>
  isUserOwner(safe, userAccount),
)

const safeEthAsTokenSelector = createSelector(safeSelector, (safe) => {
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
  (safeTokens, balances, tokensList, ethAsToken) => {
    const extendedTokens = Map().withMutations((map) => {
      safeTokens.forEach((tokenAddress) => {
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

export const extendedTransactionsSelector = createSelector(
  safeSelector,
  userAccountSelector,
  safeTransactionsSelector,
  safeCancellationTransactionsSelector,
  safeIncomingTransactionsSelector,
  (safe, userAddress, transactions, cancellationTransactions, incomingTransactions) => {
    const cancellationTransactionsByNonce = cancellationTransactions.reduce((acc, tx) => acc.set(tx.nonce, tx), Map())
    const extendedTransactions = transactions.map((tx) => {
      let extendedTx = tx

      if (!tx.isExecuted) {
        if (
          (cancellationTransactionsByNonce.get(tx.nonce) &&
            cancellationTransactionsByNonce.get(tx.nonce).get('isExecuted')) ||
          transactions.find((safeTx) => tx.nonce === safeTx.nonce && safeTx.isExecuted)
        ) {
          extendedTx = tx.set('cancelled', true)
        }
      }

      return extendedTx.set('status', getTxStatus(extendedTx, userAddress, safe))
    })

    return List([...extendedTransactions, ...incomingTransactions])
  },
)
