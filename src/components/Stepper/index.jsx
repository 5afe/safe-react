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

  validate = (values: Object) => {
    const activePage = React.Children.toArray(this.props.children)[
      this.state.page
    ]
    return activePage.props.validate ? activePage.props.validate(values) : {}
  }

  previous = () =>
    this.setState(state => ({
      page: Math.max(state.page - 1, 0),
    }))

  render() {
    const { steps, onSubmit, children } = this.props
    const { page, values } = this.state
    const activePage = React.Children.toArray(children)[page].props.children

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
          onSubmit={onSubmit}
          initialValues={values}
          width="500"
          validation={this.validate}
          render={activePage}
        >
          <Row>
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
