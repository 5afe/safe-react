// 
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import * as React from 'react'
import QrReader from 'react-qr-reader'

import { styles } from './style'
import { checkWebcam } from './utils'

import Modal from '~/components/Modal'
import Block from '~/components/layout/Block'
import Button from '~/components/layout/Button'
import Col from '~/components/layout/Col'
import Hairline from '~/components/layout/Hairline'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'

const { useEffect, useState } = React


const ScanQRModal = ({ classes, isOpen, onClose, onScan }) => {
  const [hasWebcam, setHasWebcam] = useState(null)
  const scannerRef = React.createRef()
  const openImageDialog = () => {
    scannerRef.current.openImageDialog()
  }

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
  }, [hasWebcam])

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

export default withStyles(styles)(ScanQRModal)
