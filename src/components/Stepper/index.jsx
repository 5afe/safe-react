// @flow
import * as React from 'react'
import Stepper from '@material-ui/core/Stepper'
import FormStep from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import { withStyles } from '@material-ui/core/styles'
import GnoForm from '~/components/forms/GnoForm'
import Hairline from '~/components/layout/Hairline'
import { history } from '~/store'
import Controls from './Controls'

const { useState, useEffect } = React

export { default as Step } from './Step'

type Props = {
  steps: string[],
  onSubmit: (values: Object) => Promise<void>,
  children: React.Node,
  classes: Object,
  initialValues?: Object,
  disabledWhenValidating?: boolean,
  mutators?: Object,
  testId?: string,
}

type PageProps = {
  children: Function,
  prepareNextInitialProps?: (values: Object) => {},
}

const transitionProps = {
  timeout: {
    enter: 350,
    exit: 0,
  },
}

export const StepperPage = ({ children }: PageProps) => children

const GnoStepper = (props: Props) => {
  const [page, setPage] = useState<number>(0)
  const [values, setValues] = useState<Object>({})

  useEffect(() => {
    if (props.initialValues) {
      setValues(props.initialValues)
    }
  }, [])

  const getPageProps = (pages: React.Node): PageProps => React.Children.toArray(pages)[page].props

  const updateInitialProps = (newInitialProps) => {
    setValues(newInitialProps)
  }

  const getActivePageFrom = (pages: React.Node) => {
    const activePageProps = getPageProps(pages)
    const { children, ...restProps } = activePageProps

    return children({ ...restProps, updateInitialProps })
  }

  const validate = (valuesToValidate: Object) => {
    const { children } = props

    const activePage = React.Children.toArray(children)[page]
    return activePage.props.validate ? activePage.props.validate(valuesToValidate) : {}
  }

  const next = async (formValues: Object) => {
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

  const handleSubmit = async (formValues: Object) => {
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

  const {
    steps, children, classes, disabledWhenValidating = false, testId, mutators,
  } = props
  const activePage = getActivePageFrom(children)

  const lastPage = isLastPage(page)
  const penultimate = isLastPage(page + 1)

  return (
    <React.Fragment>
      <GnoForm
        onSubmit={handleSubmit}
        initialValues={values}
        validation={validate}
        testId={testId}
        formMutators={mutators}
      >
        {(submitting: boolean, validating: boolean, ...rest: any) => {
          const disabled = disabledWhenValidating ? submitting || validating : submitting
          const controls = (
            <React.Fragment>
              <Hairline />
              <Controls
                disabled={disabled}
                onPrevious={previous}
                firstPage={page === 0}
                lastPage={lastPage}
                penultimate={penultimate}
              />
            </React.Fragment>
          )

          return (
            <Stepper classes={{ root: classes.root }} activeStep={page} orientation="vertical">
              {steps.map(label => (
                <FormStep key={label}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent TransitionProps={transitionProps}>{activePage(controls, ...rest)}</StepContent>
                </FormStep>
              ))}
            </Stepper>
          )
        }}
      </GnoForm>
    </React.Fragment>
  )
}

const styles = {
  root: {
    flex: '1 1 auto',
    backgroundColor: 'transparent',
  },
}

export default withStyles(styles)(GnoStepper)
