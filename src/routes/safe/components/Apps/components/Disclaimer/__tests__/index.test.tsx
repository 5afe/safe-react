import React from 'react'
import { render, fireEvent, screen } from 'src/utils/test-utils'
import SafeAppsDisclaimer from '../index'

describe('<SafeAppsDisclaimer />', () => {
  const baseProps = {
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
    appUrl: 'https://safe-app.test.eth',
    isExtendedListReviewed: false,
    isFirstTimeAccessingApp: false,
    isSafeAppInDefaultList: true,
    isConsentAccepted: true,
    isWarningHidden: false,
  }

  it('should show the Legal Disclaimer if not previously accepted', () => {
    render(<SafeAppsDisclaimer {...baseProps} isConsentAccepted={false} />)

    expect(
      screen.getAllByRole('heading', {
        name: /disclaimer/i,
      }).length,
    ).toBeGreaterThan(0)
  })

  it('should not show the Legal Disclaimer if it was previously accepted', () => {
    render(<SafeAppsDisclaimer {...baseProps} isConsentAccepted={true} />)

    expect(screen.queryByText(/disclaimer/i)).not.toBeInTheDocument()
  })

  it('should show the Extended List when not reviewed', () => {
    render(<SafeAppsDisclaimer {...baseProps} isFirstTimeAccessingApp={true} isExtendedListReviewed={false} />)

    expect(screen.queryByText('1')).not.toBeInTheDocument()
  })

  it('should avoid to show the Extended List when already reviewed', () => {
    render(<SafeAppsDisclaimer {...baseProps} isFirstTimeAccessingApp={true} isExtendedListReviewed={true} />)

    expect(screen.queryAllByText('1').length).toEqual(2)
  })

  it('should show a warning when the application is not in the default list', () => {
    render(<SafeAppsDisclaimer {...baseProps} isSafeAppInDefaultList={false} />)

    expect(screen.queryAllByText(/warning/i).length).toEqual(4)
  })

  it('should call onConfirm() after the slides are reviewed', () => {
    render(<SafeAppsDisclaimer {...baseProps} isFirstTimeAccessingApp={true} isExtendedListReviewed={false} />)
    const continueBtn = screen.getByText(/continue/i)

    for (let i = 0; i < 4; i++) {
      fireEvent.click(continueBtn)
    }

    expect(baseProps.onConfirm).toHaveBeenCalledTimes(1)
  })

  it('should iterate back and forward over the slides', () => {
    render(<SafeAppsDisclaimer {...baseProps} isFirstTimeAccessingApp={true} isExtendedListReviewed={false} />)
    const continueBtn = screen.getByText(/continue/i)

    fireEvent.click(continueBtn)
    fireEvent.click(continueBtn)
    fireEvent.click(continueBtn)
    fireEvent.click(screen.getByText(/back/i))
    fireEvent.click(continueBtn)
    fireEvent.click(screen.getByText(/back/i))
    fireEvent.click(continueBtn)
    fireEvent.click(continueBtn)

    expect(baseProps.onConfirm).toHaveBeenCalledTimes(1)
  })

  it('should call onCancel() when clicking the Cancel button', () => {
    render(<SafeAppsDisclaimer {...baseProps} isFirstTimeAccessingApp={true} isExtendedListReviewed={false} />)

    fireEvent.click(screen.getByText(/cancel/i))

    expect(baseProps.onCancel).toHaveBeenCalledTimes(1)
  })
})
