// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import { required } from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import Row from '~/components/layout/Row'
import Col from '~/components/layout/Col'
import { FIELD_NAME } from '~/routes/open/components/fields'
import Paragraph from '~/components/layout/Paragraph'
import OpenPaper from '~/components/Stepper/OpenPaper'
import { getAccountsFrom } from '~/routes/open/utils/safeDataExtractor'
import Hairline from '~/components/layout/Hairline'
import { lg } from '~/theme/variables'

type Props = {
  classes: Object,
}

const styles = () => ({
  root: {
    display: 'flex',
  },
  padding: {
    padding: lg,
  },
})

const SafeOwners = ({ classes }: Props) => (
  <React.Fragment>
    <Block className={classes.padding}>
      <Paragraph noMargin size="md" color="primary" weight="light">
        Specify the owners of the Safe.
      </Paragraph>
    </Block>
    <Block margin="md">
      <Hairline margin="sm" />
      <Row className={classes.padding}>
        <Col xs={4}>
          NAME
        </Col>
        <Col xs={8}>
          ADDRESS
        </Col>
      </Row>
      <Hairline margin="sm" />
    </Block>
    <Block margin="md">
      <Paragraph size="md" color="primary" weight="bolder">
        &#9679; My Safe is a smart contract on the Ethereum blockchain.
      </Paragraph>
    </Block>
    <Block margin="lg" className={classes.root}>
      <Field
        name={FIELD_NAME}
        component={TextField}
        type="text"
        validate={required}
        placeholder="Name of the new Safe"
        text="Safe name"
      />
    </Block>
  </React.Fragment>
)

const SafeOwnersForm = withStyles(styles)(SafeOwners)

const SafeOwnersPage = () => (controls: React$Node, { values }: Object) => (
  <React.Fragment>
    <OpenPaper controls={controls} padding={false}>
      <SafeOwnersForm numOwners={values.owners} otherAccounts={getAccountsFrom(values)} />
    </OpenPaper>
  </React.Fragment>
)

export default SafeOwnersPage
