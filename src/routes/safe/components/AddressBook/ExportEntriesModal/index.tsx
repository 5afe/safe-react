import React, { ReactElement, useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useSelector, useDispatch } from 'react-redux'
import { CSVDownloader, jsonToCSV } from 'react-papaparse'
import styled from 'styled-components'

import { enhanceSnackbarForAction, getNotificationsFromTxType } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'

import { Button, Loader, Text } from '@gnosis.pm/safe-react-components'

import { addressBookSelector } from 'src/logic/addressBook/store/selectors'
import { AddressBookState } from 'src/logic/addressBook/model/addressBook'

import { useStyles } from './style'

import { Modal } from 'src/components/Modal'
import Img from 'src/components/layout/Img'
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
  const dispatch = useDispatch()
  const addressBook: AddressBookState = useSelector(addressBookSelector)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | undefined>('')
  const [csvData, setCsvData] = useState<string>('')
  const [doRetry, setDoRetry] = useState<boolean>(false)

  const date = format(new Date(), 'MM-dd-yyyy')

  const handleClose = () =>
    setTimeout(() => {
      if (!loading) {
        const notification = getNotificationsFromTxType(TX_NOTIFICATION_TYPES.ADDRESSBOOK_EXPORT_ENTRIES)
        const action = error
          ? notification.afterExecution.afterExecutionError
          : notification.afterExecution.noMoreConfirmationsNeeded
        dispatch(enqueueSnackbar(enhanceSnackbarForAction(action)))
      }
      onClose()
    }, 600)

  useEffect(() => {
    const handleCsvData = () => {
      if (!isOpen && !doRetry) return
      setLoading(true)
      setError('')
      try {
        setCsvData(jsonToCSV(addressBook))
      } catch (e) {
        setError(e.message)
      }
      if (csvData) {
        setLoading(false)
        setDoRetry(false)
      }
    }

    handleCsvData()
  }, [addressBook, isOpen, doRetry, csvData])

  return (
    <Modal description="Export address book" handleClose={onClose} open={isOpen} title="Export address book">
      <Modal.Header onClose={onClose}>
        <Modal.Header.Title withoutMargin>Export address book</Modal.Header.Title>
      </Modal.Header>
      <Modal.Body withoutPadding>
        <Row className={classes.imageContainer} align="center">
          <BodyImage>
            <Img alt="Export" height={92} src={error ? ErrorSvg : loading ? LoadingSvg : SuccessSvg} />
          </BodyImage>
        </Row>
        <Row align="center" className={classes.info}>
          <Text color="primary" as="p" size="xl">
            {!error ? (
              <Text size="xl" as="span">
                You&apos;re about to export a CSV file with{' '}
                <Text size="xl" strong as="span">
                  {addressBook.length} address book entries
                </Text>
                .
              </Text>
            ) : (
              <Text size="xl" as="span">
                An error occurred while generating the address book CSV.
              </Text>
            )}
          </Text>
        </Row>
      </Modal.Body>
      <Modal.Footer withoutPadding withoutBorder>
        <Row align="center" className={classes.buttonRow}>
          <Button size="md" variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" size="md" disabled={loading} onClick={error ? () => setDoRetry(true) : handleClose}>
            {!error ? (
              <CSVDownloader
                className={classes.downloader}
                data={csvData}
                bom={true}
                filename={`gnosis-safe-address-book-${date}`}
                type="link"
              >
                {loading && <Loader className={classes.loader} color="secondaryLight" size="xs" />}
                Download
              </CSVDownloader>
            ) : (
              'Retry'
            )}
          </Button>
        </Row>
      </Modal.Footer>
    </Modal>
  )
}
