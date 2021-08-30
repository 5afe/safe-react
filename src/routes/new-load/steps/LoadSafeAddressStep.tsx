import { makeStyles } from '@material-ui/core'
import React, { ReactElement } from 'react'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'
import AddressInput from 'src/components/forms/AddressInput'
import { ScanQRWrapper } from 'src/components/ScanQRModal/ScanQRWrapper'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-final-form'
import {
  FIELD_LOAD_CUSTOM_SAFE_NAME,
  FIELD_LOAD_SAFE_ADDRESS,
  FIELD_LOAD_SUGGESTED_SAFE_NAME,
} from '../constants/load-field-names'
import { useStepper } from 'src/components/NewStepper/stepperContext'
import { StepFormElement } from 'src/components/StepperForm/StepperForm'

function LoadSafeAddressStep(): ReactElement {
  const classes = useStyles()

  const loadSafeForm = useForm()
  const loadSafeStepper = useStepper()

  const formValues = loadSafeForm.getState().values

  console.log('FORM VALUES !', formValues)
  console.log('STEPPER VALUES', loadSafeStepper)

  // TODO: handleScan
  const handleScan = () => {}

  const safeName = formValues[FIELD_LOAD_CUSTOM_SAFE_NAME] || formValues[FIELD_LOAD_SUGGESTED_SAFE_NAME]

  // TODO: safeAddress
  const { safeAddress } = useParams<{ safeAddress?: string }>()

  return (
    <StepFormElement
      label={'Name and address'}
      validate={(values) => {
        const errors = {}

        if (!values.safeAddress) {
          return {
            safeAddress: 'safeAddress Required',
          }
        }
        console.log('Validations of LoadSafeAddressStep', values, errors)
        return errors
      }}
    >
      {/* TODO: add more options to StepFormElementProps */}
      <>
        <Block margin="md">
          <Paragraph color="primary" noMargin size="md">
            You are about to add an existing Gnosis Safe. First, choose a name and enter the Safe address. The name is
            only stored locally and will never be shared with Gnosis or any third parties.
            <br />
            Your connected wallet does not have to be the owner of this Safe. In this case, the interface will provide
            you a read-only view.
          </Paragraph>

          <Paragraph color="primary" size="md" className={classes.links}>
            Don&apos;t have the address of the Safe you created?{' '}
            <a
              href="https://help.gnosis-safe.io/en/articles/4971293-i-don-t-remember-my-safe-address-where-can-i-find-it"
              rel="noopener noreferrer"
              target="_blank"
            >
              This article explains how to find it.
            </a>
          </Paragraph>
        </Block>
        <Block className={classes.root}>
          <Col xs={11}>
            <Field
              component={TextField}
              name={FIELD_LOAD_CUSTOM_SAFE_NAME}
              placeholder={safeName}
              text="Safe name"
              type="text"
              testId="load-safe-name-field"
            />
          </Col>
        </Block>
        <Block className={classes.root} margin="lg">
          <Col xs={11}>
            {/* TODO: configure AddressInput */}
            <AddressInput
              defaultValue={safeAddress}
              fieldMutator={() => {
                // fieldMutator={(val) => {
                // form.mutators.setValue(FIELD_LOAD_ADDRESS, val)
              }}
              // eslint-disable-next-line
              // @ts-ignore
              // inputAdornment={
              //   noErrorsOn(FIELD_LOAD_ADDRESS, errors) && {
              //     endAdornment: (
              //       <InputAdornment position="end">
              //         <CheckCircle className={classes.check} data-testid="valid-address" />
              //       </InputAdornment>
              //     ),
              //   }
              // }
              name={FIELD_LOAD_SAFE_ADDRESS}
              placeholder="Safe Address*"
              text="Safe Address"
              testId="load-safe-address-field"
            />
          </Col>
          <Col center="xs" className={classes} middle="xs" xs={1}>
            <ScanQRWrapper handleScan={handleScan} />
          </Col>
        </Block>
        <Block margin="sm">
          <Paragraph className={classes.links} color="primary" noMargin size="md">
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
    </StepFormElement>
  )
}

export default LoadSafeAddressStep

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    maxWidth: '460px',
    marginTop: '12px',
  },
  check: {
    color: '#03AE60',
    height: '20px',
  },
  links: {
    '&>a': {
      color: theme.palette.secondary.main,
    },
  },
}))
