import { makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import { useFormState, useField } from 'react-final-form'

import { ScanQRWrapper } from 'src/components/ScanQRModal/ScanQRWrapper'
import AddressBookInput from 'src/routes/safe/components/Balances/SendModal/screens/AddressBookInput'
import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'
import {
  composeValidators,
  mustBeEthereumAddress,
  mustBeEthereumContractAddress,
  required,
  Validator,
} from 'src/components/forms/validator'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import { styles } from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/style'

const useStyles = makeStyles(styles)

export interface EthAddressInputProps {
  isContract?: boolean
  isRequired?: boolean
  name: string
  onScannedValue: (scannedValue: string) => void
  text: string
}

const EthAddressInput = ({
  isContract = true,
  isRequired = true,
  name,
  onScannedValue,
  text,
}: EthAddressInputProps): React.ReactElement => {
  const classes = useStyles()
  const validatorsList = [
    isRequired && required,
    mustBeEthereumAddress,
    isContract && mustBeEthereumContractAddress,
  ] as Validator[]
  const validate = composeValidators(...validatorsList.filter((validator) => validator))
  const { pristine } = useFormState({ subscription: { pristine: true } })
  const {
    input: { value },
  } = useField('contractAddress', { subscription: { value: true } })
  const [selectedEntry, setSelectedEntry] = useState<{ address?: string; name?: string | null } | null>({
    address: value,
    name: '',
  })

  const handleScan = (value, closeQrModal) => {
    let scannedAddress = value

    if (scannedAddress.startsWith('ethereum:')) {
      scannedAddress = scannedAddress.replace('ethereum:', '')
    }

    onScannedValue(scannedAddress)
    closeQrModal()
  }

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target
    setSelectedEntry({ address: value })
  }

  return (
    <>
      <Row margin="md">
        <Col xs={11}>
          {selectedEntry?.address ? (
            <Field
              component={TextField}
              name={name}
              placeholder={text}
              onChange={handleInputChange}
              testId={name}
              text={text}
              type="text"
              validate={validate}
            />
          ) : (
            <AddressBookInput
              setSelectedEntry={setSelectedEntry}
              setIsValidAddress={() => {}}
              fieldMutator={onScannedValue}
              isCustomTx
              pristine={pristine}
            />
          )}
        </Col>
        <Col center="xs" className={classes} middle="xs" xs={1}>
          <ScanQRWrapper handleScan={handleScan} />
        </Col>
      </Row>
    </>
  )
}

export default EthAddressInput
