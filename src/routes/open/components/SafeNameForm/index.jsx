// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import { required } from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import { FIELD_NAME } from '~/routes/open/components/fields'
import Paragraph from '~/components/layout/Paragraph'
import OpenPaper from '~/components/Stepper/OpenPaper'

type Props = {
  classes: Object,
}

const styles = () => ({
  root: {
    display: 'flex',
  },
})

const SafeName = ({ classes }: Props) => (
  <React.Fragment>
    <Block margin="lg">
      <Paragraph noMargin size="md" color="primary" weight="light">
        This setup will create a Safe with one or more owners. Optionally give the Safe a local name.
        By continuing you consent with the terms of use and privacy policy.
      </Paragraph>
    </Block>
    <Block margin="md">
      <Paragraph noMargin size="md" color="primary" weight="bolder">
        &#9679; I understand that my funds are held securely in my Safe. They cannot be accessed by Gnosis.
      </Paragraph>
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

const SafeNameForm = withStyles(styles)(SafeName)

const SafeNamePage = () => (controls: React$Node) => (
  <OpenPaper controls={controls}>
    <SafeNameForm />
  </OpenPaper>
)

export default SafeNamePage
