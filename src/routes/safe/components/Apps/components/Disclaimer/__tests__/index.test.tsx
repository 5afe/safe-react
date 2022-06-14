import React from 'react'
import { render, fireEvent, screen } from 'src/utils/test-utils'
import SafeAppsDisclaimer from '../index'

describe('<SafeAppsDisclaimer />', () => {
  const baseProps = {
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
    isExtendedListReviewed: false,
    isFirstTimeAccessingApp: false,
    isSafeAppInDefaultList: true,
    isConsentAccepted: true,
  }

  it('Should show the consents disclaimer if not previously accepted', () => {
    render(<SafeAppsDisclaimer {...baseProps} isConsentAccepted={false} />)

    expect(
      screen.getAllByRole('heading', {
        name: /disclaimer/i,
      }).length,
    ).toBeGreaterThan(0)
  })
})
