import { InvalidMasterCopyError } from './'
import { render, waitFor, fireEvent } from 'src/utils/test-utils'
import * as safeVersion from 'src/logic/safe/utils/safeVersion'
import * as useAsync from 'src/logic/hooks/useAsync'

describe('InvalidMasterCopyError', () => {
  it('returns null if valid master copy', async () => {
    jest.spyOn(safeVersion, 'isValidMasterCopy')
    jest.spyOn(useAsync, 'default').mockImplementationOnce(() => [true, undefined, false])

    const { container } = render(<InvalidMasterCopyError />)

    await waitFor(() => {
      expect(container.firstChild).toBeNull()
    })
  })

  it('returns null if error', async () => {
    jest.spyOn(safeVersion, 'isValidMasterCopy')
    jest.spyOn(useAsync, 'default').mockImplementationOnce(() => [undefined, new Error(), false])

    const { container } = render(<InvalidMasterCopyError />)

    await waitFor(() => {
      expect(container.firstChild).toBeNull()
    })
  })

  it('displays an error message if not a valid master copy', async () => {
    jest.spyOn(safeVersion, 'isValidMasterCopy')
    jest.spyOn(useAsync, 'default').mockImplementationOnce(() => [false, undefined, false])

    const { getByText } = render(<InvalidMasterCopyError />)

    await waitFor(() => {
      expect(getByText(/This Safe was created with an unsupported base contract/)).toBeInTheDocument()
    })
  })

  it('hides the error message on close', async () => {
    jest.spyOn(safeVersion, 'isValidMasterCopy')
    jest.spyOn(useAsync, 'default').mockImplementation(() => [false, undefined, false])

    const { getByText, queryByText, getByRole } = render(<InvalidMasterCopyError />)

    await waitFor(() => {
      expect(getByText(/This Safe was created with an unsupported base contract/)).toBeInTheDocument()
    })

    fireEvent.click(getByRole('button'))

    await waitFor(() => {
      expect(queryByText(/This Safe was created with an unsupported base contract/)).not.toBeInTheDocument()
    })
  })
})
