import { ReactElement, useEffect, useState } from 'react'
import { Checkbox, FormControlLabel } from '@material-ui/core'
import { getLastTx } from 'src/logic/safe/store/actions/utils'
import Row from 'src/components/layout/Row'
import { extractSafeAddress } from 'src/routes/routes'

interface ExecuteCheckboxProps {
  onChange: (val: boolean) => unknown
}

const ExecuteCheckbox = ({ onChange }: ExecuteCheckboxProps): ReactElement | null => {
  const [isVisible, setVisible] = useState<boolean>(false)
  const safeAddress = extractSafeAddress()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(e.target.checked)
  }

  useEffect(() => {
    if (!safeAddress) return

    const checkLastTx = async () => {
      const lastTx = await getLastTx(safeAddress)
      setVisible(!lastTx || lastTx.isExecuted)
    }
    checkLastTx()
  }, [safeAddress, setVisible])

  return isVisible ? (
    <Row margin="md">
      <FormControlLabel
        control={<Checkbox defaultChecked color="primary" onChange={handleChange} />}
        label="Execute transaction"
        data-testid="execute-checkbox"
      />
    </Row>
  ) : null
}

export default ExecuteCheckbox
