import { createStyles, makeStyles } from '@material-ui/core'
import { sm } from 'src/theme/variables'
import Row from 'src/components/layout/Row'
import Paragraph from 'src/components/layout/Paragraph'
import Img from 'src/components/layout/Img'
import InfoIcon from 'src/assets/icons/info_red.svg'

import { useSelector } from 'react-redux'
import { shouldSwitchWalletChain } from 'src/logic/wallets/store/selectors'
import { grantedSelector } from 'src/routes/safe/container/selector'
import { EstimationStatus } from 'src/logic/hooks/useEstimateTransactionGas'

enum ErrorMessage {
  general = 'This transaction will most likely fail.',
  creation = 'To save gas costs, avoid creating the transaction.',
  execution = 'To save gas costs, reject this transaction.',
  notOwner = `You are currently not an owner of this Safe and won't be able to submit this transaction.`,
  wrongChain = 'Your wallet is connected to the wrong chain.',
}

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
  const isWrongChain = useSelector(shouldSwitchWalletChain)
  const isOwner = useSelector(grantedSelector)

  const showError =
    isWrongChain || (isExecution && estimationStatus === EstimationStatus.FAILURE) || (isCreation && !isOwner)
  if (!showError) return null

  const errorDesc = isCreation ? ErrorMessage.creation : ErrorMessage.execution
  const defaultMsg = `${ErrorMessage.general} ${errorDesc}`

  const error = isWrongChain ? ErrorMessage.wrongChain : isCreation && !isOwner ? ErrorMessage.notOwner : defaultMsg

  return (
    <Row align="center">
      <Paragraph color="error" className={classes.executionWarningRow}>
        <Img alt="Info Tooltip" height={16} src={InfoIcon} className={classes.warningIcon} />
        {error}
      </Paragraph>
    </Row>
  )
}

// For tests
export const _ErrorMessage = ErrorMessage
