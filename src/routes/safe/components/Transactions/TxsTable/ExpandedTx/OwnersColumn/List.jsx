// @flow
import React from 'react'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import MuiList from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Chip from '@material-ui/core/Chip'
import Img from '~/components/layout/Img'
import Button from '~/components/layout/Button'
import EtherscanLink from '~/components/EtherscanLink'
import Identicon from '~/components/Identicon'
import Hairline from '~/components/layout/Hairline'
import Row from '~/components/layout/Row'
import Block from '~/components/layout/Block'
import Paragraph from '~/components/layout/Paragraph'
import { type Owner } from '~/routes/safe/store/models/owner'
import ConfirmSmallGrey from './assets/confirm-small-grey.svg'
import ConfirmedSmallFilled from './assets/confirmed-small-filled.svg'
import { styles } from './style'

export const CONFIRM_TX_BTN_TEST_ID = 'confirm-btn'
export const EXECUTE_TX_BTN_TEST_ID = 'execute-btn'

type ListProps = {
  ownersWhoConfirmed: List<Owner>,
  ownersUnconfirmed: List<Owner>,
  classes: Object,
  executionConfirmation?: Owner,
  onTxConfirm: Function,
  showConfirmBtn: boolean,
  onTxExecute: Function,
  showExecuteBtn: boolean,
}

type OwnerProps = {
  owner: Owner,
  classes: Object,
  isExecutor?: boolean,
  onTxConfirm: Function,
  showConfirmBtn: boolean,
  onTxExecute: Function,
  showExecuteBtn: boolean,
}

const OwnerComponent = withStyles(styles)(({
  owner,
  classes,
  isExecutor,
  onTxConfirm,
  showConfirmBtn,
  showExecuteBtn,
  onTxExecute,
}: OwnerProps) => (
  <Block key={owner.address} className={classes.container}>
    <div className={classes.iconState}>
    
    </div>
    <Identicon address={owner.address} diameter={32} className={classes.icon} />
    <Block>
      <Paragraph className={classes.name} noMargin>
        {owner.name}
      </Paragraph>
      <EtherscanLink className={classes.address} type="address" value={owner.address} cut={4} />
    </Block>
    {showConfirmBtn && (
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
    {showExecuteBtn && (
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
  ownersWhoConfirmed,
  ownersUnconfirmed,
  classes,
  executionConfirmation,
  onTxConfirm,
  showConfirmBtn,
  showExecuteBtn,
  onTxExecute,
}: ListProps) => (
  <>
    {executionConfirmation && <OwnerComponent owner={executionConfirmation} isExecutor />}
    {ownersWhoConfirmed.map((owner) => (
      <OwnerComponent
        key={owner.address}
        owner={owner}
        showExecuteBtn={showExecuteBtn}
        onTxExecute={onTxExecute}
      />
    ))}
    ---
    {ownersUnconfirmed.map((owner) => (
      <OwnerComponent
        key={owner.address}
        owner={owner}
        onTxConfirm={onTxConfirm}
        showConfirmBtn={showConfirmBtn}
        showExecuteBtn={showExecuteBtn}
        onTxExecute={onTxExecute}
      />
    ))}
  </>
)

export default withStyles(styles)(OwnersList)
