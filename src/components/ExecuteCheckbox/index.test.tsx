import { fireEvent, render, screen, waitFor, act } from 'src/utils/test-utils'
import ExecuteCheckbox from '.'

jest.mock('src/logic/safe/store/actions/utils', () => {
  const originalModule = jest.requireActual('src/logic/safe/store/actions/utils')

  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    getLastTx: jest.fn(() => Promise.resolve({ isExecuted: true })),
  }
})

describe('ExecuteCheckbox', () => {
  it('should call onChange when checked/unchecked', async () => {
    const onChange = jest.fn()

    await act(async () => {
      render(<ExecuteCheckbox onChange={onChange} />)
    })

    await waitFor(() => {
      expect(screen.getByTestId('execute-checkbox')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByTestId('execute-checkbox'))
    expect(onChange).toHaveBeenCalledWith(false)

    fireEvent.click(screen.getByTestId('execute-checkbox'))
    expect(onChange).toHaveBeenCalledWith(true)
  })
})
