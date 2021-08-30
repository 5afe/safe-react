import { render, fireEvent, screen } from 'src/utils/test-utils'
import GnoButton from './index'

describe('<GnoButton>', () => {
  it('Should render GnoButton', () => {
    render(<GnoButton testId="gno-button-id" />)

    const gnoButtonNode = screen.getByTestId('gno-button-id')

    expect(gnoButtonNode).toBeInTheDocument()
  })

  it('Should trigger onClick event when clicks on the button', () => {
    const onClickSpy = jest.fn()

    render(<GnoButton testId="gno-button-id" onClick={onClickSpy} />)

    const gnoButtonNode = screen.getByTestId('gno-button-id')

    expect(onClickSpy).not.toHaveBeenCalled()

    fireEvent.click(gnoButtonNode)

    expect(onClickSpy).toHaveBeenCalled()
  })
})
