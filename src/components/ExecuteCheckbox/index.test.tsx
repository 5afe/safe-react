import { useState } from 'react'
import { fireEvent, render, screen, waitFor, act } from 'src/utils/test-utils'
import { history } from 'src/routes/routes'
import ExecuteCheckbox from '.'

describe('ExecuteCheckbox', () => {
  it('should call onChange when checked/unchecked', async () => {
    const onChange = jest.fn()
    history.push('/rin:0xb3b83bf204C458B461de9B0CD2739DB152b4fa5A/balances')

    const ControlledInputWrapper = () => {
      const [checked, setChecked] = useState<boolean>(true)
      return (
        <ExecuteCheckbox
          checked={checked}
          onChange={(value) => {
            setChecked(value)
            onChange(value)
          }}
        />
      )
    }
    await act(async () => {
      render(<ControlledInputWrapper />)
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
