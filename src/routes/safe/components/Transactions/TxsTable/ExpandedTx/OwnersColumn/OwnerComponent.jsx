// @flow
import { withStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import React from 'react'
import { useSelector } from 'react-redux'

import CancelSmallFilledCircle from './assets/cancel-small-filled.svg'
import ConfirmSmallFilledCircle from './assets/confirm-small-filled.svg'
import ConfirmSmallGreenCircle from './assets/confirm-small-green.svg'
import ConfirmSmallGreyCircle from './assets/confirm-small-grey.svg'
import ConfirmSmallRedCircle from './assets/confirm-small-red.svg'
import { styles } from './style'

import EtherscanLink from '~/components/EtherscanLink'
import Identicon from '~/components/Identicon'
import Block from '~/components/layout/Block'
import Button from '~/components/layout/Button'
import Img from '~/components/layout/Img'
import Paragraph from '~/components/layout/Paragraph'
import { getNameFromAddressBook } from '~/logic/addressBook/store/selectors'

export const CONFIRM_TX_BTN_TEST_ID = 'confirm-btn'
export const EXECUTE_TX_BTN_TEST_ID = 'execute-btn'
export const REJECT_TX_BTN_TEST_ID = 'reject-btn'
export const EXECUTE_REJECT_TX_BTN_TEST_ID = 'execute-reject-btn'

type OwnerProps = {
  classes: Object,
  confirmed?: boolean,
  executor?: string,
  isCancelTx?: boolean,
  onTxReject?: Function,
  onTxConfirm: Function,
  onTxExecute: Function,
  owner: string,
  showRejectBtn: boolean,
  showExecuteRejectBtn: boolean,
  showConfirmBtn: boolean,
  showExecuteBtn: boolean,
  thresholdReached: boolean,
  userAddress: string,
}

const OwnerComponent = ({
  classes,
  confirmed,
  executor,
  isCancelTx,
  onTxConfirm,
  onTxExecute,
  onTxReject,
  owner,
  showConfirmBtn,
  showExecuteBtn,
  showExecuteRejectBtn,
  showRejectBtn,
  thresholdReached,
  userAddress,
}: OwnerProps) => {
  const nameInAdbk = useSelector((state) => getNameFromAddressBook(state, owner))
  const [imgCircle, setImgCircle] = React.useState(ConfirmSmallGreyCircle)

  React.useMemo(() => {
    if (confirmed) {
      setImgCircle(isCancelTx ? CancelSmallFilledCircle : ConfirmSmallFilledCircle)
    } else if (thresholdReached || executor) {
      setImgCircle(isCancelTx ? ConfirmSmallRedCircle : ConfirmSmallGreenCircle)
    }
  }, [confirmed, thresholdReached, executor, isCancelTx])

  const getTimelineLine = () => (isCancelTx ? classes.verticalLineCancel : classes.verticalLineDone)

  return (
    <Block className={classes.container}>
      <div className={cn(classes.verticalLine, (confirmed || thresholdReached || executor) && getTimelineLine())} />
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
      {owner === userAddress && (
        <Block>
          {isCancelTx ? (
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
          ) : (
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
          )}
        </Block>
      )}
      {owner === executor && <Block className={classes.executor}>Executor</Block>}
    </Block>
  )
}

export default withStyles(styles)(OwnerComponent)
