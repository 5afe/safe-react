import { createStyles, makeStyles } from '@material-ui/core/styles'
import * as React from 'react'
import styled from 'styled-components'

import OpenPaper from 'src/components/Stepper/OpenPaper'
import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'
import Block from 'src/components/layout/Block'
import Paragraph from 'src/components/layout/Paragraph'
import { FIELD_CUSTOM_SAFE_NAME, FIELD_SAFE_NAME } from 'src/routes/open/components/fields'
import { secondary, sm } from 'src/theme/variables'
import { LoadFormValues } from 'src/routes/load/container/Load'

const styles = createStyles({
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

const StyledField = styled(Field)`
  &.MuiTextField-root {
    width: 460px;
  }
`

const useSafeNameStyles = makeStyles(styles)

const SafeNameForm = ({ safeName }: { safeName: string }): React.ReactElement => {
  const classes = useSafeNameStyles()

  return (
    <>
      <Block margin="lg">
        <Paragraph color="primary" noMargin size="lg">
          You are about to create a new Safe with one or more owners. First, let&apos;s give your new Safe a name. This
          name is only stored locally and will never be shared with Gnosis or any third parties.
        </Paragraph>
      </Block>
      <Block className={classes.root} margin="sm">
        <label>Name of the new Safe</label>
      </Block>
      <Block className={classes.root} margin="lg">
        <StyledField
          component={TextField}
          name={FIELD_CUSTOM_SAFE_NAME}
          placeholder={safeName}
          text="Safe name"
          type="text"
          testId="create-safe-name-field"
        />
      </Block>
      <Block margin="lg">
        <Paragraph className={classes.links} color="primary" noMargin size="lg">
          By continuing you consent to the{' '}
          <a href="https://gnosis-safe.io/terms" rel="noopener noreferrer" target="_blank">
            terms of use
          </a>{' '}
          and{' '}
          <a href="https://gnosis-safe.io/privacy" rel="noopener noreferrer" target="_blank">
            privacy policy
          </a>
          .
        </Paragraph>
      </Block>
    </>
  )
}

const SafeNamePageComponent = () =>
  function SafeNamePage(controls: React.ReactNode, { values }: { values: LoadFormValues }): React.ReactElement {
    return (
      <OpenPaper controls={controls}>
        <SafeNameForm safeName={values[FIELD_CUSTOM_SAFE_NAME] || values[FIELD_SAFE_NAME]} />
      </OpenPaper>
    )
  }

export default SafeNamePageComponent
