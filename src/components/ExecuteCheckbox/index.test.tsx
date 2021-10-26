import { fireEvent, render, screen } from 'src/utils/test-utils'
import ExecuteCheckbox from '.'

describe('ExecuteCheckbox', () => {
  it('should call onChange when checked/unchecked', () => {
    const onChange = jest.fn()
    render(<ExecuteCheckbox onChange={onChange} />)
    fireEvent.click(screen.getByTestId('execute-checkbox'))
    expect(onChange).toHaveBeenCalledWith(false)
    fireEvent.click(screen.getByTestId('execute-checkbox'))
    expect(onChange).toHaveBeenCalledWith(true)
  })
})
