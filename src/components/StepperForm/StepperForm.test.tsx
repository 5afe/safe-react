import { fireEvent, render, screen, waitForElementToBeRemoved } from 'src/utils/test-utils'
import Field from '../forms/Field'
import TextField from '../forms/TextField'
import StepperForm, { StepFormElement } from './StepperForm'

describe('<StepperForm>', () => {
  it('Renders StepperForm component', () => {
    const onSubmitSpy = jest.fn()
    const stepOneValidationsSpy = jest.fn()
    const finalStepValidationsSpy = jest.fn()

    const { container } = render(
      <StepperForm onSubmit={onSubmitSpy} testId={'stepper-form-test'}>
        <StepFormElement label={'Step 1 label'} validate={stepOneValidationsSpy}>
          <div>
            <div>Step 1 content</div>
            <Field component={TextField} name={'stepOneTextfield'} type="text" testId="stepOneTextfield-field" />
          </div>
        </StepFormElement>
        <StepFormElement label={'Step 2 label'}>
          <div>
            <div>Step 2 content</div>
            <Field component={TextField} name={'stepTwoTextfield'} type="text" testId="stepTwoTextfield-field" />
          </div>
        </StepFormElement>
        <StepFormElement label={'Final step label'} validate={finalStepValidationsSpy}>
          <div>Final step content</div>
        </StepFormElement>
      </StepperForm>,
    )

    const formNode = container.querySelector('form')

    expect(formNode).toBeInTheDocument()
    expect(screen.getByTestId('stepper-form-test')).toBeInTheDocument()
  })

  it('Initial values in the form', () => {
    const onSubmitSpy = jest.fn()
    const stepOneValidationsSpy = jest.fn()
    const finalStepValidationsSpy = jest.fn()

    const initialValues = {
      stepOneTextfield: 'initial value of stepOneTextfield',
      stepTwoTextfield: 'initial value of stepTwoTextfield',
    }

    render(
      <StepperForm initialValues={initialValues} onSubmit={onSubmitSpy} testId={'stepper-form-test'}>
        <StepFormElement label={'Step 1 label'} validate={stepOneValidationsSpy}>
          <div>
            <div>Step 1 content</div>
            <Field component={TextField} name={'stepOneTextfield'} type="text" testId="stepOneTextfield-field" />
          </div>
        </StepFormElement>
        <StepFormElement label={'Step 2 label'}>
          <div>
            <div>Step 2 content</div>
            <Field component={TextField} name={'stepTwoTextfield'} type="text" testId="stepTwoTextfield-field" />
          </div>
        </StepFormElement>
        <StepFormElement label={'Final step label'} validate={finalStepValidationsSpy}>
          <div>Final step content</div>
        </StepFormElement>
      </StepperForm>,
    )

    const stepOneInputNode = screen.getByTestId('stepOneTextfield-field') as HTMLInputElement

    expect(stepOneInputNode).toBeInTheDocument()
    expect(stepOneInputNode.value).toBe('initial value of stepOneTextfield')
  })

  it('renders <StepFormElement>', () => {
    render(
      <StepFormElement label={'Step form label'}>
        <div>Step form content</div>
      </StepFormElement>,
    )

    expect(screen.getByText('Step form content')).toBeInTheDocument()
  })

  describe('Form navigation', () => {
    it('Renders next form step when clicks on next button', async () => {
      const onSubmitSpy = jest.fn()
      const stepOneValidationsSpy = jest.fn()
      const finalStepValidationsSpy = jest.fn()

      render(
        <StepperForm onSubmit={onSubmitSpy} testId={'stepper-form-test'}>
          <StepFormElement label={'Step 1 label'} validate={stepOneValidationsSpy}>
            <div>
              <div>Step 1 content</div>
              <Field component={TextField} name={'stepOneTextfield'} type="text" testId="stepOneTextfield-field" />
            </div>
          </StepFormElement>
          <StepFormElement label={'Step 2 label'}>
            <div>
              <div>Step 2 content</div>
              <Field component={TextField} name={'stepTwoTextfield'} type="text" testId="stepTwoTextfield-field" />
            </div>
          </StepFormElement>
          <StepFormElement label={'Final step label'} validate={finalStepValidationsSpy}>
            <div>Final step content</div>
          </StepFormElement>
        </StepperForm>,
      )

      // Form Step 1
      const formStepOneNode = screen.getByText('Step 1 content')
      expect(formStepOneNode).toBeInTheDocument()
      const stepOneInputNode = screen.getByTestId('stepOneTextfield-field')
      expect(stepOneInputNode).toBeInTheDocument()

      // Form Step 2
      fireEvent.click(screen.getByText('Next'))
      await waitForElementToBeRemoved(() => screen.queryByText('Step 1 content'))
      const formStepTwoNode = screen.getByText('Step 2 content')
      expect(formStepTwoNode).toBeInTheDocument()
      const stepTwoInputNode = screen.getByTestId('stepTwoTextfield-field')
      expect(stepTwoInputNode).toBeInTheDocument()

      // Final Form Step
      fireEvent.click(screen.getByText('Next'))
      await waitForElementToBeRemoved(() => screen.queryByText('Step 2 content'))
      const finalFormStepNode = screen.getByText('Final step label')
      expect(finalFormStepNode).toBeInTheDocument()
    })
  })

  describe('Form validations', () => {
    it('Triggers validations when clicks on next button', async () => {
      const onSubmitSpy = jest.fn()
      const stepOneValidationsSpy = jest.fn()
      const finalStepValidationsSpy = jest.fn()

      render(
        <StepperForm onSubmit={onSubmitSpy} testId={'stepper-form-test'}>
          <StepFormElement label={'Step 1 label'} validate={stepOneValidationsSpy}>
            <div>
              <div>Step 1 content</div>
              <Field component={TextField} name={'stepOneTextfield'} type="text" testId="stepOneTextfield-field" />
            </div>
          </StepFormElement>
          <StepFormElement label={'Step 2 label'}>
            <div>
              <div>Step 2 content</div>
              <Field component={TextField} name={'stepTwoTextfield'} type="text" testId="stepTwoTextfield-field" />
            </div>
          </StepFormElement>
          <StepFormElement label={'Final step label'} validate={finalStepValidationsSpy}>
            <div>Final step content</div>
          </StepFormElement>
        </StepperForm>,
      )

      fireEvent.click(screen.getByText('Next'))
      expect(stepOneValidationsSpy).toHaveBeenCalled()
      expect(finalStepValidationsSpy).not.toHaveBeenCalled()
      await waitForElementToBeRemoved(() => screen.queryByText('Step 1 content'))

      expect(finalStepValidationsSpy).not.toHaveBeenCalled()
      fireEvent.click(screen.getByText('Next'))
      await waitForElementToBeRemoved(() => screen.queryByText('Step 2 content'))
      expect(finalStepValidationsSpy).toHaveBeenCalled()
    })

    it('If errors are present in the form you can not go to the next step', () => {
      const onSubmitSpy = jest.fn()
      const stepOneValidationsWithErrorsSpy = jest.fn(() => ({
        stepOneTextfield: 'this field has an error',
      }))
      const finalStepValidationsSpy = jest.fn()

      render(
        <StepperForm onSubmit={onSubmitSpy} testId={'stepper-form-test'}>
          <StepFormElement label={'Step 1 label'} validate={stepOneValidationsWithErrorsSpy}>
            <div>
              <div>Step 1 content</div>
              <Field component={TextField} name={'stepOneTextfield'} type="text" testId="stepOneTextfield-field" />
            </div>
          </StepFormElement>
          <StepFormElement label={'Step 2 label'}>
            <div>
              <div>Step 2 content</div>
              <Field component={TextField} name={'stepTwoTextfield'} type="text" testId="stepTwoTextfield-field" />
            </div>
          </StepFormElement>
          <StepFormElement label={'Final step label'} validate={finalStepValidationsSpy}>
            <div>Final step content</div>
          </StepFormElement>
        </StepperForm>,
      )

      // we try to go next
      fireEvent.click(screen.getByText('Next'))
      expect(stepOneValidationsWithErrorsSpy).toHaveBeenCalled()
      expect(screen.queryByText('Step 2 content')).not.toBeInTheDocument()
    })

    it('Shows the form errors', () => {
      const onSubmitSpy = jest.fn()
      const stepOneValidationsWithErrorsSpy = jest.fn(() => ({
        stepOneTextfield: 'this field has an error',
      }))
      const finalStepValidationsSpy = jest.fn()

      render(
        <StepperForm onSubmit={onSubmitSpy} testId={'stepper-form-test'}>
          <StepFormElement label={'Step 1 label'} validate={stepOneValidationsWithErrorsSpy}>
            <div>
              <div>Step 1 content</div>
              <Field component={TextField} name={'stepOneTextfield'} type="text" testId="stepOneTextfield-field" />
            </div>
          </StepFormElement>
          <StepFormElement label={'Step 2 label'}>
            <div>
              <div>Step 2 content</div>
              <Field component={TextField} name={'stepTwoTextfield'} type="text" testId="stepTwoTextfield-field" />
            </div>
          </StepFormElement>
          <StepFormElement label={'Final step label'} validate={finalStepValidationsSpy}>
            <div>Final step content</div>
          </StepFormElement>
        </StepperForm>,
      )

      // we try to go next
      fireEvent.click(screen.getByText('Next'))
      expect(screen.queryByText('this field has an error')).toBeInTheDocument()
    })
  })

  it('Performs onSubmit in the final form step', async () => {
    const onSubmitSpy = jest.fn()
    const stepOneValidations = jest.fn()
    const finalStepValidationsSpy = jest.fn()

    render(
      <StepperForm onSubmit={onSubmitSpy} testId={'stepper-form-test'}>
        <StepFormElement label={'Step 1 label'} validate={stepOneValidations}>
          <div>
            <div>Step 1 content</div>
            <Field component={TextField} name={'stepOneTextfield'} type="text" testId="stepOneTextfield-field" />
          </div>
        </StepFormElement>
        <StepFormElement label={'Step 2 label'}>
          <div>
            <div>Step 2 content</div>
            <Field component={TextField} name={'stepTwoTextfield'} type="text" testId="stepTwoTextfield-field" />
          </div>
        </StepFormElement>
        <StepFormElement label={'Final step label'} validate={finalStepValidationsSpy}>
          <div>Final step content</div>
        </StepFormElement>
      </StepperForm>,
    )

    // we go to the final step
    fireEvent.click(screen.getByText('Next'))
    await waitForElementToBeRemoved(() => screen.queryByText('Step 1 content'))
    fireEvent.click(screen.getByText('Next'))
    await waitForElementToBeRemoved(() => screen.queryByText('Step 2 content'))

    expect(onSubmitSpy).not.toHaveBeenCalled()
    fireEvent.click(screen.getByText('Next'))
    expect(onSubmitSpy).toHaveBeenCalled()
  })

  it('If errors are present, the form is not Submitted', async () => {
    const onSubmitSpy = jest.fn()
    const stepOneValidationsSpy = jest.fn()
    const finalStepValidationsWithErrorsSpy = jest.fn(() => ({
      error: 'this a final step error',
    }))

    render(
      <StepperForm onSubmit={onSubmitSpy} testId={'stepper-form-test'}>
        <StepFormElement label={'Step 1 label'} validate={stepOneValidationsSpy}>
          <div>
            <div>Step 1 content</div>
            <Field component={TextField} name={'stepOneTextfield'} type="text" testId="stepOneTextfield-field" />
          </div>
        </StepFormElement>
        <StepFormElement label={'Step 2 label'}>
          <div>
            <div>Step 2 content</div>
            <Field component={TextField} name={'stepTwoTextfield'} type="text" testId="stepTwoTextfield-field" />
          </div>
        </StepFormElement>
        <StepFormElement label={'Final step label'} validate={finalStepValidationsWithErrorsSpy}>
          <div>Final step content</div>
        </StepFormElement>
      </StepperForm>,
    )

    // we go to the final step
    fireEvent.click(screen.getByText('Next'))
    await waitForElementToBeRemoved(() => screen.queryByText('Step 1 content'))
    fireEvent.click(screen.getByText('Next'))
    await waitForElementToBeRemoved(() => screen.queryByText('Step 2 content'))

    expect(onSubmitSpy).not.toHaveBeenCalled()
    fireEvent.click(screen.getByText('Next'))
    expect(onSubmitSpy).not.toHaveBeenCalled()
  })

  it('Disables Next step button', () => {
    const onSubmitSpy = jest.fn()
    const stepOneValidationsSpy = jest.fn()
    const finalStepValidationsSpy = jest.fn()

    const { container } = render(
      <StepperForm onSubmit={onSubmitSpy} testId={'stepper-form-test'}>
        <StepFormElement disableNextButton label={'Step 1 label'} validate={stepOneValidationsSpy}>
          <div>
            <div>Step 1 content</div>
            <Field component={TextField} name={'stepOneTextfield'} type="text" testId="stepOneTextfield-field" />
          </div>
        </StepFormElement>
        <StepFormElement label={'Step 2 label'}>
          <div>
            <div>Step 2 content</div>
            <Field component={TextField} name={'stepTwoTextfield'} type="text" testId="stepTwoTextfield-field" />
          </div>
        </StepFormElement>
        <StepFormElement label={'Final step label'} validate={finalStepValidationsSpy}>
          <div>Final step content</div>
        </StepFormElement>
      </StepperForm>,
    )

    // Next button disabled
    expect(container.querySelector('button[type=submit]')).toBeDisabled()
    // Back button NOT disabled
    expect(container.querySelector('button[type=button]')).not.toBeDisabled()

    // stay at Step 1 even if we click on the disabled Next button
    fireEvent.click(screen.getByText('Next'))
    expect(screen.getByText('Step 1 content')).toBeInTheDocument()
    expect(screen.queryByText('Step 2 content')).not.toBeInTheDocument()
  })
})
