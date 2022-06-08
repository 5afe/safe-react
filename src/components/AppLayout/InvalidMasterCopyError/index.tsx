import { Link } from '@gnosis.pm/safe-react-components'
import { useSelector } from 'react-redux'
import { getChainInfo } from 'src/config'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import useAsync from 'src/logic/hooks/useAsync'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { isValidMasterCopy } from 'src/logic/safe/utils/safeVersion'
import MuiAlert from '@material-ui/lab/Alert'

const CLI_LINK = 'https://github.com/5afe/safe-cli'

export const InvalidMasterCopyError = ({ onClose }: { onClose: () => void }): React.ReactElement | null => {
  const chainInfo = getChainInfo()
  const { currentVersion, address } = useSelector(currentSafe)

  const [validMasterCopy, error] = useAsync(async () => {
    if (address && currentVersion) {
      return await isValidMasterCopy(chainInfo.chainId, address, currentVersion)
    }
  }, [address, chainInfo, currentVersion])

  if (error) {
    logError(Errors._620, error.message)
    return null
  }

  if (typeof validMasterCopy === 'undefined' || validMasterCopy) {
    return null
  }

  return (
    <MuiAlert severity="error" onClose={onClose}>
      This Safe was created with an unsupported base contract. The web interface might not work correctly. We recommend
      using the{' '}
      <Link href={CLI_LINK} size="xl" target="_blank">
        command line interface
      </Link>{' '}
      instead.
    </MuiAlert>
  )
}
