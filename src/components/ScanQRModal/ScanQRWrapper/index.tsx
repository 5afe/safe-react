import { Icon } from '@gnosis.pm/safe-react-components'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

import ScanQRModal from 'src/components/ScanQRModal'

const useStyles = makeStyles({
  qrCodeBtn: {
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
  },
})

interface ScanQRWrapperProps {
  handleScan: (value: string, closeQRCallback: () => void) => void
}

export const ScanQRWrapper = ({ handleScan }: ScanQRWrapperProps): React.ReactElement => {
  const classes = useStyles()
  const [qrModalOpen, setQrModalOpen] = React.useState(false)

  const openQrModal = () => {
    setQrModalOpen(true)
  }

  const closeQrModal = () => {
    setQrModalOpen(false)
  }

  const onScanFinished = (value) => {
    handleScan(value, closeQrModal)
  }

  return (
    <>
      <button onClick={openQrModal} className={classes.qrCodeBtn} title="Scan QR" data-testid="qr-icon" type="button">
        <Icon type="qrCode" size="sm" />
      </button>
      {qrModalOpen && <ScanQRModal isOpen={qrModalOpen} onClose={closeQrModal} onScan={onScanFinished} />}
    </>
  )
}
