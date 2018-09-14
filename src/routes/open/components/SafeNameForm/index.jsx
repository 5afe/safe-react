// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import { required } from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import { FIELD_NAME } from '~/routes/open/components/fields'
import Paragraph from '~/components/layout/Paragraph'
import OpenPaper from '../OpenPaper'

type Props = {
  classes: Object,
}

const styles = () => ({
  root: {
    display: 'flex',
  },
})

const SafeName = ({ classes }: Props) => (
  <Block margin="md" className={classes.root}>
    <Field
      name={FIELD_NAME}
      component={TextField}
      type="text"
      validate={required}
      placeholder="Name of the new Safe"
      text="Safe name"
    />
  </Block>
)

const SafeNameForm = withStyles(styles)(SafeName)

const SafeNamePage = () => () => (
  <OpenPaper>
    <Paragraph size="md" color="primary">
      This setup will create a Safe with one or more owners. Optionally give the Safe a local name.
      By continuing you consent with the terms of use and privacy policy.
    </Paragraph>
    <Paragraph size="md" color="primary" weight="bolder">
      &#9679; I understand that my funds are held securely in my Safe. They cannot be accessed by Gnosis.
    </Paragraph>
    <Paragraph size="md" color="primary" weight="bolder">
      &#9679; My Safe is a smart contract on the Ethereum blockchain.
    </Paragraph>
    <SafeNameForm />
  </OpenPaper>
)

export default SafeNamePage
