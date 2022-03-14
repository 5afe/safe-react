import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { currentSafe } from 'src/logic/safe/store/selectors'
import useCoreSdk from 'src/logic/hooks/useCoreSdk'

const usePolledContractNonce = (): number => {
  const sdk = useCoreSdk()
  const { nonce } = useSelector(currentSafe) ?? {}
  const [contractNonce, setContractNonce] = useState<number>(nonce)

  useEffect(() => {
    if (!sdk) return

    // @TODO use backoff
    sdk.getNonce().then(setContractNonce)
  }, [sdk])

  return contractNonce
}

export default usePolledContractNonce
