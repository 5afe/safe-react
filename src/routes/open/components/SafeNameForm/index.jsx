// @flow
import { withStyles } from '@material-ui/core/styles'
import * as React from 'react'

import OpenPaper from '~/components/Stepper/OpenPaper'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import { required } from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import Paragraph from '~/components/layout/Paragraph'
import { FIELD_NAME } from '~/routes/open/components/fields'
import { secondary, sm } from '~/theme/variables'

type Props = {
  classes: Object,
  safeName?: string,
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

const SafeName = ({ classes, safeName }: Props) => (
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

const SafeNameForm = withStyles(styles)(SafeName)

const SafeNamePage = () => (controls: React.Node, { values }) => {
  const { safeName } = values
  return (
    <OpenPaper controls={controls}>
      <SafeNameForm safeName={safeName} />
    </OpenPaper>
  )
}

export default SafeNamePage
