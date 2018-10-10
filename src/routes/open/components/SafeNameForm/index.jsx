// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import { required } from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import Row from '~/components/layout/Row'
import { FIELD_NAME } from '~/routes/open/components/fields'
import Paragraph from '~/components/layout/Paragraph'
import OpenPaper from '~/components/Stepper/OpenPaper'
import { sm, secondary } from '~/theme/variables'

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
  <React.Fragment>
    <Block margin="lg">
      <Paragraph noMargin size="md" color="primary" weight="light" className={classes.links}>
        This setup will create a Safe with one or more owners. Optionally give the Safe a local name.
        By continuing you consent with the <a rel="noopener noreferrer" href="https://safe.gnosis.io/terms" target="_blank">terms of use</a> and <a rel="noopener noreferrer" href="https://safe.gnosis.io/privacy" target="_blank">privacy policy</a>.
      </Paragraph>
    </Block>
    <Row margin="md" className={classes.text}>
      <Paragraph noMargin className={classes.dot} color="secondary">
        &#9679;
      </Paragraph>
      <Paragraph noMargin size="md" color="primary" weight="bolder">
        I understand that my funds are held securely in my Safe. They cannot be accessed by Gnosis.
      </Paragraph>
    </Row>
    <Row margin="md">
      <Paragraph noMargin className={classes.dot} color="secondary">
        &#9679;
      </Paragraph>
      <Paragraph noMargin size="md" color="primary" weight="bolder">
        My Safe is a smart contract on the Ethereum blockchain.
      </Paragraph>
    </Row>
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
  <OpenPaper controls={controls} container={600}>
    <SafeNameForm />
  </OpenPaper>
)

export default SafeNamePage
