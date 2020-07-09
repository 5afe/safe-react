import FormStep from '@material-ui/core/Step'
import StepContent from '@material-ui/core/StepContent'
import StepLabel from '@material-ui/core/StepLabel'
import Stepper from '@material-ui/core/Stepper'
import { withStyles } from '@material-ui/core/styles'
import * as React from 'react'

import Controls from './Controls'

import GnoForm from 'src/components/forms/GnoForm'
import Hairline from 'src/components/layout/Hairline'
import { history } from 'src/store'

const { useEffect, useState } = React

export { default as Step } from './Step'

const transitionProps = {
  timeout: {
    enter: 350,
    exit: 0,
  },
}

export const StepperPage = ({ children }: any) => children

const GnoStepper = (props: any) => {
  const [page, setPage] = useState(0)
  const [values, setValues] = useState({})

  useEffect(() => {
    if (props.initialValues) {
      setValues(props.initialValues)
    }
  }, [props.initialValues])

  const getPageProps: any = (pages) => {
    const aux: any = React.Children.toArray(pages)[page]
    return aux.props
  }

  const updateInitialProps = (newInitialProps) => {
    setValues(newInitialProps)
  }

  const getActivePageFrom = (pages) => {
    const activePageProps = getPageProps(pages)
    const { children, ...restProps } = activePageProps

    return children({ ...restProps, updateInitialProps })
  }

  const validate = (valuesToValidate) => {
    const { children } = props

    const activePage: any = React.Children.toArray(children)[page]
    return activePage.props.validate ? activePage.props.validate(valuesToValidate) : {}
  }

  const next = async (formValues) => {
    const { children } = props
    const activePageProps = getPageProps(children)
    const { prepareNextInitialProps } = activePageProps

    let pageInitialProps
    if (prepareNextInitialProps) {
      pageInitialProps = await prepareNextInitialProps(formValues)
    }

    const finalValues = { ...formValues, ...pageInitialProps }

    setValues(finalValues)
    setPage(Math.min(page + 1, React.Children.count(children) - 1))
  }

  const previous = () => {
    const firstPage = page === 0
    if (firstPage) {
      return history.goBack()
    }

    return setPage(Math.max(page - 1, 0))
  }

  const handleSubmit = async (formValues) => {
    const { children, onSubmit } = props
    const isLastPage = page === React.Children.count(children) - 1
    if (isLastPage) {
      return onSubmit(formValues)
    }

    return next(formValues)
  }

  const isLastPage = (pageNumber) => {
    const { steps } = props
    return pageNumber === steps.length - 1
  }

  const { buttonLabels, children, classes, disabledWhenValidating = false, mutators, steps, testId } = props
  const activePage = getActivePageFrom(children)

  const lastPage = isLastPage(page)
  const penultimate = isLastPage(page + 1)

  return (
    <>
      <GnoForm
        formMutators={mutators}
        initialValues={values}
        onSubmit={handleSubmit}
        testId={testId}
        validation={validate}
      >
        {(submitting, validating, ...rest) => {
          const disabled = disabledWhenValidating ? submitting || validating : submitting
          const controls = (
            <>
              <Hairline />
              <Controls
                buttonLabels={buttonLabels}
                currentStep={page}
                disabled={disabled}
                firstPage={page === 0}
                lastPage={lastPage}
                onPrevious={previous}
                penultimate={penultimate}
              />
            </>
          )

          return (
            <Stepper activeStep={page} classes={{ root: classes.root }} orientation="vertical">
              {steps.map((label, index) => {
                const labelProps: any = {}
                const isClickable = index < page

                if (isClickable) {
                  labelProps.onClick = () => {
                    setPage(index)
                  }
                  labelProps.className = classes.pointerCursor
                }

                return (
                  <FormStep key={label}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                    <StepContent TransitionProps={transitionProps}>{activePage(controls, ...rest)}</StepContent>
                  </FormStep>
                )
              })}
            </Stepper>
          )
        }}
      </GnoForm>
    </>
  )
}

const styles = {
  root: {
    flex: '1 1 auto',
    backgroundColor: 'transparent',
  },
  pointerCursor: {
    '& > .MuiStepLabel-iconContainer': {
      cursor: 'pointer',
    },
    '& > .MuiStepLabel-labelContainer': {
      cursor: 'pointer',
    },
  },
}

export default withStyles(styles as any)(GnoStepper)
