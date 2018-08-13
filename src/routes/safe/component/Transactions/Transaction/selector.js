// @flow
import { createStructuredSelector } from 'reselect'
import { confirmationsTransactionSelector } from '~/routes/safe/store/selectors/index'
import { userAccountSelector } from '~/logic/wallets/store/selectors'
import { type Transaction } from '~/routes/safe/store/model/transaction'
import { type GlobalState } from '~/store'
import { type Confirmation } from '~/routes/safe/store/model/confirmation'

export type SelectorProps = {
  confirmed: confirmationsTransactionSelector,
  userAddress: userAccountSelector,
  executionHash: string,
}

type TxProps = {
  transaction: Transaction,
}

const transactionHashSector = (state: GlobalState, props: TxProps) => {
  if (!props.transaction) {
    return undefined
  }

  const confirmations = props.transaction.get('confirmations')
  const executedConf = confirmations.find((conf: Confirmation) => conf.get('type') === 'executed')

  return executedConf.get('hash')
}

export default createStructuredSelector({
  executionHash: transactionHashSector,
  confirmed: confirmationsTransactionSelector,
  userAddress: userAccountSelector,
})
