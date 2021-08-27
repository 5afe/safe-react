import React, { ReactElement } from 'react'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import { makeStyles } from '@material-ui/core/'

import { useSelector } from 'react-redux'
import Block from 'src/components/layout/Block'
import Heading from 'src/components/layout/Heading'
import Page from 'src/components/layout/Page'
import Row from 'src/components/layout/Row'
import StepperForm, { StepForm } from 'src/components/StepperForm/StepperForm'
import { providerNameSelector } from 'src/logic/wallets/store/selectors'
import { history } from 'src/store'
import { sm } from 'src/theme/variables'
import LoadSafeAddressStep from './steps/LoadSafeAddressStep'
import LoadSafeOwnersStep from './steps/LoadSafeOwnersStep'
import ReviewLoadStep from './steps/ReviewLoadStep'

const loadSteps: Array<StepForm> = [
  {
    label: 'Name and address',
    validations: () => {
      console.log('Validations of LoadSafeAddressStep')
    },
    component: LoadSafeAddressStep,
  },
  {
    label: 'Owners',
    validations: () => {
      console.log('Validations of LoadSafeOwnersStep')
    },
    nextButtonLabel: 'Review',
    component: LoadSafeOwnersStep,
  },
  {
    label: 'Review',
    validations: () => {
      console.log('Validations of ReviewLoadStep')
    },
    nextButtonLabel: 'Add',
    component: ReviewLoadStep,
  },
]

function Load(): ReactElement {
  const provider = useSelector(providerNameSelector)

  const classes = useStyles()

  // TODO: back & iconStyle
  const goBack = () => {
    history.goBack()
  }

  // TODO: onsubmit
  const onSubmit = () => {
    console.log('SUBMIT')
  }

  return (
    <Page>
      {provider ? (
        <Block>
          <Row align="center">
            <IconButton disableRipple onClick={goBack} className={classes.backIcon}>
              <ChevronLeft />
            </IconButton>
            <Heading tag="h2">Add existing Safe</Heading>
          </Row>
          {/* TODO: disableNextButton */}
          <StepperForm testId={'load-safe-form'} onSubmit={onSubmit} steps={loadSteps} disableNextButton={false} />
        </Block>
      ) : (
        <div>No account detected</div>
      )}
    </Page>
  )
}

export default Load

const useStyles = makeStyles((theme) => ({
  backIcon: {
    color: theme.palette.secondary.main,
    padding: sm,
    marginRight: '5px',
  },
}))
