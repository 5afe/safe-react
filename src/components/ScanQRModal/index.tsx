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
  const scannerRef: any = React.createRef()
  const openImageDialog = React.useCallback(() => {
    scannerRef.current.openImageDialog()
  }, [scannerRef])

  useEffect(() => {
    checkWebcam(
      () => {
        setUseWebcam(true)
      },
      () => {
        setUseWebcam(false)
      },
    )
  }, [])

  useEffect(() => {
    if (useWebcam === false && !fileUploadModalOpen) {
      setFileUploadModalOpen(true)
      openImageDialog()
    }
  }, [useWebcam, openImageDialog, fileUploadModalOpen, setFileUploadModalOpen])

  const onFileUploadHandlerClose = (error, successData) => {
    if (successData) {
      onScan(successData)
    }
    if (error) {
      console.error('Error uploading file', error)
    }
    setFileUploadModalOpen(false)
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
        {useWebcam === null ? (
          <Block className={classes.loaderContainer} justify="center">
            <CircularProgress />
          </Block>
        ) : (
          <QrReader
            legacyMode={!useWebcam}
            onError={(err) => onFileUploadHandlerClose(err, null)}
            onScan={(data) => onFileUploadHandlerClose(null, data)}
            ref={scannerRef}
            style={{ width: '400px', height: '400px' }}
          />
        )}
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
            setUseWebcam(false)
          }}
          variant="contained"
        >
          Upload an image
        </Button>
      </Row>
    </Modal>
  )
}
