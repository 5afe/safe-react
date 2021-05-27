import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import React, { useState } from 'react'
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
import { addressBookSelector } from 'src/logic/addressBook/store/selectors'
import { getNameFromAddressBook } from 'src/logic/addressBook/utils'
import { nftAssetsSelector, nftTokensSelector } from 'src/logic/collectibles/store/selectors'
import { Erc721Transfer } from 'src/logic/safe/store/models/types/gateway'
import SafeInfo from 'src/routes/safe/components/Balances/SendModal/SafeInfo'
import { AddressBookInput } from 'src/routes/safe/components/Balances/SendModal/screens/AddressBookInput'
import { NFTToken } from 'src/logic/collectibles/sources/collectibles.d'
import { getExplorerInfo } from 'src/config'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { sameString } from 'src/utils/strings'

import { CollectibleSelectField } from './CollectibleSelectField'
import { styles } from './style'
import TokenSelectField from './TokenSelectField'

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

type SendCollectibleProps = {
  initialValues: any
  onClose: () => void
  onNext: (txInfo: SendCollectibleTxInfo) => void
  recipientAddress?: string
  selectedToken?: NFTToken | Erc721Transfer
}

export type SendCollectibleTxInfo = {
  assetAddress: string
  assetName: string
  nftTokenId: string
  recipientAddress?: string
}

const SendCollectible = ({
  initialValues,
  onClose,
  onNext,
  recipientAddress,
  selectedToken,
}: SendCollectibleProps): React.ReactElement => {
  const classes = useStyles()
  const nftAssets = useSelector(nftAssetsSelector)
  const nftTokens = useSelector(nftTokensSelector)
  const addressBook = useSelector(addressBookSelector)
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

  React.useMemo(() => {
    if (selectedEntry === null && pristine) {
      setPristine(false)
    }
  }, [selectedEntry, pristine])

  const handleSubmit = (values: SendCollectibleTxInfo) => {
    // If the input wasn't modified, there was no mutation of the recipientAddress
    if (!values.recipientAddress) {
      values.recipientAddress = selectedEntry?.address
    }

    values.assetName = nftAssets[values.assetAddress].name

    onNext(values)
  }

  return (
    <>
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight="bolder">
          Send collectible
        </Paragraph>
        <Paragraph className={classes.annotation}>1 of 2</Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm formMutators={formMutators} initialValues={initialValues} onSubmit={handleSubmit}>
        {(...args) => {
          const formState = args[2]
          const mutators = args[3]
          const { assetAddress } = formState.values
          const selectedNFTTokens = nftTokens.filter((nftToken) => nftToken.assetAddress === assetAddress)

          const handleScan = (value, closeQrModal) => {
            let scannedAddress = value

            if (scannedAddress.startsWith('ethereum:')) {
              scannedAddress = scannedAddress.replace('ethereum:', '')
            }
            const scannedName = addressBook ? getNameFromAddressBook(addressBook, scannedAddress) : ''
            mutators.setRecipient(scannedAddress)
            setSelectedEntry({
              name: scannedName ?? '',
              address: scannedAddress,
            })
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
                <SafeInfo />
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
                      <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
                        Recipient
                      </Paragraph>
                    </Row>
                    <Row align="center" margin="md">
                      <Col xs={12}>
                        <EthHashInfo
                          hash={selectedEntry.address}
                          name={selectedEntry.name}
                          showAvatar
                          showCopyBtn
                          explorerUrl={getExplorerInfo(selectedEntry.address)}
                        />
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <>
                    <Row margin="md">
                      <Col xs={11}>
                        <AddressBookInput
                          fieldMutator={mutators.setRecipient}
                          pristine={pristine}
                          setIsValidAddress={setIsValidAddress}
                          setSelectedEntry={setSelectedEntry}
                        />
                      </Col>
                      <Col center="xs" className={classes} middle="xs" xs={1}>
                        <ScanQRWrapper handleScan={handleScan} />
                      </Col>
                    </Row>
                  </>
                )}
                <Row margin="xs">
                  <Col between="lg">
                    <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
                      Collectible
                    </Paragraph>
                  </Col>
                </Row>
                <Row margin="sm">
                  <Col>
                    <TokenSelectField
                      assets={nftAssets}
                      initialValue={
                        (selectedToken as NFTToken)?.assetAddress ?? (selectedToken as Erc721Transfer)?.tokenAddress
                      }
                    />
                  </Col>
                </Row>
                <Row margin="xs">
                  <Col between="lg">
                    <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
                      Token ID
                    </Paragraph>
                  </Col>
                </Row>
                <Row margin="md">
                  <Col>
                    <CollectibleSelectField initialValue={selectedToken?.tokenId} tokens={selectedNFTTokens} />
                  </Col>
                </Row>
              </Block>
              <Modal.Footer>
                <Modal.Footer.Buttons
                  cancelButtonProps={{ onClick: onClose }}
                  confirmButtonProps={{ disabled: shouldDisableSubmitButton, testId: 'review-tx-btn', text: 'Review' }}
                />
              </Modal.Footer>
            </>
          )
        }}
      </GnoForm>
    </>
  )
}

export default SendCollectible
