// @flow
import Stepper, { Step as FormStep, StepLabel } from 'material-ui/Stepper'
import * as React from 'react'
import type { FormApi } from 'react-final-form'
import Button from '~/components/layout/Button'
import GnoForm from '~/components/forms/GnoForm'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'

export { default as Step } from './Step'

type Props = {
  steps: string[],
  initialValues?: Object,
  children: React$Node,
  onSubmit: (values: Object, form: FormApi, callback: ?(errors: ?Object) => void) => ?Object | Promise<?Object> | void,
}

type State = {
  page: number,
  values: Object,
}

type PageProps = {
  children: Function,
}

class GnoStepper extends React.PureComponent<Props, State> {
  static Page = ({ children }: PageProps) => children

  constructor(props: Props) {
    super(props)

    this.state = {
      page: 0,
      values: props.initialValues || {},
    }
  }

  getActivePageFrom = (pages: React$Node) => {
    const activePageProps = React.Children.toArray(pages)[this.state.page].props
    const { children, ...props } = activePageProps

    return children(props)
  }

  validate = (values: Object) => {
    const activePage = React.Children.toArray(this.props.children)[
      this.state.page
    ]
    return activePage.props.validate ? activePage.props.validate(values) : {}
  }

  next = (values: Object) =>
    this.setState(state => ({
      page: Math.min(state.page + 1, React.Children.count(this.props.children) - 1),
      values,
    }))

  previous = () =>
    this.setState(state => ({
      page: Math.max(state.page - 1, 0),
    }))

  handleSubmit = (values: Object) => {
    const { children, onSubmit } = this.props
    const { page } = this.state
    const isLastPage = page === React.Children.count(children) - 1
    if (isLastPage) {
      return onSubmit(values)
    }

    return this.next(values)
  }

  render() {
    const { steps, children } = this.props
    const { page, values } = this.state
    const activePage = this.getActivePageFrom(children)

    return (
      <React.Fragment>
        <Stepper activeStep={page} alternativeLabel>
          {steps.map(label => (
            <FormStep key={label}>
              <StepLabel>{label}</StepLabel>
            </FormStep>
          ))}
        </Stepper>
        <GnoForm
          onSubmit={this.handleSubmit}
          initialValues={values}
          padding={150}
          validation={this.validate}
          render={activePage}
        >
          <Row align="end" margin="lg" grow>
            <Col xs={12} center="xs">
              <Button
                type="button"
                disabled={page === 0}
                onClick={this.previous}
              >
                Back
              </Button>
              <Button
                variant="raised"
                color="primary"
                type="submit"
              >
                {page === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Col>
          </Row>
        </GnoForm>
      </React.Fragment>
    )
  }
}

export default GnoStepper
