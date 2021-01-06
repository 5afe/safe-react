import { ThemeColors } from '@gnosis.pm/safe-react-components/dist/theme'
import { useEffect, useState } from 'react'

import { isStatusSuccess, TransactionStatus } from 'src/logic/safe/store/models/types/gateway.d'

export type TransactionStatusProps = {
  color: ThemeColors
  text: string
}

export const useTransactionStatus = (txStatus: TransactionStatus): TransactionStatusProps => {
  const [status, setStatus] = useState<TransactionStatusProps>({ color: 'primary', text: '' })

  useEffect(() => {
    if (isStatusSuccess(txStatus)) {
      setStatus({ color: 'primary', text: 'Success' })
    } else {
      setStatus({ color: 'error', text: 'Fail' })
    }
  }, [txStatus])

  return status
}
