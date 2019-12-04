// @flow
import React from 'react'
import { List } from 'immutable'
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
import ConfirmSmallFilledIcon from './assets/confirmed-small-filled.svg'

export const CONFIRM_TX_BTN_TEST_ID = 'confirm-btn'
export const EXECUTE_TX_BTN_TEST_ID = 'execute-btn'

type ListProps = {
  ownersWhoConfirmed: List<Owner>,
  ownersUnconfirmed: List<Owner>,
  classes: Object,
  isExecutor?: boolean,
  userAddress: String,
  executionConfirmation?: Owner,
  onTxConfirm: Function,
  showConfirmBtn: boolean,
  onTxExecute: Function,
  showExecuteBtn: boolean,
}

type OwnerProps = {
  owner: Owner,
  classes: Object,
  userAddress: String,
  onTxConfirm: Function,
  showConfirmBtn: boolean,
  onTxExecute: Function,
  showExecuteBtn: boolean,
  confirmed?: boolean,
}

const OwnerComponent = withStyles(styles)(({
  owner,
  userAddress,
  classes,
  onTxConfirm,
  showConfirmBtn,
  showExecuteBtn,
  onTxExecute,
  confirmed,
}: OwnerProps) => (
  <Block key={owner.address} className={classes.container}>
    <div className={confirmed ? classes.verticalLineProgressDone : classes.verticalLineProgressPending} />
    <div className={classes.iconState}>
      {confirmed ? <Img src={ConfirmSmallFilledIcon} /> : <Img src={ConfirmSmallGreyIcon} />}
    </div>
    <Identicon address={owner.address} diameter={32} className={classes.icon} />
    <Block>
      <Paragraph className={classes.name} noMargin>
        {owner.name}
      </Paragraph>
      <EtherscanLink className={classes.address} type="address" value={owner.address} cut={4} />
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
  </Block>
))

const OwnersList = ({
  userAddress,
  ownersWhoConfirmed,
  ownersUnconfirmed,
  classes,
  isExecutor,
  executionConfirmation,
  onTxConfirm,
  showConfirmBtn,
  showExecuteBtn,
  onTxExecute,
}: ListProps) => (
  <>
    {executionConfirmation && <OwnerComponent owner={executionConfirmation} isExecutor={isExecutor} />}
    {ownersWhoConfirmed.map((owner) => (
      <OwnerComponent
        key={owner.address}
        owner={owner}
        classes={classes}
        userAddress={userAddress}
        showExecuteBtn={showExecuteBtn}
        onTxExecute={onTxExecute}
        confirmed
      />
    ))}
    {ownersUnconfirmed.map((owner) => (
      <OwnerComponent
        key={owner.address}
        owner={owner}
        classes={classes}
        userAddress={userAddress}
        onTxConfirm={onTxConfirm}
        showConfirmBtn={showConfirmBtn}
        showExecuteBtn={showExecuteBtn}
        onTxExecute={onTxExecute}
      />
    ))}
  </>
)

export default withStyles(styles)(OwnersList)
