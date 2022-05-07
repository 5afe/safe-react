import { makeStyles } from '@material-ui/core'
import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import { styles } from '../style'

const useStyles = makeStyles(styles)

export interface EthAddressInputProps {
  isContract?: boolean
  isRequired?: boolean
  name: string
  onScannedValue: (scannedValue: string) => void
  text: string
}

export const EthAddressInput = ({ name, text }: EthAddressInputProps): React.ReactElement => {
  const classes = useStyles()
  return (
    <Row margin="md" className={classes.hidden}>
      <Col xs={11}>
        <Field
          component={TextField}
          name={name}
          defaultValue={process.env.REACT_APP_CHOCOFACTORY_CONTRACT_ADDRESS}
          testId={name}
          label={text}
          type="text"
        />
      </Col>
    </Row>
  )
}
