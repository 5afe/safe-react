// @flow
import * as React from 'react'
import QrReader from 'react-qr-reader'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import CircularProgress from '@material-ui/core/CircularProgress'
import Paragraph from '~/components/layout/Paragraph'
import Button from '~/components/layout/Button'
import Block from '~/components/layout/Block'
import Row from '~/components/layout/Row'
import Hairline from '~/components/layout/Hairline'
import Col from '~/components/layout/Col'
import Modal from '~/components/Modal'
import { checkWebcam } from './utils'
import { styles } from './style'

const { useEffect, useState } = React

type Props = {
  onClose: () => void,
  classes: Object,
  onScan: Function,
  isOpen: boolean,
}

const ScanQRModal = ({
  classes, onClose, isOpen, onScan,
}: Props) => {
  const [hasWebcam, setHasWebcam] = useState(null)
  const scannerRef: Object = React.createRef()
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
    <Modal title="Receive Tokens" description="Receive Tokens Form" handleClose={onClose} open={isOpen}>
      <Row align="center" grow className={classes.heading}>
        <Paragraph size="xl" noMargin>
          Scan QR
        </Paragraph>
        <IconButton onClick={onClose} disableRipple>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />
      <Col layout="column" middle="xs" className={classes.detailsContainer}>
        {hasWebcam === null ? (
          <Block align="center" className={classes.loaderContainer}>
            <CircularProgress />
          </Block>
        ) : (
          <QrReader
            ref={scannerRef}
            legacyMode={!hasWebcam}
            onScan={(data) => {
              if (data) onScan(data)
            }}
            onError={(err) => {
              console.error(err)
            }}
            style={{ width: '400px', height: '400px' }}
          />
        )}
      </Col>
      <Hairline />
      <Row align="center" className={classes.buttonRow}>
        <Button
          color="secondary"
          className={classes.button}
          minWidth={154}
          onClick={onClose}
        >
          Close
        </Button>
        <Button
          color="primary"
          className={classes.button}
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
