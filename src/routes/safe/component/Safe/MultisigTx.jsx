// @flow
import * as React from 'react'
import { ListItem } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import AcoountBalanceWallet from 'material-ui-icons/AccountBalanceWallet'
import Button from '~/components/layout/Button'
import ListItemText from '~/components/List/ListItemText'

type Props = {
  balance: string,
  onAddTx: () => void,
  onSeeTxs: () => void,
}

export const ADD_MULTISIG_BUTTON_TEXT = 'Add'
export const SEE_MULTISIG_BUTTON_TEXT = 'TXs'

const addStyle = {
  marginRight: '10px',
}

const DailyLimitComponent = ({ balance, onAddTx, onSeeTxs }: Props) => {
  const text = `Available ${balance} ETH`
  const disabled = Number(balance) <= 0

  return (
    <ListItem>
      <Avatar>
        <AcoountBalanceWallet />
      </Avatar>
      <ListItemText primary="Multisig TXs" secondary={text} />
      <Button
        style={addStyle}
        variant="raised"
        color="primary"
        onClick={onAddTx}
        disabled={disabled}
      >
        {ADD_MULTISIG_BUTTON_TEXT}
      </Button>
      <Button
        variant="raised"
        color="primary"
        onClick={onSeeTxs}
      >
        {SEE_MULTISIG_BUTTON_TEXT}
      </Button>
    </ListItem>
  )
}

export default DailyLimitComponent
