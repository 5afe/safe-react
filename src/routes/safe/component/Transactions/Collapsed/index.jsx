// @flow
import * as React from 'react'
import { List as ImmutableList } from 'immutable'
import Row from '~/components/layout/Row'
import Col from '~/components/layout/Col'
import List, { ListItem } from 'material-ui/List'
import ListItemText from '~/components/List/ListItemText'
import Avatar from 'material-ui/Avatar'
import Group from 'material-ui-icons/Group'
import MailOutline from 'material-ui-icons/MailOutline'
import { type Confirmation } from '~/routes/safe/store/model/confirmation'
import Confirmations from './Confirmations'

type Props = {
  safeName: string,
  confirmations: ImmutableList<Confirmation>,
  destination: string,
  tx: string,
}

const listStyle = {
  width: '100%',
}

class Collapsed extends React.PureComponent<Props, {}> {
  render() {
    const {
      confirmations, destination, safeName, tx,
    } = this.props

    return (
      <Row>
        <Col sm={12} top="xs" overflow>
          <List style={listStyle}>
            <ListItem>
              <Avatar><Group /></Avatar>
              <ListItemText primary={safeName} secondary="Safe Name" />
            </ListItem>
            <Confirmations confirmations={confirmations} />
            <ListItem>
              <Avatar><MailOutline /></Avatar>
              <ListItemText primary="Destination" secondary={destination} />
            </ListItem>
            { tx &&
              <ListItem>
                <Avatar><MailOutline /></Avatar>
                <ListItemText cut primary="Transaction Hash" secondary={tx} />
              </ListItem>
            }
          </List>
        </Col>
      </Row>
    )
  }
}

export default Collapsed
