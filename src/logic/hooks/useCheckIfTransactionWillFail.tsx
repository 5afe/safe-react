import { useEffect, useState } from 'react'
import { checkIfExecTxWillFail } from 'src/logic/safe/transactions/gas'

type TransactionWillFailProps = {
  data: string
  safeAddress: string
  txAmount?: string
  txRecipient: string
}

export const useCheckIfTransactionWillFail = ({
  data,
  safeAddress,
  txAmount,
  txRecipient,
}: TransactionWillFailProps): boolean => {
  const [txWillFail, setTxWillFail] = useState(false)

  useEffect(() => {
    // The data is loading
    if (!data.length) {
      return
    }
    const checkIfTxWillFailAsync = async () => {
      const txWillFailResult = await checkIfExecTxWillFail({
        safeAddress: safeAddress as string,
        txTo: txRecipient,
        data,
        txAmount,
      })
      setTxWillFail(txWillFailResult)
    }

    checkIfTxWillFailAsync()
  }, [data, safeAddress, txAmount, txRecipient])

  return txWillFail
}
