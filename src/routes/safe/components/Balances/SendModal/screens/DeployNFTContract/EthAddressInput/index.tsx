import { useState } from 'react'
import { useFormState, useField } from 'react-final-form'

import { ContractsAddressBookInput } from 'src/routes/safe/components/Balances/SendModal/screens/AddressBookInput'
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

export const EthAddressInput = ({ name, onScannedValue, text }: EthAddressInputProps): React.ReactElement => {
  const { pristine } = useFormState({ subscription: { pristine: true } })
  const {
    input: { value },
  } = useField('contractAddress', { subscription: { value: true } })
  const [selectedEntry, setSelectedEntry] = useState<{ address?: string; name?: string | null } | null>({
    address: value,
    name: '',
  })

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target
    setSelectedEntry({ address: value })
  }

  return (
    <Row margin="md">
      <Col xs={11}>
        {selectedEntry?.address ? (
          <Field
            component={TextField}
            name={name}
            placeholder={text}
            onChange={handleInputChange}
            testId={name}
            label={text}
            type="text"
          />
        ) : (
          <ContractsAddressBookInput
            setSelectedEntry={setSelectedEntry}
            setIsValidAddress={() => {}}
            fieldMutator={onScannedValue}
            pristine={pristine}
            label="Contract address"
          />
        )}
      </Col>
    </Row>
  )
}
