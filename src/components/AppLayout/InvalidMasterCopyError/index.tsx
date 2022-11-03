import { Link } from '@gnosis.pm/safe-react-components'
import { useSelector } from 'react-redux'
import { getChainInfo } from 'src/config'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import useAsync from 'src/logic/hooks/useAsync'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { isValidMasterCopy } from 'src/logic/safe/utils/safeVersion'
import MuiAlert from '@material-ui/lab/Alert'
import { useState } from 'react'

const CLI_LINK = 'https://github.com/5afe/safe-cli'

export const InvalidMasterCopyError = (): React.ReactElement | null => {
  const chainInfo = getChainInfo()
  const { implementation } = useSelector(currentSafe)
  const [showMasterCopyError, setShowMasterCopyError] = useState(true)

  const [validMasterCopy, error] = useAsync(async () => {
    if (implementation.value) {
      return await isValidMasterCopy(chainInfo.chainId, implementation.value)
    }
  }, [chainInfo.chainId, implementation.value])

  if (!showMasterCopyError) {
    return null
  }

  if (error) {
    logError(Errors._620, error.message)
    return null
  }

  if (typeof validMasterCopy === 'undefined' || validMasterCopy) {
    return null
  }

  return (
    <MuiAlert severity="error" onClose={() => setShowMasterCopyError(false)}>
      This Safe was created with an unsupported base contract. The web interface might not work correctly. We recommend
      using the{' '}
      <Link href={CLI_LINK} size="lg" target="_blank" rel="noopener noreferrer">
        command line interface
      </Link>{' '}
      instead.
    </MuiAlert>
  )
}
