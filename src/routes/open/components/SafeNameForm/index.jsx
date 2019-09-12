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
import { sm, secondary } from '~/theme/variables'

export const safeNameValidation = async (values: Object) => {
  const errors = {}

  if (!values[FIELD_NAME]) {
    errors[FIELD_NAME] = 'Required'
  }

  return errors
}

type Props = {
  classes: Object,
}

const styles = () => ({
  root: {
    display: 'flex',
    maxWidth: '440px',
  },
  text: {
    flexWrap: 'nowrap',
  },
  dot: {
    marginRight: sm,
  },
  links: {
    '&>a': {
      color: secondary,
    },
  },
})

const SafeName = ({ classes }: Props) => (
  <>
    <Block margin="lg">
      <Paragraph noMargin size="md" color="primary">
        You are about to create a new Gnosis Safe wallet with one or more owners. First, let&apos;s give your new wallet
        a name. This name is only stored locally and will never be shared with Gnosis or any third parties.
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
    <Block margin="lg">
      <Paragraph noMargin size="md" color="primary" className={classes.links}>
        By continuing you consent with the
        {' '}
        <a rel="noopener noreferrer" href="https://safe.gnosis.io/terms" target="_blank">
          terms of use
        </a>
        {' '}
        and
        {' '}
        <a rel="noopener noreferrer" href="https://safe.gnosis.io/privacy" target="_blank">
          privacy policy
        </a>
        . Most importantly, you confirm that your funds are held securely in the Gnosis Safe, a smart contract on the
        Ethereum blockchain. These funds cannot be accessed by Gnosis at any point.
      </Paragraph>
    </Block>
  </>
)

const SafeNameForm = withStyles(styles)(SafeName)

const SafeNamePage = () => (controls: React.Node) => (
  <OpenPaper controls={controls}>
    <SafeNameForm />
  </OpenPaper>
)

export default SafeNamePage
