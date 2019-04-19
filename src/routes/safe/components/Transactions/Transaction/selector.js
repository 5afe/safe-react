// @flow
import { createStructuredSelector } from 'reselect'
import { confirmationsTransactionSelector } from '~/routes/safe/store/selectors/index'
import { userAccountSelector } from '~/logic/wallets/store/selectors'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { type GlobalState } from '~/store'
import { type Confirmation } from '~/routes/safe/store/models/confirmation'

export type SelectorProps = {
  confirmed: typeof confirmationsTransactionSelector,
  userAddress: typeof userAccountSelector,
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
  const executedConf = confirmations.find((conf: Confirmation) => conf.get('type') === 'execution')

  return executedConf ? executedConf.get('hash') : undefined
}

export default createStructuredSelector<Object, *>({
  executionHash: transactionHashSector,
  confirmed: confirmationsTransactionSelector,
  userAddress: userAccountSelector,
})
