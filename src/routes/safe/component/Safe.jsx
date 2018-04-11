// @flow
import * as React from 'react'
import Block from '~/components/layout/Block'
import Bold from '~/components/layout/Bold'
import Col from '~/components/layout/Col'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import Table, { TableBody, TableCell, TableHead, TableRow } from '~/components/layout/Table'
import { type Safe } from '~/routes/safe/store/model/safe'

type SafeProps = {
  safe: Safe,
}

const GnoSafe = ({ safe }: SafeProps) => (
  <React.Fragment>
    <Row>
      <Col xs={12}>
        <Paragraph size="lg">
          <Bold>{safe.name.toUpperCase()}</Bold>
        </Paragraph>
      </Col>
    </Row>
    <Row>
      <Paragraph size="lg">
        <Bold>Address</Bold>
      </Paragraph>
    </Row>
    <Row>
      <Block>
        <Paragraph>
          {safe.address}
        </Paragraph>
      </Block>
    </Row>
    <Row>
      <Paragraph size="lg">
        <Bold>Number of required confirmations per transaction</Bold>
      </Paragraph>
    </Row>
    <Row>
      <Paragraph>
        {safe.get('confirmations')}
      </Paragraph>
    </Row>
    <Row>
      <Paragraph size="lg">
        <Bold>Owners</Bold>
      </Paragraph>
    </Row>
    <Row margin="lg">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Adress</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {safe.owners.map(owner => (
            <TableRow key={safe.address}>
              <TableCell>{owner.name}</TableCell>
              <TableCell>{owner.address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div />
    </Row>
  </React.Fragment>
)

export default GnoSafe
