//
import { makeStyles } from '@material-ui/core/styles'
import { useState } from 'react'
import * as React from 'react'

import QRIcon from 'assets/icons/qrcode.svg'
import ScanQRModal from 'components/ScanQRModal'
import Img from 'components/layout/Img'

const useStyles = makeStyles({
  qrCodeBtn: {
    cursor: 'pointer',
  },
})

export const ScanQRWrapper = (props) => {
  const classes = useStyles()
  const [qrModalOpen, setQrModalOpen] = useState(false)

  const openQrModal = () => {
    setQrModalOpen(true)
  }

  const closeQrModal = () => {
    setQrModalOpen(false)
  }

  const onScanFinished = (value) => {
    props.handleScan(value, closeQrModal)
  }

  return (
    <>
      <Img
        alt="Scan QR"
        className={classes.qrCodeBtn}
        height={20}
        onClick={() => {
          openQrModal()
        }}
        role="button"
        src={QRIcon}
      />
      {qrModalOpen && <ScanQRModal isOpen={qrModalOpen} onClose={closeQrModal} onScan={onScanFinished} />}
    </>
  )
}
