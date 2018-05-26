// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import openHoc, { type Open } from '~/components/hoc/OpenHoc'
import ExpandLess from 'material-ui-icons/ExpandLess'
import ExpandMore from 'material-ui-icons/ExpandMore'
import ListItemText from '~/components/List/ListItemText'
import Row from '~/components/layout/Row'
import { ListItem, ListItemIcon } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import AttachMoney from 'material-ui-icons/AttachMoney'
import Atm from 'material-ui-icons/LocalAtm'
import DoneAll from 'material-ui-icons/DoneAll'
import Collapsed from '~/routes/safe/component/Transactions/Collapsed'
import { type Transaction } from '~/routes/safe/store/model/transaction'
import Hairline from '~/components/layout/Hairline/index'
import selector, { type SelectorProps } from './selector'

type Props = Open & SelectorProps & {
  transaction: Transaction,
  safeName: string,
}

class GnoTransaction extends React.PureComponent<Props, {}> {
  render() {
    const {
      open, toggle, transaction, confirmed, safeName,
    } = this.props

    const txHash = transaction.get('tx')
    const confirmationText = txHash ? 'Already executed' : `${confirmed} of the ${transaction.get('threshold')} confirmations needed`

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
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemIcon>
          </ListItem>
        </Row>
        { open &&
          <Collapsed
            safeName={safeName}
            confirmations={transaction.get('confirmations')}
            destination={transaction.get('destination')}
            tx={transaction.get('tx')}
          /> }
        <Hairline />
      </React.Fragment>
    )
  }
}

export default connect(selector)(openHoc(GnoTransaction))
