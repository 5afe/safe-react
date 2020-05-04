// @flow
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

import QRIcon from '~/assets/icons/qrcode.svg'
import ScanQRModal from '~/components/ScanQRModal'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import {
  composeValidators,
  mustBeEthereumAddress,
  mustBeEthereumContractAddress,
  required,
} from '~/components/forms/validator'
import Col from '~/components/layout/Col'
import Img from '~/components/layout/Img'
import Row from '~/components/layout/Row'
import { styles } from '~/routes/safe/components/Balances/SendModal/screens/ContractInteraction/style'

const useStyles = makeStyles(styles)

type Props = {
  isContract?: boolean,
  isRequired?: boolean,
  name: string,
  onScannedValue: () => void,
  text: string,
}

const EthAddressInput = ({ isContract = true, isRequired = true, name, onScannedValue, text }: Props) => {
  const classes = useStyles()
  const [qrModalOpen, setQrModalOpen] = React.useState<boolean>(false)
  const validatorsList = [isRequired && required, mustBeEthereumAddress, isContract && mustBeEthereumContractAddress]
  const validate = composeValidators(...validatorsList.filter((_) => _))

  const openQrModal = () => {
    setQrModalOpen(true)
  }

  const closeQrModal = () => {
    setQrModalOpen(false)
  }

  const handleScan = (value) => {
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
          <Img
            alt="Scan QR"
            className={classes.qrCodeBtn}
            height={20}
            onClick={openQrModal}
            role="button"
            src={QRIcon}
          />
        </Col>
      </Row>
      {qrModalOpen && <ScanQRModal isOpen={qrModalOpen} onClose={closeQrModal} onScan={handleScan} />}
    </>
  )
}

export default EthAddressInput
