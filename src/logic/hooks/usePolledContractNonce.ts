import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { backOff } from 'exponential-backoff'
import { currentSafe } from 'src/logic/safe/store/selectors'
import useCoreSdk from 'src/logic/hooks/useCoreSdk'
import { logError, Errors } from 'src/logic/exceptions/CodedException'

const usePolledContractNonce = (txNonce?: string): number => {
  const sdk = useCoreSdk()
  const { nonce } = useSelector(currentSafe) ?? {}
  const [contractNonce, setContractNonce] = useState<number>(nonce)

  useEffect(() => {
    if (!sdk || txNonce == null) return

    const checkNonce = async (): Promise<number> => {
      const newNonce = await sdk.getNonce()
      if (newNonce < parseInt(txNonce)) {
        throw Error(`Safe nonce still hasn't reached the tx nonce`)
      }
      console.log('New nonce', newNonce)
      return newNonce
    }

    // A flag to stop the backoff loop on unmount
    let isPolling = true

    const launchPolling = async (): Promise<void> => {
      try {
        const resultNonce = await backOff(checkNonce, {
          numOfAttempts: 300,
          startingDelay: 1000, // 1s delay between attempts
          timeMultiple: 1.01, // a small exponent for the delay
          retry: () => isPolling,
        })

        if (isPolling) {
          setContractNonce(resultNonce)
        }
      } catch (err) {
        logError(Errors._819, err.message)
      }
    }

    launchPolling()

    return () => {
      isPolling = false
    }
  }, [sdk, txNonce])

  return contractNonce
}

export default usePolledContractNonce
