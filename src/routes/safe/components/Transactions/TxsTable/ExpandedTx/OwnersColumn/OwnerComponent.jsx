// @flow
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '~/components/layout/Button'
import Img from '~/components/layout/Img'
import EtherscanLink from '~/components/EtherscanLink'
import Identicon from '~/components/Identicon'
import Block from '~/components/layout/Block'
import Paragraph from '~/components/layout/Paragraph'
import { type Owner } from '~/routes/safe/store/models/owner'
import { styles } from './style'
import ConfirmSmallGreyIcon from './assets/confirm-small-grey.svg'
import ConfirmSmallGreenIcon from './assets/confirm-small-green.svg'
import ConfirmSmallFilledIcon from './assets/confirm-small-filled.svg'
import { getNameFromAddressBook } from '~/logic/addressBook/utils'

export const CONFIRM_TX_BTN_TEST_ID = 'confirm-btn'
export const EXECUTE_TX_BTN_TEST_ID = 'execute-btn'

type OwnerProps = {
  owner: Owner,
  classes: Object,
  userAddress: string,
  confirmed?: boolean,
  executor?: string,
  thresholdReached: boolean,
  showConfirmBtn: boolean,
  showExecuteBtn: boolean,
  onTxConfirm: Function,
  onTxExecute: Function
}

const OwnerComponent = ({
  owner,
  userAddress,
  classes,
  onTxConfirm,
  showConfirmBtn,
  showExecuteBtn,
  onTxExecute,
  executor,
  confirmed,
  thresholdReached,
}: OwnerProps) => {
  const nameInAdbk = getNameFromAddressBook(owner.address)
  const ownerName = owner.name === 'UNKNOWN' && nameInAdbk ? nameInAdbk : owner.name
  return (
    <Block className={classes.container}>
      <div
        className={
          confirmed || thresholdReached || executor
            ? classes.verticalLineProgressDone
            : classes.verticalLineProgressPending
        }
      />
      <div className={classes.iconState}>
        {confirmed ? (
          <Img src={ConfirmSmallFilledIcon} />
        ) : thresholdReached || executor ? (
          <Img src={ConfirmSmallGreenIcon} />
        ) : (
          <Img src={ConfirmSmallGreyIcon} />
        )}
      </div>
      <Identicon address={owner.address} diameter={32} className={classes.icon} />
      <Block>
        <Paragraph className={classes.name} noMargin>
          {ownerName}
        </Paragraph>
        <EtherscanLink
          className={classes.address}
          type="address"
          value={owner.address}
          cut={4}
        />
      </Block>
      <Block className={classes.spacer} />
      {showConfirmBtn && owner.address === userAddress && (
        <Button
          className={classes.button}
          variant="contained"
          minWidth={140}
          color="primary"
          onClick={onTxConfirm}
          testId={CONFIRM_TX_BTN_TEST_ID}
        >
          Confirm tx
        </Button>
      )}
      {showExecuteBtn && owner.address === userAddress && (
        <Button
          className={classes.button}
          variant="contained"
          minWidth={140}
          color="primary"
          onClick={onTxExecute}
          testId={EXECUTE_TX_BTN_TEST_ID}
        >
          Execute tx
        </Button>
      )}
      {owner.address === executor && (
        <Block className={classes.executor}>Executor</Block>
      )}
    </Block>
  )
}

export default withStyles(styles)(OwnerComponent)
