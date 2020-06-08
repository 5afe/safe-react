import { withStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import React from 'react'
import { useSelector } from 'react-redux'

import CancelSmallFilledCircle from './assets/cancel-small-filled.svg'
import ConfirmSmallFilledCircle from './assets/confirm-small-filled.svg'
import ConfirmSmallGreenCircle from './assets/confirm-small-green.svg'
import ConfirmSmallGreyCircle from './assets/confirm-small-grey.svg'
import ConfirmSmallRedCircle from './assets/confirm-small-red.svg'
import PendingSmallYellowCircle from './assets/confirm-small-yellow.svg'
import { styles } from './style'

import EtherscanLink from 'src/components/EtherscanLink'
import Identicon from 'src/components/Identicon'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph'
import { getNameFromAddressBook } from 'src/logic/addressBook/store/selectors'

export const CONFIRM_TX_BTN_TEST_ID = 'confirm-btn'
export const EXECUTE_TX_BTN_TEST_ID = 'execute-btn'
export const REJECT_TX_BTN_TEST_ID = 'reject-btn'
export const EXECUTE_REJECT_TX_BTN_TEST_ID = 'execute-reject-btn'

const OwnerComponent = ({
  classes,
  confirmed,
  executor,
  isCancelTx,
  onTxConfirm,
  onTxExecute,
  onTxReject,
  owner,
  pendingAcceptAction,
  pendingRejectAction,
  showConfirmBtn,
  showExecuteBtn,
  showExecuteRejectBtn,
  showRejectBtn,
  thresholdReached,
  userAddress,
}: any) => {
  const nameInAdbk = useSelector((state) => getNameFromAddressBook(state, owner))
  const [imgCircle, setImgCircle] = React.useState(ConfirmSmallGreyCircle)

  React.useMemo(() => {
    if (pendingAcceptAction || pendingRejectAction) {
      setImgCircle(PendingSmallYellowCircle)
      return
    }
    if (confirmed) {
      setImgCircle(isCancelTx ? CancelSmallFilledCircle : ConfirmSmallFilledCircle)
      return
    }
    if (thresholdReached || executor) {
      setImgCircle(isCancelTx ? ConfirmSmallRedCircle : ConfirmSmallGreenCircle)
      return
    }
    setImgCircle(ConfirmSmallGreyCircle)
  }, [confirmed, thresholdReached, executor, isCancelTx, pendingAcceptAction, pendingRejectAction])

  const getTimelineLine = () => {
    if (pendingAcceptAction || pendingRejectAction) {
      return classes.verticalPendingAction
    }
    if (isCancelTx) {
      return classes.verticalLineCancel
    }
    return classes.verticalLineDone
  }

  const confirmButton = () => {
    if (pendingRejectAction) {
      return null
    }
    if (pendingAcceptAction) {
      return <Block className={classes.executor}>Pending</Block>
    }
    return (
      <>
        {showConfirmBtn && (
          <Button
            className={classes.button}
            color="primary"
            onClick={onTxConfirm}
            testId={CONFIRM_TX_BTN_TEST_ID}
            variant="contained"
          >
            Confirm
          </Button>
        )}
        {showExecuteBtn && (
          <Button
            className={classes.button}
            color="primary"
            onClick={onTxExecute}
            testId={EXECUTE_TX_BTN_TEST_ID}
            variant="contained"
          >
            Execute
          </Button>
        )}
      </>
    )
  }

  const rejectButton = () => {
    if (pendingRejectAction) {
      return <Block className={classes.executor}>Pending</Block>
    }
    if (pendingAcceptAction) {
      return null
    }
    return (
      <>
        {showRejectBtn && (
          <Button
            className={cn(classes.button, classes.lastButton)}
            color="secondary"
            onClick={onTxReject}
            testId={REJECT_TX_BTN_TEST_ID}
            variant="contained"
          >
            Reject
          </Button>
        )}
        {showExecuteRejectBtn && (
          <Button
            className={cn(classes.button, classes.lastButton)}
            color="secondary"
            onClick={onTxReject}
            testId={EXECUTE_REJECT_TX_BTN_TEST_ID}
            variant="contained"
          >
            Execute
          </Button>
        )}
      </>
    )
  }

  return (
    <Block className={classes.container}>
      <div
        className={cn(
          classes.verticalLine,
          (confirmed || thresholdReached || executor || pendingAcceptAction || pendingRejectAction) &&
            getTimelineLine(),
        )}
      />
      <div className={classes.circleState}>
        <Img alt="" src={imgCircle} />
      </div>
      <Identicon address={owner} className={classes.icon} diameter={32} />
      <Block>
        <Paragraph className={classes.name} noMargin>
          {nameInAdbk}
        </Paragraph>
        <EtherscanLink className={classes.address} cut={4} type="address" value={owner} />
      </Block>
      <Block className={classes.spacer} />
      {owner === userAddress && <Block>{isCancelTx ? rejectButton() : confirmButton()}</Block>}
      {owner === executor && <Block className={classes.executor}>Executor</Block>}
    </Block>
  )
}

export default withStyles(styles as any)(OwnerComponent)
