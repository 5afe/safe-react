import { useEffect, useState } from 'react'
import { calculateGasPrice } from 'src/logic/wallets/ethTransactions'

export const useGasPrice = (): [string, boolean] => {
  const [gasPrice, setGasPrice] = useState<string>('0')
  const [loaded, setLoaded] = useState<boolean>(false)

  useEffect(() => {
    const fetchGasPrice = async () => {
      const gasPrice = await calculateGasPrice()
      setGasPrice(gasPrice)
      setLoaded(true)
    }

    fetchGasPrice()
  }, [])

  return [gasPrice, loaded]
}
