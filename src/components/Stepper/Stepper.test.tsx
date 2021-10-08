import { history } from 'src/routes/routes'
import { fireEvent, render, screen, waitForElementToBeRemoved } from 'src/utils/test-utils'
import Stepper, { StepElement } from './Stepper'

describe('<Stepper>', () => {
  it('Renders Stepper component', () => {
    render(
      <Stepper testId="stepper-component">
        <StepElement label={'Step 1 label'}>
          <div>Step 1 content</div>
        </StepElement>
        <StepElement label={'Step 2 label'}>
          <div>Step 2 content</div>
        </StepElement>
        <StepElement label={'Final step label'}>
          <div>Final step content</div>
        </StepElement>
      </Stepper>,
    )

    const stepperNode = screen.getByTestId('stepper-component')

    expect(stepperNode).toBeInTheDocument()
  })

  it('Renders first step by default', () => {
    render(
      <Stepper testId="stepper-component">
        <StepElement label={'Step 1 label'}>
          <div>Step 1 content</div>
        </StepElement>
        <StepElement label={'Step 2 label'}>
          <div>Step 2 content</div>
        </StepElement>
        <StepElement label={'Final step label'}>
          <div>Final step content</div>
        </StepElement>
      </Stepper>,
    )

    const stepOneNode = screen.getByText('Step 1 content')
    expect(stepOneNode).toBeInTheDocument()
    expect(screen.queryByText('Step 2 content')).not.toBeInTheDocument()
    expect(screen.queryByText('Final step content')).not.toBeInTheDocument()
  })

  it('Renders all step labels', () => {
    render(
      <Stepper testId="stepper-component">
        <StepElement label={'Step 1 label'}>
          <div>Step 1 content</div>
        </StepElement>
        <StepElement label={'Step 2 label'}>
          <div>Step 2 content</div>
        </StepElement>
        <StepElement label={'Final step label'}>
          <div>Final step content</div>
        </StepElement>
      </Stepper>,
    )

    const stepOneLabelNode = screen.getByText('Step 1 label')
    expect(stepOneLabelNode).toBeInTheDocument()

    const stepTwoLabelNode = screen.getByText('Step 2 label')
    expect(stepTwoLabelNode).toBeInTheDocument()

    const finalStepLabelNode = screen.getByText('Final step label')
    expect(finalStepLabelNode).toBeInTheDocument()
  })

  describe('Navigation', () => {
    describe('Next button', () => {
      it('Renders next step when clicks on next button', async () => {
        render(
          <Stepper testId="stepper-component">
            <StepElement label={'Step 1 label'}>
              <div>Step 1 content</div>
            </StepElement>
            <StepElement label={'Step 2 label'}>
              <div>Step 2 content</div>
            </StepElement>
            <StepElement label={'Final step label'}>
              <div>Final step content</div>
            </StepElement>
          </Stepper>,
        )

        // Step 1
        const stepOneNode = screen.getByText('Step 1 content')
        expect(stepOneNode).toBeInTheDocument()
        expect(screen.queryByText('Step 2 content')).not.toBeInTheDocument()
        expect(screen.queryByText('Final step content')).not.toBeInTheDocument()

        // Step 2
        fireEvent.click(screen.getByText('Next'))
        await waitForElementToBeRemoved(() => screen.queryByText('Step 1 content'))
        const stepTwoNode = screen.getByText('Step 2 content')
        expect(stepTwoNode).toBeInTheDocument()
        expect(screen.queryByText('Step 1 content')).not.toBeInTheDocument()
        expect(screen.queryByText('Final step content')).not.toBeInTheDocument()

        // Final Step
        fireEvent.click(screen.getByText('Next'))
        await waitForElementToBeRemoved(() => screen.queryByText('Step 2 content'))
        const finalStepNode = screen.getByText('Final step content')
        expect(finalStepNode).toBeInTheDocument()
        expect(screen.queryByText('Step 1 content')).not.toBeInTheDocument()
        expect(screen.queryByText('Step 2 content')).not.toBeInTheDocument()
      })
    })

    describe('Back button', () => {
      it('Returns to the previous step clicking on back button', async () => {
        render(
          <Stepper testId="stepper-component">
            <StepElement label={'Step 1 label'}>
              <div>Step 1 content</div>
            </StepElement>
            <StepElement label={'Step 2 label'}>
              <div>Step 2 content</div>
            </StepElement>
            <StepElement label={'Final step label'}>
              <div>Final step content</div>
            </StepElement>
          </Stepper>,
        )
        // we start in the Step 2
        fireEvent.click(screen.getByText('Next'))
        await waitForElementToBeRemoved(() => screen.queryByText('Step 1 content'))
        const stepTwoNode = screen.getByText('Step 2 content')
        expect(stepTwoNode).toBeInTheDocument()
        expect(screen.queryByText('Step 1 content')).not.toBeInTheDocument()
        expect(screen.queryByText('Final step content')).not.toBeInTheDocument()

        // we go back to the step 1
        fireEvent.click(screen.getByText('Back'))
        await waitForElementToBeRemoved(() => screen.queryByText('Step 2 content'))
        expect(screen.getByText('Step 1 content')).toBeInTheDocument()
        expect(screen.queryByText('Step 2 content')).not.toBeInTheDocument()
        expect(screen.queryByText('Final step content')).not.toBeInTheDocument()
      })

      it('Returns to the previous screen if we are in the first step and click on Cancel button', () => {
        const goBackSpy = jest.spyOn(history, 'goBack')
        render(
          <Stepper testId="stepper-component">
            <StepElement label={'Step 1 label'}>
              <div>Step 1 content</div>
            </StepElement>
            <StepElement label={'Step 2 label'}>
              <div>Step 2 content</div>
            </StepElement>
            <StepElement label={'Final step label'}>
              <div>Final step content</div>
            </StepElement>
          </Stepper>,
        )

        expect(goBackSpy).not.toHaveBeenCalled()
        fireEvent.click(screen.getByText('Cancel'))
        expect(goBackSpy).toHaveBeenCalled()
        goBackSpy.mockRestore()
      })
    })

    describe('Label navigation', () => {
      it('Previous steps labels are clickable', () => {
        render(
          <Stepper testId="stepper-component">
            <StepElement label={'Step 1 label'}>
              <div>Step 1 content</div>
            </StepElement>
            <StepElement label={'Step 2 label'}>
              <div>Step 2 content</div>
            </StepElement>
            <StepElement label={'Final step label'}>
              <div>Final step content</div>
            </StepElement>
          </Stepper>,
        )

        const stepOneLabelNode = screen.getByText('Step 1 label')
        const stepTwoLabelNode = screen.getByText('Step 2 label')

        // we go to step 2
        const nextButtonNode = screen.getByText('Next')
        fireEvent.click(nextButtonNode)

        // we can go again to step 1 by clicking on the label
        expect(screen.getByText('Step 2 content'))
        fireEvent.click(stepOneLabelNode)
        expect(screen.getByText('Step 1 content'))

        // we go to final step
        fireEvent.click(nextButtonNode)
        fireEvent.click(nextButtonNode)
        expect(screen.getByText('Final step content'))

        // we can go again to step 2 by clicking on the label
        fireEvent.click(stepTwoLabelNode)
        expect(screen.getByText('Step 2 content'))

        // we go to final step again
        fireEvent.click(nextButtonNode)
        expect(screen.getByText('Final step content'))

        // we can go again to step 1 by clicking on the label
        fireEvent.click(stepOneLabelNode)
        expect(screen.getByText('Step 1 content'))
      })

      it('Next steps labels are NOT clickable', () => {
        render(
          <Stepper testId="stepper-component">
            <StepElement label={'Step 1 label'}>
              <div>Step 1 content</div>
            </StepElement>
            <StepElement label={'Step 2 label'}>
              <div>Step 2 content</div>
            </StepElement>
            <StepElement label={'Final step label'}>
              <div>Final step content</div>
            </StepElement>
          </Stepper>,
        )
        const stepTwoLabelNode = screen.getByText('Step 2 label')
        const finalStepLabelNode = screen.getByText('Final step label')

        // we click on the Step 2 label and nothing happens
        expect(screen.getByText('Step 1 content')).toBeInTheDocument()
        fireEvent.click(stepTwoLabelNode)
        expect(screen.getByText('Step 1 content')).toBeInTheDocument()

        // we click on the Final Step label and nothing happens
        expect(screen.getByText('Step 1 content')).toBeInTheDocument()
        fireEvent.click(finalStepLabelNode)
        expect(screen.getByText('Step 1 content')).toBeInTheDocument()

        // we go to step 2 and check the final label is not clickable
        const nextButtonNode = screen.getByText('Next')
        fireEvent.click(nextButtonNode)
        expect(screen.getByText('Step 2 content')).toBeInTheDocument()
        fireEvent.click(finalStepLabelNode)
        expect(screen.getByText('Step 2 content')).toBeInTheDocument()
      })
    })
  })

  it('Customize next button label', async () => {
    const customNextButtonLabel = 'my next button custom label'

    render(
      <Stepper testId="stepper-component">
        <StepElement label={'Step 1 label'} nextButtonLabel={customNextButtonLabel}>
          <div>Step 1 content</div>
        </StepElement>
        <StepElement label={'Step 2 label'}>
          <div>Step 2 content</div>
        </StepElement>
        <StepElement label={'Final step label'}>
          <div>Final step content</div>
        </StepElement>
      </Stepper>,
    )

    expect(screen.getByText(customNextButtonLabel)).toBeInTheDocument()
    expect(screen.queryByText('Next')).not.toBeInTheDocument()
  })

  it('Perform onFinish callback in the last step', async () => {
    const onFinishSpy = jest.fn()

    render(
      <Stepper testId="stepper-component" onFinish={onFinishSpy}>
        <StepElement label={'Step 1 label'}>
          <div>Step 1 content</div>
        </StepElement>
        <StepElement label={'Step 2 label'}>
          <div>Step 2 content</div>
        </StepElement>
        <StepElement label={'Final step label'}>
          <div>Final step content</div>
        </StepElement>
      </Stepper>,
    )

    // we go to the final step
    fireEvent.click(screen.getByText('Next'))
    await waitForElementToBeRemoved(() => screen.queryByText('Step 1 content'))
    fireEvent.click(screen.getByText('Next'))
    await waitForElementToBeRemoved(() => screen.queryByText('Step 2 content'))
    expect(screen.getByText('Final step content')).toBeInTheDocument()

    expect(onFinishSpy).not.toHaveBeenCalled()
    fireEvent.click(screen.getByText('Next'))
    expect(onFinishSpy).toHaveBeenCalled()
  })
})
