import { Button } from '@material-ui/core'
import local from 'src/utils/storage/local'
import { render, screen } from 'src/utils/test-utils'
import { OnboardingWidget } from '.'

describe('<OnboardingWidget>', () => {
  test('renders widget on initial render and hides it after click on button', () => {
    const text = 'New feature available!'

    render(
      <OnboardingWidget text={text} widgetLocalStorageId="someTestId">
        <span>
          <Button>Testbutton</Button>
        </span>
      </OnboardingWidget>,
    )

    expect(screen.getByText(new RegExp(text))).toBeInTheDocument()
    screen.getByText(/Got it/).click()

    expect(screen.queryByText(new RegExp(text))).not.toBeInTheDocument()
    expect(screen.getByText(/Testbutton/)).toBeInTheDocument()
  })

  test('renders multiple widgets with different local storage ids', () => {
    const text1 = 'New feature available!'

    const text2 = 'Some other feature is available too!'

    render(
      <div>
        <OnboardingWidget text={text1} widgetLocalStorageId="someTestId1">
          <span>
            <Button>First Button</Button>
          </span>
        </OnboardingWidget>
        <OnboardingWidget text={text2} widgetLocalStorageId="someTestId2">
          <span>
            <Button>Second Button</Button>
          </span>
        </OnboardingWidget>
      </div>,
    )

    expect(screen.getByText(new RegExp(text1))).toBeInTheDocument()
    expect(screen.getByText(new RegExp(text2))).toBeInTheDocument()

    screen.getAllByText(/Got it/)[0].click()

    expect(screen.queryByText(new RegExp(text1))).not.toBeInTheDocument()
    expect(screen.getByText(new RegExp(text2))).toBeInTheDocument()

    screen.getByText(/Got it/).click()
    expect(screen.queryByText(new RegExp(text1))).not.toBeInTheDocument()
    expect(screen.queryByText(new RegExp(text2))).not.toBeInTheDocument()

    expect(screen.getByText(/First Button/)).toBeInTheDocument()
    expect(screen.getByText(/Second Button/)).toBeInTheDocument()
  })

  test('renders widget which is already hidden', () => {
    const widgetStorageId = 'alreadyHiddenId'
    local.setItem(widgetStorageId, true)
    const text = 'New feature available!'

    render(
      <OnboardingWidget text={text} widgetLocalStorageId={widgetStorageId}>
        <span>
          <Button>Testbutton</Button>
        </span>
      </OnboardingWidget>,
    )
    expect(screen.queryByText(new RegExp(text))).not.toBeInTheDocument()
    expect(screen.getByText(/Testbutton/)).toBeInTheDocument()
  })
})
