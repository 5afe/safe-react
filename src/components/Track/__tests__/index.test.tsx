import { render, screen } from '@testing-library/react'

import Track from 'src/components/Track'

describe('Track', () => {
  it('renders the child', () => {
    render(
      <Track id="test" desc="test">
        <span>test child1</span>
      </Track>,
    )

    const child = screen.queryByText('test child1')

    expect(child).toBeInTheDocument()
  })

  it('adds the id and stringified payload to child', () => {
    render(
      <Track id="test" desc="test" payload={{ test: true }}>
        <span>test child2</span>
      </Track>,
    )

    const child = screen.queryByText('test child2')

    expect(child).toHaveAttribute('data-track-id', 'test')
    expect(child).toHaveAttribute('data-track-desc', 'test')
    expect(child).toHaveAttribute('data-track-chain', '{"chainId":"4","shortName":"rin"}')
    expect(child).toHaveAttribute('data-track-payload', '{"test":true}')
  })

  it('does not add the payload if it is undefined', () => {
    render(
      <Track id="test" desc="test" payload={undefined}>
        <span>test child3</span>
      </Track>,
    )

    const child = screen.queryByText('test child3')

    expect(child).not.toHaveAttribute('data-track-payload')
  })

  it('throws when attempting to track a fragment', () => {
    expect(() =>
      render(
        <Track id="test" desc="test">
          <></>
        </Track>,
      ),
    ).toThrow('Fragments cannot be tracked.')
  })
})
