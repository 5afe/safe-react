import { Button } from '@material-ui/core'
import local from 'src/utils/storage/local'
import { render, screen } from 'src/utils/test-utils'
import { OnboardingTooltip } from '.'

describe('<OnboardingWidget>', () => {
  test('renders widget on initial render and hides it after click on button', () => {
    const text = 'New feature available!'

    render(
      <OnboardingTooltip text={text} widgetLocalStorageId="someTestId">
        <Button>Testbutton</Button>
      </OnboardingTooltip>,
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
        <OnboardingTooltip text={text1} widgetLocalStorageId="someTestId1">
          <Button>First Button</Button>
        </OnboardingTooltip>
        <OnboardingTooltip text={text2} widgetLocalStorageId="someTestId2">
          <Button>Second Button</Button>
        </OnboardingTooltip>
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

  test('renders only children if the widget has been hidden', () => {
    const widgetStorageId = 'alreadyHiddenId'
    local.setItem(widgetStorageId, true)
    const text = 'New feature available!'

    render(
      <OnboardingTooltip text={text} widgetLocalStorageId={widgetStorageId}>
        <Button>Testbutton</Button>
      </OnboardingTooltip>,
    )
    expect(screen.queryByText(new RegExp(text))).not.toBeInTheDocument()
    expect(screen.getByText(/Testbutton/)).toBeInTheDocument()
  })
})
