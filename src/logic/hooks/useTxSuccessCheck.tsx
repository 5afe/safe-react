import { useEffect, useState } from 'react'
import { getGasEstimationTxResponse } from 'src/logic/safe/transactions/gas'
import { getAccountFrom, getWeb3 } from '../wallets/getWeb3'

export const useTxSuccessCheck = ({ txTo, data }: { txTo?: string; data: string }): boolean => {
  const web3 = getWeb3()
  const [txWillFail, setTxWillFail] = useState(false)

  useEffect(() => {
    const checkIfTxWillFail = async () => {
      try {
        if (!txTo) {
          setTxWillFail(true)
          return
        }
        const from = await getAccountFrom(web3)
        if (!from) {
          setTxWillFail(true)
          return
        }
        await getGasEstimationTxResponse({
          to: txTo,
          from,
          data,
        })
        setTxWillFail(false)
        return
      } catch (error) {
        setTxWillFail(true)
      }
    }

    checkIfTxWillFail()
  }, [txTo, data, web3])

  return txWillFail
}
