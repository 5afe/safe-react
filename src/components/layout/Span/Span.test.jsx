import { render, screen } from 'src/utils/test-utils'
import Span from './index'

describe('<Span>', () => {
  it('Should render Span and his content', () => {
    render(<Span>{'Test Text placeholder'}</Span>)

    const spanNode = screen.getByText('Test Text placeholder')

    expect(spanNode).toBeInTheDocument()
  })
})
