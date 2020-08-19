import { Button, Icon } from '@gnosis.pm/safe-react-components'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

import ScanQRModal from 'src/components/ScanQRModal'

const useStyles = makeStyles({
  qrCodeBtn: {
    cursor: 'pointer',
    border: 'none',
    padding: '0 !important',
    minWidth: '40px',
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
      <Button
        size="md"
        color="secondary"
        title="Scan QR"
        type="button"
        onClick={openQrModal}
        className={classes.qrCodeBtn}
      >
        <Icon type="qrCode" size="sm" />
      </Button>
      {qrModalOpen && <ScanQRModal isOpen={qrModalOpen} onClose={closeQrModal} onScan={onScanFinished} />}
    </>
  )
}
