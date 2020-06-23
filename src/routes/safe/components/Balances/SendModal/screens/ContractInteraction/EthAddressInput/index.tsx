import { makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'

import { ScanQRWrapper } from 'src/components/ScanQRModal/ScanQRWrapper'
import AddressBookInput from 'src/routes/safe/components/Balances/SendModal/screens/AddressBookInput'
import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'
import {
  composeValidators,
  mustBeEthereumAddress,
  mustBeEthereumContractAddress,
  required,
} from 'src/components/forms/validator'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import { styles } from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/style'

const useStyles = makeStyles(styles)

export interface EthAddressProps {
  isContract?: boolean
  isRequired?: boolean
  name: string
  onScannedValue: (scannedValue: string) => void
  text: string
  value?: string
  pristine: boolean
}

const EthAddressInput = ({
  isContract = true,
  isRequired = true,
  name,
  onScannedValue,
  text,
  value,
  pristine,
}: EthAddressProps) => {
  const classes = useStyles()
  const validatorsList = [isRequired && required, mustBeEthereumAddress, isContract && mustBeEthereumContractAddress]
  const validate = composeValidators(...validatorsList.filter((_) => _))
  const [selectedEntry, setSelectedEntry] = useState<{ address?: string; name?: string } | null>({
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

  return (
    <>
      <Row margin="md">
        <Col xs={11}>
          {selectedEntry && selectedEntry.address ? (
            <Field
              component={TextField}
              name={name}
              placeholder={text}
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
