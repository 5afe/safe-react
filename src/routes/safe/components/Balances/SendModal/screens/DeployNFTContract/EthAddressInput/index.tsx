import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'

export interface EthAddressInputProps {
  isContract?: boolean
  isRequired?: boolean
  name: string
  onScannedValue: (scannedValue: string) => void
  text: string
}

export const EthAddressInput = ({ name, text }: EthAddressInputProps): React.ReactElement => {
  return (
    <Row margin="md">
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
