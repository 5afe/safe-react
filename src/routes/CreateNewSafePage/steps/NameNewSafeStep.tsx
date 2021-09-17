import { ReactElement, useEffect } from 'react'
import { makeStyles } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { useForm } from 'react-final-form'

import Block from 'src/components/layout/Block'
import { lg } from 'src/theme/variables'
import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'
import { providerNameSelector } from 'src/logic/wallets/store/selectors'
import { FIELD_CREATE_CUSTOM_SAFE_NAME, FIELD_CREATE_SUGGESTED_SAFE_NAME } from '../fields/createSafeFields'
import { useStepper } from 'src/components/NewStepper/stepperContext'
import NetworkLabel from 'src/components/NetworkLabel/NetworkLabel'

export const nameNewSafeStepLabel = 'Name'

function NameNewSafeStep(): ReactElement {
  const classes = useStyles()

  const provider = useSelector(providerNameSelector)

  const { setCurrentStep } = useStepper()

  useEffect(() => {
    if (!provider) {
      setCurrentStep(0)
    }
  }, [provider, setCurrentStep])

  const createNewSafeForm = useForm()

  const formValues = createNewSafeForm.getState().values

  return (
    <Block className={classes.padding} data-testid={'create-safe-name-step'}>
      <Block margin="md">
        <Paragraph color="primary" noMargin size="lg">
          You are about to create a new Gnosis Safe wallet with one or more owners. First, let&apos;s give your new
          wallet a name. This name is only stored locally and will never be shared with Gnosis or any third parties. The
          new Safe will ONLY be available on <NetworkLabel />
        </Paragraph>
      </Block>
      <label htmlFor={FIELD_CREATE_CUSTOM_SAFE_NAME}>Name of the new Safe</label>
      <Block className={classes.fieldContainer} margin="lg">
        <Col xs={11}>
          <Field
            component={TextField}
            name={FIELD_CREATE_CUSTOM_SAFE_NAME}
            placeholder={formValues[FIELD_CREATE_SUGGESTED_SAFE_NAME]}
            text="Safe name"
            type="text"
            testId="create-new-safe-name-field"
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
