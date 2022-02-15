import { createStyles, makeStyles } from '@material-ui/core'
import { sm } from 'src/theme/variables'
import Row from 'src/components/layout/Row'
import Paragraph from 'src/components/layout/Paragraph'
import Img from 'src/components/layout/Img'
import InfoIcon from 'src/assets/icons/info_red.svg'

import { useSelector } from 'react-redux'
import { currentSafeCurrentVersion, currentSafeThreshold } from 'src/logic/safe/store/selectors'
import { shouldSwitchWalletChain } from 'src/logic/wallets/store/selectors'
import { grantedSelector } from 'src/routes/safe/container/selector'
import { EstimationStatus } from 'src/logic/hooks/useEstimateTransactionGas'
import { hasFeature } from 'src/logic/safe/utils/safeVersion'
import { FEATURES } from '@gnosis.pm/safe-react-gateway-sdk'

const styles = createStyles({
  executionWarningRow: {
    display: 'flex',
    alignItems: 'center',
  },
  warningIcon: {
    marginRight: sm,
  },
})

const useStyles = makeStyles(styles)

type TransactionFailTextProps = {
  isExecution: boolean
  isCreation: boolean
  estimationStatus: EstimationStatus
}

export const TransactionFailText = ({
  isExecution,
  isCreation,
  estimationStatus,
}: TransactionFailTextProps): React.ReactElement | null => {
  const classes = useStyles()
  const threshold = useSelector(currentSafeThreshold)
  const isWrongChain = useSelector(shouldSwitchWalletChain)
  const isGranted = useSelector(grantedSelector)
  const safeVersion = useSelector(currentSafeCurrentVersion)

  if (estimationStatus !== EstimationStatus.FAILURE && !(isCreation && !isGranted)) {
    return null
  }

  let errorDesc = 'To save gas costs, avoid creating the transaction.'
  if (isExecution) {
    errorDesc =
      threshold && threshold > 1
        ? `To save gas costs, reject this transaction`
        : `To save gas costs, avoid executing the transaction.`
  }

  const defaultMsg = `This transaction will most likely fail. ${errorDesc}`
  const notOwnerMsg = `You are currently not an owner of this Safe and won't be able to submit this transaction.`
  const wrongChainMsg = 'Your wallet is connected to the wrong chain.'
  const updateSafeMessage = `This transaction will most likely fail. Please consider updating your Safe version (Settings → Safe Details → Update Safe).`

  let error = isGranted ? defaultMsg : isWrongChain ? wrongChainMsg : isCreation ? notOwnerMsg : defaultMsg

  // For legacy Safes, esp. on Gnosis Chain
  if (estimationStatus === EstimationStatus.FAILURE && !hasFeature(FEATURES.SAFE_TX_GAS_OPTIONAL, safeVersion)) {
    error = updateSafeMessage
  }

  return (
    <Row align="center">
      <Paragraph color="error" className={classes.executionWarningRow}>
        <Img alt="Info Tooltip" height={16} src={InfoIcon} className={classes.warningIcon} />
        {error}
      </Paragraph>
    </Row>
  )
}
