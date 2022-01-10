import { createStyles, makeStyles } from '@material-ui/core'
import { sm } from 'src/theme/variables'
import { EstimationStatus } from 'src/logic/hooks/useEstimateTransactionGas'
import Row from 'src/components/layout/Row'
import Paragraph from 'src/components/layout/Paragraph'
import Img from 'src/components/layout/Img'
import InfoIcon from 'src/assets/icons/info_red.svg'

import { useSelector } from 'react-redux'
import { currentSafeThreshold } from 'src/logic/safe/store/selectors'
import { shouldSwitchWalletChain } from 'src/logic/wallets/store/selectors'
import { grantedSelector } from 'src/routes/safe/container/selector'

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
  txEstimationExecutionStatus: EstimationStatus
  isExecution: boolean
}

export const TransactionFailText = ({
  txEstimationExecutionStatus,
  isExecution,
}: TransactionFailTextProps): React.ReactElement | null => {
  const classes = useStyles()
  const threshold = useSelector(currentSafeThreshold)
  const isWrongChain = useSelector(shouldSwitchWalletChain)
  const isGranted = useSelector(grantedSelector)

  if (txEstimationExecutionStatus !== EstimationStatus.FAILURE) {
    return null
  }

  let errorDesc = 'To save gas costs, avoid creating the transaction.'
  if (isExecution) {
    errorDesc =
      threshold && threshold > 1
        ? `To save gas costs, reject this transaction`
        : `To save gas costs, avoid executing the transaction.`
  }

  const error = isGranted
    ? `This transaction will most likely fail. ${errorDesc}`
    : isWrongChain
    ? 'Your wallet is connected to the wrong chain.'
    : "You are currently not an owner of this Safe and won't be able to submit this transaction."

  return (
    <Row align="center">
      <Paragraph color="error" className={classes.executionWarningRow}>
        <Img alt="Info Tooltip" height={16} src={InfoIcon} className={classes.warningIcon} />
        {error}
      </Paragraph>
    </Row>
  )
}
