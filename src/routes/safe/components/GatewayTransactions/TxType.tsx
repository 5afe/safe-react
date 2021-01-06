import React, { FC, HTMLAttributes } from 'react'

import CustomIconText from 'src/components/CustomIconText'
import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { useTransactionType } from './hooks/useTransactionType'

interface TxTypeProps {
  tx: Transaction
}
export const TxType: FC<TxTypeProps & HTMLAttributes<unknown>> = ({ tx }) => {
  const { icon, text } = useTransactionType(tx)

  return <CustomIconText iconUrl={icon} text={text} />
}
