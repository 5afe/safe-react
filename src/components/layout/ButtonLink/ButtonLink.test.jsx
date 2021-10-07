import { render, screen } from 'src/utils/test-utils'
import GnoButtonLink from './index'

describe('<GnoButtonLink>', () => {
  it('Should render GnoButtonLink', () => {
    render(<GnoButtonLink testId="gno-button-link-id" />)

    const gnoButtonLinkNode = screen.getByTestId('gno-button-link-id')

    expect(gnoButtonLinkNode).toBeInTheDocument()
  })
})
