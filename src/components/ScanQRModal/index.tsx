import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
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

const { useEffect, useState } = React

const ScanQRModal = ({ classes, isOpen, onClose, onScan }) => {
  const [hasWebcam, setHasWebcam] = useState<any>(null)
  const scannerRef: any = React.createRef()
  const openImageDialog = React.useCallback(() => {
    scannerRef.current.openImageDialog()
  }, [scannerRef])

  useEffect(() => {
    checkWebcam(
      () => {
        setHasWebcam(true)
      },
      () => {
        setHasWebcam(false)
      },
    )
  }, [])

  useEffect(() => {
    // this fires only when the hasWebcam changes to false (null > false (user doesn't have webcam)
    // , true > false (user switched from webcam to file upload))
    // Doesn't fire on re-render
    if (hasWebcam === false) {
      openImageDialog()
    }
  }, [hasWebcam, openImageDialog])

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
        {hasWebcam === null ? (
          <Block className={classes.loaderContainer} justify="center">
            <CircularProgress />
          </Block>
        ) : (
          <QrReader
            legacyMode={!hasWebcam}
            onError={(err) => {
              console.error(err)
            }}
            onScan={(data) => {
              if (data) onScan(data)
            }}
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
            if (hasWebcam) {
              setHasWebcam(false)
            } else {
              openImageDialog()
            }
          }}
          variant="contained"
        >
          Upload an image
        </Button>
      </Row>
    </Modal>
  )
}

export default withStyles(styles as any)(ScanQRModal)
