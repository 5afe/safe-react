// @flow
import * as React from 'react'
import { List as ImmutableList } from 'immutable'
import Row from '~/components/layout/Row'
import Col from '~/components/layout/Col'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '~/components/List/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import Group from '@material-ui/icons/Group'
import MailOutline from '@material-ui/icons/MailOutline'
import { type Confirmation } from '~/routes/safe/store/model/confirmation'
import Confirmations from './Confirmations'

type Props = {
  safeName: string,
  confirmations: ImmutableList<Confirmation>,
  destination: string,
  threshold: number,
}

const listStyle = {
  width: '100%',
}

class Collapsed extends React.PureComponent<Props, {}> {
  render() {
    const {
      confirmations, destination, safeName, threshold,
    } = this.props

    return (
      <Row>
        <Col sm={12} top="xs" overflow>
          <List style={listStyle}>
            <ListItem>
              <Avatar><Group /></Avatar>
              <ListItemText primary={safeName} secondary="Safe Name" />
            </ListItem>
            <Confirmations confirmations={confirmations} threshold={threshold} />
            <ListItem>
              <Avatar><MailOutline /></Avatar>
              <ListItemText primary="Destination" secondary={destination} />
            </ListItem>
          </List>
        </Col>
      </Row>
    )
  }
}

export default Collapsed
