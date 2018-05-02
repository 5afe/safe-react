// @flow
import * as React from 'react'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Bold from '~/components/layout/Bold'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import { type Safe } from '~/routes/safe/store/model/safe'
import List from 'material-ui/List'

import Address from './Address'
import Balance from './Balance'
import Owners from './Owners'
import Confirmations from './Confirmations'
import DailyLimit from './DailyLimit'

type SafeProps = {
  safe: Safe,
  balance: string,
}

const listStyle = {
  width: '100%',
  minWidth: '485px',
}

class GnoSafe extends React.PureComponent<SafeProps> {
  render() {
    const { safe, balance } = this.props

    return (
      <Row>
        <Col xs={12} top="xs" sm={4} margin="xl">
          <List style={listStyle}>
            <Balance balance={balance} />
            <Owners owners={safe.owners} />
            <Confirmations confirmations={safe.get('confirmations')} />
            <Address address={safe.get('address')} />
            <DailyLimit limit={safe.get('dailyLimit')} />
          </List>
        </Col>
        <Col xs={12} center="xs" sm={8} margin="xl" layout="block">
          <Block margin="xl">
            <Paragraph size="lg" noMargin align="right">
              <Bold>{safe.name.toUpperCase()}</Bold>
            </Paragraph>
          </Block>
          <Block>
            Extra info will be placed here
          </Block>
        </Col>
      </Row>
    )
  }
}

/*
        <Paragraph size="lg">
          <Bold>{safe.name.toUpperCase()}</Bold>
*/
export default GnoSafe
