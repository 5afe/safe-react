import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import * as React from 'react'
import QrReader from 'react-qr-reader'

import { styles } from './style'

import Modal from 'src/components/Modal'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { useEffect, useState } from 'react'

const useStyles = makeStyles(styles)

type Props = {
  isOpen: boolean
  onClose: () => void
  onScan: (value: string) => void
}

export const ScanQRModal = ({ isOpen, onClose, onScan }: Props): React.ReactElement => {
  const classes = useStyles()
  const [fileUploadModalOpen, setFileUploadModalOpen] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [cameraBlocked, setCameraBlocked] = useState<boolean>(false)
  const scannerRef: any = React.createRef()
  const openImageDialog = React.useCallback(() => {
    scannerRef.current.openImageDialog()
  }, [scannerRef])

  useEffect(() => {
    if (!fileUploadModalOpen && cameraBlocked && !error) {
      setFileUploadModalOpen(true)
      openImageDialog()
    }
  }, [cameraBlocked, openImageDialog, fileUploadModalOpen, setFileUploadModalOpen, error])

  const onFileScannedResolve = (error: Error | null, successData: string | null) => {
    if (error) {
      console.error('QR code error', error)

      if (error.name === 'NotAllowedError' || error.name === 'PermissionDismissedError') {
        setCameraBlocked(true)
        setFileUploadModalOpen(false)
      } else {
        setError('The QR could not be read')
      }
      return
    }

    if (successData) {
      onScan(successData)
    } else if (cameraBlocked) {
      setError('The QR could not be read')
    }
  }

  return (
    <Modal description="Receive Tokens Form" handleClose={onClose} open={isOpen} title="Receive Tokens">
      <Row align="center" className={classes.heading} grow>
        <Paragraph noMargin size="xl">
          Scan QR
        </Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />
      <Col className={classes.detailsContainer} layout="column" middle="xs">
        {error && (
          <Block padding="md" margin="md">
            {error}
          </Block>
        )}
        <QrReader
          legacyMode={cameraBlocked}
          onError={(err: Error) => onFileScannedResolve(err, null)}
          onScan={(data: string) => onFileScannedResolve(null, data)}
          ref={scannerRef}
          style={{ width: '400px', height: '400px' }}
          facingMode="user"
        />
      </Col>
      <Hairline />
      <Row align="center" className={classes.buttonRow}>
        <Button className={classes.button} color="secondary" minWidth={154} onClick={onClose}>
          Close
        </Button>
        <Button
          className={classes.button}
          color="primary"
          minWidth={154}
          onClick={() => {
            setCameraBlocked(true)
            setError(null)
            setFileUploadModalOpen(false)
          }}
          variant="contained"
        >
          Upload an image
        </Button>
      </Row>
    </Modal>
  )
}
