import { render, fireEvent, screen, act } from 'src/utils/test-utils'
import SecurityFeedbackModal from '../index'

const pauseForSeconds = async (ms: number) => await new Promise((_) => setTimeout(_, ms))

describe('<SecurityFeedbackModal />', () => {
  const baseProps = {
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
    appUrl: 'https://safe-app.test.eth',
    isExtendedListReviewed: false,
    isFirstTimeAccessingApp: false,
    isSafeAppInDefaultList: true,
    isConsentAccepted: true,
  }

  it('should show the Legal Disclaimer if not previously accepted', () => {
    render(<SecurityFeedbackModal {...baseProps} isConsentAccepted={false} />)

    expect(
      screen.getAllByRole('heading', {
        name: /disclaimer/i,
      }).length,
    ).toBeGreaterThan(0)
  })

  it('should not show the Legal Disclaimer if it was previously accepted', () => {
    render(<SecurityFeedbackModal {...baseProps} isConsentAccepted />)

    expect(screen.queryByText(/disclaimer/i)).not.toBeInTheDocument()
  })

  it('should show the Extended List when not reviewed', () => {
    render(<SecurityFeedbackModal {...baseProps} isFirstTimeAccessingApp isExtendedListReviewed={false} />)

    expect(screen.queryByText('1')).not.toBeInTheDocument()
  })

  it('should avoid to show the Extended List when already reviewed', () => {
    render(<SecurityFeedbackModal {...baseProps} isFirstTimeAccessingApp isExtendedListReviewed />)

    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('should show a warning when the application is not in the default list', () => {
    render(<SecurityFeedbackModal {...baseProps} isSafeAppInDefaultList={false} isFirstTimeAccessingApp />)

    expect(screen.queryAllByText(/warning/i).length).toEqual(2)
  })

  it('should call onConfirm() after the slides are reviewed', async () => {
    render(<SecurityFeedbackModal {...baseProps} isFirstTimeAccessingApp isExtendedListReviewed={false} />)
    const continueBtn = screen.getByText(/continue/i)

    await act(async () => {
      for (let i = 0; i < 4; i++) {
        fireEvent.click(continueBtn)
        await pauseForSeconds(550)
      }
    })

    expect(baseProps.onConfirm).toHaveBeenCalledTimes(1)
  })

  it('should iterate back and forward over the slides', async () => {
    render(<SecurityFeedbackModal {...baseProps} isFirstTimeAccessingApp isExtendedListReviewed={false} />)
    const continueBtn = screen.getByText(/continue/i)

    await act(async () => {
      fireEvent.click(continueBtn)
      await pauseForSeconds(550)
      fireEvent.click(continueBtn)
      await pauseForSeconds(550)
      fireEvent.click(continueBtn)
      await pauseForSeconds(550)
      fireEvent.click(screen.getByText(/back/i))
      await pauseForSeconds(550)
      fireEvent.click(continueBtn)
      await pauseForSeconds(550)
      fireEvent.click(screen.getByText(/back/i))
      await pauseForSeconds(550)
      fireEvent.click(continueBtn)
      await pauseForSeconds(550)
      fireEvent.click(continueBtn)
    })

    expect(baseProps.onConfirm).toHaveBeenCalledTimes(1)
  })

  it('should call onCancel() when clicking the Cancel button', () => {
    render(<SecurityFeedbackModal {...baseProps} isFirstTimeAccessingApp isExtendedListReviewed={false} />)

    fireEvent.click(screen.getByText(/cancel/i))

    expect(baseProps.onCancel).toHaveBeenCalledTimes(1)
  })
})
