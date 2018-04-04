// @flow
import { List } from 'immutable'
import * as React from 'react'
import Bold from '~/components/layout/Bold'
import Button from '~/components/layout/Button'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'
import Link from '~/components/layout/Link'
import Paragraph from '~/components/layout/Paragraph/index'
import { type Safe } from '~/routes/safe/store/model/safe'
import SafeTable from '~/routes/safeList/components/SafeTable'

type Props = {
  safes: List<Safe>
}

const NoSafes = () => (
  <Row>
    <Col xs={12} center="xs" sm={10} smOffset={2} start="sm" margin="md">
      <Paragraph size="lg">
        <Bold>No safes created, please create a new one</Bold>
      </Paragraph>
    </Col>
    <Col xs={12} center="xs" sm={10} smOffset={2} start="sm" margin="md">
      <Link to="/open">
        <Button variant="raised" size="small" color="primary">CREATE A NEW SAFE</Button>
      </Link>
    </Col>
  </Row>
)

const SafeList = ({ safes }: Props) => {
  const safesAvailable = safes && safes.count() > 0

  return (
    <React.Fragment>
      { safesAvailable
        ? <SafeTable safes={safes} />
        : <NoSafes />
      }
    </React.Fragment>
  )
}

export default SafeList
