import { withStyles } from '@material-ui/core/styles'
import * as React from 'react'

import OpenPaper from 'src/components/Stepper/OpenPaper'
import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'
import { required } from 'src/components/forms/validator'
import Block from 'src/components/layout/Block'
import Paragraph from 'src/components/layout/Paragraph'
import { FIELD_NAME } from 'src/routes/open/components/fields'
import { secondary, sm } from 'src/theme/variables'

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

const SafeName = ({ classes, safeName }) => (
  <>
    <Block margin="lg">
      <Paragraph color="primary" noMargin size="md">
        You are about to create a new Gnosis Safe wallet with one or more owners. First, let&apos;s give your new wallet
        a name. This name is only stored locally and will never be shared with Gnosis or any third parties.
      </Paragraph>
    </Block>
    <Block className={classes.root} margin="lg">
      <Field
        component={TextField}
        defaultValue={safeName}
        name={FIELD_NAME}
        placeholder="Name of the new Safe"
        text="Safe name"
        type="text"
        validate={required}
        testId="create-safe-name-field"
      />
    </Block>
    <Block margin="lg">
      <Paragraph className={classes.links} color="primary" noMargin size="md">
        By continuing you consent with the{' '}
        <a href="https://safe.gnosis.io/terms" rel="noopener noreferrer" target="_blank">
          terms of use
        </a>{' '}
        and{' '}
        <a href="https://safe.gnosis.io/privacy" rel="noopener noreferrer" target="_blank">
          privacy policy
        </a>
        . Most importantly, you confirm that your funds are held securely in the Gnosis Safe, a smart contract on the
        Ethereum blockchain. These funds cannot be accessed by Gnosis at any point.
      </Paragraph>
    </Block>
  </>
)

const SafeNameForm = withStyles(styles as any)(SafeName)

const SafeNamePage = () => (controls, { values }) => {
  const { safeName } = values
  return (
    <OpenPaper controls={controls}>
      <SafeNameForm safeName={safeName} />
    </OpenPaper>
  )
}

export default SafeNamePage
