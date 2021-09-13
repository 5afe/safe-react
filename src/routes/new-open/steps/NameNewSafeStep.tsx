import React, { ReactElement } from 'react'
import { makeStyles } from '@material-ui/core'

import Block from 'src/components/layout/Block'
import { lg } from 'src/theme/variables'
import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'
import NetworkLabel from 'src/components/AppLayout/Header/components/NetworkLabel'
import { FIELD_CREATE_CUSTOM_SAFE_NAME, FIELD_CREATE_SUGGESTED_SAFE_NAME } from '../fields/createSafeFields'
import { useForm } from 'react-final-form'

export const nameNewSafeStepLabel = 'Name'

function NameNewSafeStep(): ReactElement {
  const classes = useStyles()

  const loadSafeForm = useForm()

  const formValues = loadSafeForm.getState().values
  const safeName = formValues[FIELD_CREATE_CUSTOM_SAFE_NAME] || formValues[FIELD_CREATE_SUGGESTED_SAFE_NAME]

  return (
    <Block className={classes.padding} data-testid={'create-safe-name-step'}>
      <Block margin="md">
        <Paragraph className={classes.descriptionContainer} color="primary" noMargin size="lg">
          You are about to create a new Safe wallet with one or more owners. First, let&apos;s give your new wallet a
          name. This name is only stored locally and will never be shared with Gnosis or any third parties. The new Safe
          will ONLY be available on
        </Paragraph>
        <div className={classes.labelContainer}>
          <NetworkLabel />
        </div>
      </Block>
      <label htmlFor={FIELD_CREATE_CUSTOM_SAFE_NAME}>Name of the new Safe</label>
      <Block className={classes.fieldContainer} margin="lg">
        <Col xs={11}>
          <Field
            component={TextField}
            name={FIELD_CREATE_CUSTOM_SAFE_NAME}
            placeholder={safeName}
            text="Safe name"
            type="text"
            testId="load-safe-name-field"
          />
        </Col>
      </Block>
      <Block margin="lg">
        <Paragraph className={classes.links} color="primary" noMargin size="lg">
          By continuing you consent with the{' '}
          <a href="https://gnosis-safe.io/terms" rel="noopener noreferrer" target="_blank">
            terms of use
          </a>{' '}
          and{' '}
          <a href="https://gnosis-safe.io/privacy" rel="noopener noreferrer" target="_blank">
            privacy policy
          </a>
          . Most importantly, you confirm that your founds are held securely in the Gnosis Safe, a smart contract on the
          Ethereum blockchain. These founds cannot be accessed by Gnosis at any point.
        </Paragraph>
      </Block>
    </Block>
  )
}

export default NameNewSafeStep

const useStyles = makeStyles((theme) => ({
  padding: {
    padding: lg,
  },
  descriptionContainer: {
    display: 'inline',
    lineHeight: '1.7',
  },
  labelContainer: {
    display: 'inline-block',
  },
  fieldContainer: {
    display: 'flex',
    maxWidth: '460px',
    marginTop: '12px',
  },
  links: {
    '&>a': {
      color: theme.palette.secondary.main,
    },
  },
}))
