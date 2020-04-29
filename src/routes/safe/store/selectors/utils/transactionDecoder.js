// @flow
import { sameAddress } from '~/logic/wallets/ethAddresses'
import { type Transaction } from '~/routes/safe/store/models/transaction'

const isModifySettingsTx = (tx: Transaction) => sameAddress(transaction.to, safe) && Number(tx.value) === 0 && !!tx.data
