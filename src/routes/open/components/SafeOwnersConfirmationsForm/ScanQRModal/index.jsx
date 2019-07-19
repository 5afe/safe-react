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
import { lg, sm, background } from '~/theme/variables'
import { checkWebcam } from './utils'

const { useEffect, useState } = React

const styles = () => ({
  heading: {
    padding: `${sm} ${lg}`,
    justifyContent: 'space-between',
    maxHeight: '75px',
    boxSizing: 'border-box',
  },
  loaderContainer: {
    width: '100%',
    height: '100%',
  },
  manage: {
    fontSize: '24px',
  },
  close: {
    height: '35px',
    width: '35px',
  },
  detailsContainer: {
    backgroundColor: background,
    maxHeight: '420px',
  },
  buttonRow: {
    height: '84px',
    justifyContent: 'center',
  },
  button: {
    '&:last-child': {
      marginLeft: sm,
    }
  },
})

type Props = {
  onClose: () => void,
  classes: Object,
  isOpen: boolean,
}

const ScanQRModal = ({ classes, onClose, isOpen }: Props) => {
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
    if (hasWebcam === false) {
      openImageDialog()
    }
  }, [hasWebcam])

  return (
    <Modal title="Receive Tokens" description="Receive Tokens Form" handleClose={onClose} open={isOpen}>
      <Row align="center" grow className={classes.heading}>
        <Paragraph className={classes.manage} weight="bolder" noMargin>
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
              if (data) console.log(data)
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
        <Button color="secondary" className={classes.button} minHeight={42} minWidth={140} onClick={onClose} variant="contained">
          Close
        </Button>
        <Button
          color="primary"
          className={classes.button}
          minWidth={140}
          minHeight={42}
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
