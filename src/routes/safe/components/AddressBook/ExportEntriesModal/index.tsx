import { ReactElement, useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useSelector, useDispatch } from 'react-redux'
import { CSVDownloader, jsonToCSV } from 'react-papaparse'
import { Button, Loader, Text } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'

import { showNotification } from 'src/logic/notifications/store/notifications'
import { NOTIFICATIONS } from 'src/logic/notifications'

import { addressBookState } from 'src/logic/addressBook/store/selectors'

import { lg, md, background } from 'src/theme/variables'

import { Modal } from 'src/components/Modal'
import Img from 'src/components/layout/Img'
import Row from 'src/components/layout/Row'
import HelpInfo from 'src/routes/safe/components/AddressBook/HelpInfo'

import SuccessSvg from './assets/success.svg'
import ErrorSvg from './assets/error.svg'
import LoadingSvg from './assets/wait.svg'
import { ADDRESS_BOOK_EVENTS } from 'src/utils/events/addressBook'
import Track from 'src/components/Track'

type ExportEntriesModalProps = {
  isOpen: boolean
  onClose: () => void
}

const ImageContainer = styled(Row)`
  padding: ${md} ${lg};
  justify-content: center;
`

const InfoContainer = styled(Row)`
  background-color: ${background};
  flex-direction: column;
  justify-content: center;
  padding: ${lg};
  text-align: center;
`

const BodyImage = styled.div`
  grid-row: 1;
`
const StyledLoader = styled(Loader)`
  margin-right: 5px;
`

export const ExportEntriesModal = ({ isOpen, onClose }: ExportEntriesModalProps): ReactElement => {
  const dispatch = useDispatch()
  const addressBook = useSelector(addressBookState)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | undefined>('')
  const [csvData, setCsvData] = useState<string>('')
  const [doRetry, setDoRetry] = useState<boolean>(false)

  const date = format(new Date(), 'yyyy-MM-dd')

  const handleClose = () => {
    //This timeout prevents modal to be closed abruptly
    setLoading(true)
    setTimeout(() => {
      if (!loading && error) {
        dispatch(showNotification(NOTIFICATIONS.ADDRESS_BOOK_EXPORT_ENTRIES_ERROR))
      }
      onClose()
    }, 600)
  }

  useEffect(() => {
    const handleCsvData = () => {
      if (!isOpen && !doRetry) return
      setLoading(true)
      setError('')
      try {
        setCsvData(jsonToCSV(addressBook))
      } catch (e) {
        setLoading(false)
        setError(e.message)
        return
      }
      setLoading(false)
      setDoRetry(false)
    }

    handleCsvData()
  }, [addressBook, isOpen, doRetry, csvData])

  return (
    <Modal description="Export address book" handleClose={onClose} open={isOpen} title="Export address book">
      <Modal.Header onClose={onClose}>
        <Modal.Header.Title withoutMargin>Export address book</Modal.Header.Title>
      </Modal.Header>

      <Modal.Body withoutPadding>
        <ImageContainer>
          <BodyImage>
            <Img alt="Export" height={92} src={error ? ErrorSvg : loading ? LoadingSvg : SuccessSvg} />
          </BodyImage>
        </ImageContainer>
        <InfoContainer>
          <Text color="primary" as="p" size="xl">
            {!error ? (
              <Text color='primary' size="xl" as="span">
                You&apos;re about to export a CSV file with{' '}
                <Text color='primary' size="xl" strong as="span">
                  {addressBook.length} address book entries. <br />
                  <HelpInfo />
                </Text>
                .
              </Text>
            ) : (
              <Text size="xl" as="span">
                An error occurred while generating the address book CSV.
              </Text>
            )}
          </Text>
        </InfoContainer>
      </Modal.Body>

      <Modal.Footer withoutBorder>
        <Button size="md" variant="outlined" onClick={onClose}>
          Cancel
        </Button>

        {error ? (
          <Button color="primary" size="md" disabled={loading} onClick={() => setDoRetry(true)}>
            Retry
          </Button>
        ) : (
          <CSVDownloader data={csvData} bom filename={`gnosis-safe-address-book-${date}`} type="link">
            <Track {...ADDRESS_BOOK_EVENTS.DOWNLOAD_BUTTON} label={addressBook.length}>
              <Button color="primary" size="md" disabled={loading} onClick={handleClose}>
                {loading && <StyledLoader color="secondaryLight" size="xs" />}
                Download
              </Button>
            </Track>
          </CSVDownloader>
        )}
      </Modal.Footer>
    </Modal>
  )
}
