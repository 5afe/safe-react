import React, { ReactElement, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CSVDownloader, jsonToCSV } from 'react-papaparse'
import styled from 'styled-components'

import { enhanceSnackbarForAction, getNotificationsFromTxType } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'

import { Button, Loader } from '@gnosis.pm/safe-react-components'
import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'
import { addressBookSelector } from 'src/logic/addressBook/store/selectors'

import { useStyles } from './style'

import Modal from 'src/components/Modal'
import Block from 'src/components/layout/Block'
import Hairline from 'src/components/layout/Hairline'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'

import SuccessSvg from './assets/success.svg'
import ErrorSvg from './assets/error.svg'
import LoadingSvg from './assets/wait.svg'

type ExportEntriesModalProps = {
  isOpen: boolean
  onClose: () => void
}

const BodyImage = styled.div`
  grid-row: 1;
`

export const ExportEntriesModal = ({ isOpen, onClose }: ExportEntriesModalProps): ReactElement => {
  const classes = useStyles()
  const addressBook = useSelector(addressBookSelector)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | undefined>('')
  const [csvData, setCsvData] = useState<string>('')
  const [doRetry, setDoRetry] = useState<boolean>(false)

  const handleClose = () => {
    const notification = getNotificationsFromTxType(TX_NOTIFICATION_TYPES.ADDRESSBOOK_EXPORT_ENTRIES)
    if (!loading && !error) {
      dispatch(enqueueSnackbar(enhanceSnackbarForAction(notification.afterExecution.noMoreConfirmationsNeeded)))
    } else if (error) {
      dispatch(enqueueSnackbar(enhanceSnackbarForAction(notification.afterExecution.afterExecutionError)))
    }
    onClose()
  }

  const getImage = () => {
    if (error) {
      return ErrorSvg
    }

    if (loading) {
      return LoadingSvg
    }

    return SuccessSvg
  }

  useEffect(() => {
    const handleCsvData = () => {
      setLoading(true)
      setError(undefined)
      try {
        setCsvData(jsonToCSV(addressBook))
        setLoading(false)
        setDoRetry(false)
      } catch (e) {
        setError(e)
      }
    }
    if (isOpen || doRetry) {
      handleCsvData()
    }
  }, [addressBook, isOpen, doRetry])

  return (
    <Modal
      description="Export address book"
      handleClose={handleClose}
      open={isOpen}
      paperClassName="smaller-modal-window"
      title="Export address book"
    >
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight="bolder">
          Export address book
        </Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />
      <Block>
        <Row className={classes.imageContainer} align="center">
          <BodyImage>
            <Img alt="Export" height={92} src={getImage()} />
          </BodyImage>
        </Row>
        <Row align="center" className={classes.info}>
          <Paragraph color="primary" noMargin size="lg">
            {!error ? (
              <span>
                You&apos;re about to export a CSV file with your{' '}
                <strong>{addressBook.length} Address Book entries</strong>
                &nbsp;(only addresses and names).
              </span>
            ) : (
              <span>An error occurred while generating the address book CSV.</span>
            )}
          </Paragraph>
        </Row>
      </Block>
      <Row align="center" className={classes.buttonRow}>
        <Button size="md" variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button color="primary" size="md" disabled={loading} onClick={error ? () => setDoRetry(true) : handleClose}>
          {!error ? (
            <CSVDownloader className={classes.downloader} data={csvData} bom={true} filename="addressBook" type="link">
              {loading && <Loader className={classes.loader} color="secondaryLight" size="xs" />}
              Download
            </CSVDownloader>
          ) : (
            'Retry'
          )}
        </Button>
      </Row>
    </Modal>
  )
}
