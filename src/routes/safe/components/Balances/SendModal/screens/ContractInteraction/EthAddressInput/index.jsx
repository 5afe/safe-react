//
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

import { ScanQRWrapper } from 'components/ScanQRModal/ScanQRWrapper'
import Field from 'components/forms/Field'
import TextField from 'components/forms/TextField'
import {
  composeValidators,
  mustBeEthereumAddress,
  mustBeEthereumContractAddress,
  required,
} from 'components/forms/validator'
import Col from 'components/layout/Col'
import Row from 'components/layout/Row'
import { styles } from 'routes/safe/components/Balances/SendModal/screens/ContractInteraction/style'

const useStyles = makeStyles(styles)

const EthAddressInput = ({ isContract = true, isRequired = true, name, onScannedValue, text }) => {
  const classes = useStyles()
  const validatorsList = [isRequired && required, mustBeEthereumAddress, isContract && mustBeEthereumContractAddress]
  const validate = composeValidators(...validatorsList.filter((_) => _))

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
          <Field
            component={TextField}
            name={name}
            placeholder={text}
            testId={name}
            text={text}
            type="text"
            validate={validate}
          />
        </Col>
        <Col center="xs" className={classes} middle="xs" xs={1}>
          <ScanQRWrapper handleScan={handleScan} />
        </Col>
      </Row>
    </>
  )
}

export default EthAddressInput
