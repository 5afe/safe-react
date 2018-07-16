// @flow
import * as React from 'react'
import ListItem from '@material-ui/core/ListItem'
import Avatar from '@material-ui/core/Avatar'
import AcoountBalanceWallet from '@material-ui/icons/AccountBalanceWallet'
import Button from '~/components/layout/Button'
import ListItemText from '~/components/List/ListItemText'

type Props = {
  onSeeTxs: () => void,
}

export const SEE_MULTISIG_BUTTON_TEXT = 'TXs'

const DailyLimitComponent = ({ onSeeTxs }: Props) => {
  const text = 'See multisig txs executed on this Safe'

  return (
    <ListItem>
      <Avatar>
        <AcoountBalanceWallet />
      </Avatar>
      <ListItemText primary="Safe's Multisig Transaction" secondary={text} />
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
