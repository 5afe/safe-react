import { makeStyles } from '@material-ui/core/styles'
import React, { ReactElement, useState } from 'react'

import QRIcon from 'src/assets/icons/qrcode.svg'
import { ScanQRModal } from 'src/components/ScanQRModal'
import Img from 'src/components/layout/Img'

const useStyles = makeStyles({
  qrCodeBtn: {
    cursor: 'pointer',
  },
})

type Props = {
  handleScan: (dataResult: string, closeQrModal: () => void) => void
}

export const ScanQRWrapper = ({ handleScan }: Props): ReactElement => {
  const classes = useStyles()
  const [qrModalOpen, setQrModalOpen] = useState(false)

  const openQrModal = () => {
    setQrModalOpen(true)
  }

  const closeQrModal = () => {
    setQrModalOpen(false)
  }

  const onScanFinished = (value: string) => {
    handleScan(value, closeQrModal)
  }

  return (
    <>
      <Img
        alt="Scan QR"
        className={classes.qrCodeBtn}
        height={20}
        onClick={() => openQrModal()}
        role="button"
        src={QRIcon}
        testId="qr-icon"
      />
      {qrModalOpen && <ScanQRModal isOpen={qrModalOpen} onClose={closeQrModal} onScan={onScanFinished} />}
    </>
  )
}
