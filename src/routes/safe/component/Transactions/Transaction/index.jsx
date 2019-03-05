// @flow
import * as React from 'react'
import { List } from 'immutable'
import { connect } from 'react-redux'
import openHoc, { type Open } from '~/components/hoc/OpenHoc'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import IconButton from '@material-ui/core/IconButton'
import ListItemText from '~/components/List/ListItemText'
import Row from '~/components/layout/Row'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Avatar from '@material-ui/core/Avatar'
import AttachMoney from '@material-ui/icons/AttachMoney'
import Atm from '@material-ui/icons/LocalAtm'
import DoneAll from '@material-ui/icons/DoneAll'
import CompareArrows from '@material-ui/icons/CompareArrows'
import Collapsed from '~/routes/safe/component/Transactions/Collapsed'
import { type Transaction } from '~/routes/safe/store/model/transaction'
import Hairline from '~/components/layout/Hairline/index'
import Button from '~/components/layout/Button'
import { sameAddress } from '~/logic/wallets/ethAddresses'
import { type Confirmation } from '~/routes/safe/store/model/confirmation'
import selector, { type SelectorProps } from './selector'

type Props = Open &
  SelectorProps & {
    transaction: Transaction,
    safeName: string,
    threshold: number,
    onProcessTx: (tx: Transaction, alreadyConfirmed: number) => void,
  }

export const PROCESS_TXS = 'PROCESS TRANSACTION'

class GnoTransaction extends React.PureComponent<Props> {
  onProccesClick = () => {
    const { onProcessTx, transaction, confirmed } = this.props

    onProcessTx(transaction, confirmed)
  }

  hasConfirmed = (userAddress: string, confirmations: List<Confirmation>): boolean => (
    confirmations
      .filter(
        (conf: Confirmation) => (
          sameAddress(userAddress, conf.get('owner').get('address')) && conf.get('type') === 'confirmation'
        ),
      )
      .count() > 0
  )

  render() {
    const { open, toggle, transaction, confirmed, safeName, userAddress, executionHash, threshold } = this.props

    const confirmationText = executionHash
      ? 'Already executed'
      : `${confirmed} of the ${threshold} confirmations needed`
    const userConfirmed = this.hasConfirmed(userAddress, transaction.get('confirmations'))

    return (
      <React.Fragment>
        <Row>
          <ListItem onClick={toggle}>
            <Avatar>
              <Atm />
            </Avatar>
            <ListItemText primary="Tx Name" secondary={transaction.get('name')} />
            <Avatar>
              <AttachMoney />
            </Avatar>
            <ListItemText primary="Value" secondary={`${transaction.get('value')} ETH`} />
            <Avatar>
              <DoneAll />
            </Avatar>
            <ListItemText primary="Status" secondary={confirmationText} />
            <ListItemIcon>
              {open ? (
                <IconButton disableRipple>
                  <ExpandLess />
                </IconButton>
              ) : (
                <IconButton disableRipple>
                  <ExpandMore />
                </IconButton>
              )}
            </ListItemIcon>
          </ListItem>
        </Row>
        <Row>
          <ListItem>
            {executionHash && (
              <React.Fragment>
                <Avatar>
                  <CompareArrows />
                </Avatar>
                <ListItemText cut primary="Transaction Hash" secondary={executionHash} />
              </React.Fragment>
            )}
            {!executionHash && userConfirmed && (
              <React.Fragment>
                <Avatar>
                  <CompareArrows />
                </Avatar>
                <ListItemText cut primary="Confirmed" secondary="Waiting for the rest of confirmations" />
              </React.Fragment>
            )}
            {!executionHash && !userConfirmed && (
              <Button variant="contained" color="primary" onClick={this.onProccesClick}>
                {PROCESS_TXS}
              </Button>
            )}
          </ListItem>
        </Row>
        {open && (
          <Collapsed
            safeName={safeName}
            confirmations={transaction.get('confirmations')}
            destination={transaction.get('destination')}
            threshold={threshold}
          />
        )}
        <Hairline margin="md" />
      </React.Fragment>
    )
  }
}

export default openHoc(connect(selector)(GnoTransaction))
