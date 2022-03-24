import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import * as gtm from 'src/utils/googleTagManager'
import Track from 'src/components/Track'

describe('Track', () => {
  it('renders the child', () => {
    render(
      <Track category="unit-test" action="Render child">
        <span>child</span>
      </Track>,
    )

    const child = screen.queryByText('child')

    expect(child).toBeInTheDocument()
  })

  it('wraps the child with a div that contains data-track attribute', () => {
    render(
      <Track category="unit-test" action="Render child">
        <span>child</span>
      </Track>,
    )

    const child = screen.queryByText('child')?.closest('div')

    expect(child).toHaveAttribute('data-track', 'unit-test: Render child')
  })

  it('tracks the event on click', async () => {
    const trackEventSpy = jest.spyOn(gtm, 'trackEvent').mockImplementation(jest.fn())

    render(
      <Track category="unit-test" action="Render child" label={true}>
        <span>child</span>
      </Track>,
    )

    const child = screen.queryByText('child')?.closest('div')

    if (!child) {
      // Fail test if child doesn't exist
      expect(true).toBe(false)
      return
    }

    fireEvent.click(child)

    await waitFor(() => {
      expect(trackEventSpy).toHaveBeenCalledWith({
        event: 'customClick',
        category: 'unit-test',
        action: 'Render child',
        label: true,
      })
    })
  })
})
