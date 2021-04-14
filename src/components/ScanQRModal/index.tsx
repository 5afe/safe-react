import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import * as React from 'react'
import QrReader from 'react-qr-reader'

import { styles } from './style'
import { checkWebcam } from './utils'

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
  const [useWebcam, setUseWebcam] = useState<boolean | null>(null)
  const [fileUploadModalOpen, setFileUploadModalOpen] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const scannerRef: any = React.createRef()
  const openImageDialog = React.useCallback(() => {
    scannerRef.current.openImageDialog()
  }, [scannerRef])

  useEffect(() => {
    checkWebcam().then((isAvailable) => setUseWebcam(isAvailable))
  }, [])

  useEffect(() => {
    if (useWebcam === false && !fileUploadModalOpen && !error) {
      setFileUploadModalOpen(true)
      openImageDialog()
    }
  }, [useWebcam, openImageDialog, fileUploadModalOpen, setFileUploadModalOpen, error])

  // A timeout before unmounting to let the camera stop
  const unmountDelay = (callback: () => void) => {
    scannerRef.current?.stopCamera()
    setTimeout(callback, 300)
  }

  const onModalClose = () => {
    unmountDelay(() => onClose())
  }

  const onFileScannedResolve = (error: Error | null, successData: string | null) => {
    if (successData) {
      unmountDelay(() => onScan(successData))
    }
    if (error) {
      console.error('Error uploading file', error)
      setError(`The QR could not be read`)
    }
    if (!useWebcam) {
      setError(`The QR could not be read`)
    }

    setFileUploadModalOpen(false)
  }

  return (
    <Modal description="Receive Tokens Form" handleClose={onModalClose} open={isOpen} title="Receive Tokens">
      <Row align="center" className={classes.heading} grow>
        <Paragraph noMargin size="xl">
          Scan QR
        </Paragraph>
        <IconButton disableRipple onClick={onModalClose}>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />
      <Col className={classes.detailsContainer} layout="column" middle="xs">
        {error}
        {useWebcam === null ? (
          <Block className={classes.loaderContainer} justify="center">
            <CircularProgress />
          </Block>
        ) : (
          <QrReader
            legacyMode={!useWebcam}
            onError={(err: Error) => onFileScannedResolve(err, null)}
            onScan={(data: string) => onFileScannedResolve(null, data)}
            ref={scannerRef}
            style={{ width: '400px', height: '400px' }}
            facingMode="user"
          />
        )}
      </Col>
      <Hairline />
      <Row align="center" className={classes.buttonRow}>
        <Button className={classes.button} color="secondary" minWidth={154} onClick={onModalClose}>
          Close
        </Button>
        <Button
          className={classes.button}
          color="primary"
          minWidth={154}
          onClick={() => {
            setUseWebcam(false)
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
