import FormStep from '@material-ui/core/Step'
import StepContent from '@material-ui/core/StepContent'
import StepLabel from '@material-ui/core/StepLabel'
import Stepper from '@material-ui/core/Stepper'
import { makeStyles } from '@material-ui/core/styles'
import React, { useCallback, useEffect, useState } from 'react'
import { FormApi } from 'final-form'

import Controls from './Controls'

import GnoForm from 'src/components/forms/GnoForm'
import Hairline from 'src/components/layout/Hairline'
import { history } from 'src/store'

const transitionProps = {
  timeout: {
    enter: 350,
    exit: 0,
  },
}

export interface StepperPageFormProps {
  values: Record<string, string>
  errors: Record<string, string>
  form: FormApi
}

interface StepperPageProps {
  validate?: (...args: unknown[]) => undefined | string[] | Promise<undefined | Record<string, string>>
  component: (
    ...args: unknown[]
  ) => (controls: React.ReactElement, formProps: StepperPageFormProps) => React.ReactElement
  [key: string]: unknown
}

// TODO: Remove this magic
/* eslint-disable */
// @ts-ignore
export const StepperPage = ({}: StepperPageProps): null => null
/* eslint-enable */

type StepperFormValues = Record<string, string>

interface Mutators {
  [key: string]: (...args: unknown[]) => void
}

interface GnoStepperProps<V = StepperFormValues> {
  initialValues?: Partial<V>
  onSubmit: (formValues: V) => void
  steps: string[]
  buttonLabels?: string[]
  children: React.ReactNode
  disabledWhenValidating?: boolean
  mutators?: Mutators
  testId?: string
}

function GnoStepper<V>(props: GnoStepperProps<V>): React.ReactElement {
  const [page, setPage] = useState(0)
  const [values, setValues] = useState({})
  const classes = useStyles()

  useEffect(() => {
    if (props.initialValues) {
      setValues(props.initialValues)
    }
  }, [props.initialValues])

  const getPageProps: any = (pages) => {
    const aux: any = React.Children.toArray(pages)[page]
    return aux.props
  }

  const updateInitialProps = useCallback((newInitialProps) => {
    setValues(newInitialProps)
  }, [])

  const getActivePageFrom = (pages) => {
    const activePageProps = getPageProps(pages)
    const { component, ...restProps } = activePageProps

    return component({ ...restProps, updateInitialProps })
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

  const isLastPage = (pageNumber: number): boolean => {
    const { steps } = props
    return pageNumber === steps.length - 1
  }

  const { buttonLabels, children, disabledWhenValidating = false, mutators, steps, testId } = props
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

const useStyles = makeStyles({
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
})

export default GnoStepper
