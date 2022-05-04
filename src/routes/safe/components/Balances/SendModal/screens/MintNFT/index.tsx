import { makeStyles } from '@material-ui/core/styles'
import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'

import Divider from 'src/components/Divider'
import GnoForm from 'src/components/forms/GnoForm'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { ScanQRWrapper } from 'src/components/ScanQRModal/ScanQRWrapper'
import { Modal } from 'src/components/Modal'
import WhenFieldChanges from 'src/components/WhenFieldChanges'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { currentNetworkAddressBook } from 'src/logic/addressBook/store/selectors'
import SafeInfo from 'src/routes/safe/components/Balances/SendModal/SafeInfo'
import { AddressBookInput } from 'src/routes/safe/components/Balances/SendModal/screens/AddressBookInput'
import { getExplorerInfo } from 'src/config'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { sameString } from 'src/utils/strings'

import { styles } from './style'
import { ModalHeader } from '../ModalHeader'
import { mustBeEthereumAddress } from 'src/components/forms/validator'
import { getStepTitle } from 'src/routes/safe/components/Balances/SendModal/utils'
import { Field } from 'react-final-form'
import { InputAdornment, TextField } from '@material-ui/core'

const formMutators = {
  setMax: (args, state, utils) => {
    utils.changeValue(state, 'amount', () => args[0])
  },
  onTokenChange: (args, state, utils) => {
    utils.changeValue(state, 'amount', () => '')
  },
  setRecipient: (args, state, utils) => {
    utils.changeValue(state, 'recipientAddress', () => args[0])
  },
}

const useStyles = makeStyles(styles)

type MintNFTProps = {
  initialValues: any
  onClose: () => void
  // onNext: (txInfo: MintNFTTxInfo) => void
  recipientAddress?: string
}

export type MintNFTTxInfo = {
  recipientAddress?: string
}

const MintNFT = ({ initialValues, onClose, recipientAddress }: MintNFTProps): React.ReactElement => {
  const classes = useStyles()
  const addressBook = useSelector(currentNetworkAddressBook)
  const [addressErrorMsg, setAddressErrorMsg] = useState('')
  const [selectedEntry, setSelectedEntry] = useState<{ address: string; name: string } | null>(() => {
    const defaultEntry = { address: recipientAddress || '', name: '' }

    // if there's nothing to lookup for, we return the default entry
    if (!initialValues?.recipientAddress && !recipientAddress) {
      return defaultEntry
    }

    // if there's something to lookup for, `initialValues` has precedence over `recipientAddress`
    const predefinedAddress = initialValues?.recipientAddress ?? recipientAddress
    const addressBookEntry = addressBook.find(({ address }) => {
      return sameAddress(predefinedAddress, address)
    })

    // if found in the Address Book, then we return the entry
    if (addressBookEntry) {
      return addressBookEntry
    }

    // otherwise we return the default entry
    return defaultEntry
  })
  const [pristine, setPristine] = useState(true)
  const [isValidAddress, setIsValidAddress] = useState(false)

  useMemo(() => {
    if (selectedEntry === null && pristine) {
      setPristine(false)
    }
  }, [selectedEntry, pristine])

  const handleSubmit = (values: MintNFTTxInfo) => {
    // If the input wasn't modified, there was no mutation of the recipientAddress
    if (!values.recipientAddress) {
      values.recipientAddress = selectedEntry?.address
    }

    // onNext(values)
  }

  return (
    <>
      <ModalHeader onClose={onClose} subTitle={getStepTitle(1, 2)} title="Mint NFT" />
      <Hairline />
      <GnoForm formMutators={formMutators} initialValues={initialValues} onSubmit={handleSubmit}>
        {(...args) => {
          const mutators = args[3]

          const handleScan = (value, closeQrModal) => {
            let scannedAddress = value

            if (scannedAddress.startsWith('ethereum:')) {
              scannedAddress = scannedAddress.replace('ethereum:', '')
            }
            const scannedName = addressBook.find(({ address }) => {
              return sameAddress(scannedAddress, address)
            })?.name
            const addressErrorMessage = mustBeEthereumAddress(scannedAddress)
            if (!addressErrorMessage) {
              mutators.setRecipient(scannedAddress)
              setSelectedEntry({
                name: scannedName || '',
                address: scannedAddress,
              })
              setAddressErrorMsg('')
            } else setAddressErrorMsg(addressErrorMessage)

            closeQrModal()
          }

          let shouldDisableSubmitButton = !isValidAddress

          if (selectedEntry) {
            shouldDisableSubmitButton = !selectedEntry.address
          }

          return (
            <>
              <WhenFieldChanges field="assetAddress" set="nftTokenId" to={''} />
              <Block className={classes.formContainer}>
                <SafeInfo text="Minting with" />
                <Divider withArrow />
                {selectedEntry && selectedEntry.address ? (
                  <div
                    onKeyDown={(e) => {
                      if (sameString(e.key, 'Tab')) {
                        return
                      }
                      setSelectedEntry({ address: '', name: '' })
                    }}
                    onClick={() => {
                      setSelectedEntry({ address: '', name: '' })
                    }}
                    role="listbox"
                    tabIndex={0}
                  >
                    <Row margin="xs">
                      <Paragraph color="disabled" noMargin size="lg">
                        Recipient
                      </Paragraph>
                    </Row>
                    <Row align="center" margin="md">
                      <Col xs={12}>
                        <PrefixedEthHashInfo
                          hash={selectedEntry.address}
                          name={selectedEntry.name}
                          strongName
                          showAvatar
                          showCopyBtn
                          explorerUrl={getExplorerInfo(selectedEntry.address)}
                        />
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <Row margin="md">
                    <Col xs={11}>
                      <AddressBookInput
                        fieldMutator={mutators.setRecipient}
                        pristine={pristine}
                        errorMsg={addressErrorMsg}
                        setIsValidAddress={setIsValidAddress}
                        setSelectedEntry={setSelectedEntry}
                      />
                    </Col>
                    <Col center="xs" className={classes} middle="xs" xs={1}>
                      <ScanQRWrapper handleScan={handleScan} />
                    </Col>
                  </Row>
                )}
                <Row margin="xs">
                  <Col between="lg">
                    <Paragraph color="" noMargin size="md">
                      Contract Name
                    </Paragraph>
                  </Col>
                </Row>
                <Row margin="md">
                  <Col>
                    <Field
                      component={TextField}
                      // inputAdornment={{
                      //   endAdornment: (
                      //     <InputAdornment position="end">
                      //       <InputAdornmentChildSymbol symbol={selectedToken?.symbol} />
                      //     </InputAdornment>
                      //   ),
                      // }}
                      name="name"
                      placeholder="Name*"
                      type="text"
                      testId="name-input"
                    />
                  </Col>
                </Row>
                <Row margin="xs">
                  <Col between="lg">
                    <Paragraph color="" noMargin size="md">
                      Symbol
                    </Paragraph>
                  </Col>
                </Row>
                <Row margin="md">
                  <Col>
                    <Field
                      component={TextField}
                      // inputAdornment={{
                      //   endAdornment: (
                      //     <InputAdornment position="end">
                      //       <InputAdornmentChildSymbol symbol={selectedToken?.symbol} />
                      //     </InputAdornment>
                      //   ),
                      // }}
                      name="symbol"
                      placeholder="Symbol*"
                      type="text"
                      testId="symbol-input"
                    />
                  </Col>
                </Row>
              </Block>
              <Modal.Footer>
                <Modal.Footer.Buttons
                  cancelButtonProps={{ onClick: onClose }}
                  confirmButtonProps={{ disabled: shouldDisableSubmitButton, testId: 'mint-tx-btn', text: 'Mint' }}
                />
              </Modal.Footer>
            </>
          )
        }}
      </GnoForm>
    </>
  )
}

export default MintNFT
