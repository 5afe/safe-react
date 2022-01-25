import { ReactElement } from 'react'
import { Tooltip } from '@gnosis.pm/safe-react-components'
import { Checkbox, FormControlLabel } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { styles } from './style'
import Row from 'src/components/layout/Row'
import Img from 'src/components/layout/Img'
import InfoIcon from 'src/assets/icons/info.svg'

const useStyles = makeStyles(styles)

interface ExecuteCheckboxProps {
  onChange: (val: boolean) => unknown
}

const ExecuteCheckbox = ({ onChange }: ExecuteCheckboxProps): ReactElement => {
  const classes = useStyles()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(e.target.checked)
  }
  return (
    <Row style={{ alignItems: 'center' }}>
      <FormControlLabel
        classes={{ label: classes.label }}
        control={<Checkbox defaultChecked color="secondary" onChange={handleChange} />}
        label="Execute transaction"
        data-testid="execute-checkbox"
      />
      <Tooltip
        placement="top"
        title="If you want to sign the transaction now but manually execute it later, click on the checkbox."
      >
        <span>
          <Img alt="Info Tooltip" height={16} src={InfoIcon} />
        </span>
      </Tooltip>
    </Row>
  )
}

export default ExecuteCheckbox
