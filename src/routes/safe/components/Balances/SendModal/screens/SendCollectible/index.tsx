import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import CopyBtn from 'src/components/CopyBtn'
import EtherscanBtn from 'src/components/EtherscanBtn'
import GnoForm from 'src/components/forms/GnoForm'
import Identicon from 'src/components/Identicon'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { ScanQRWrapper } from 'src/components/ScanQRModal/ScanQRWrapper'
import WhenFieldChanges from 'src/components/WhenFieldChanges'
import { addressBookSelector } from 'src/logic/addressBook/store/selectors'
import { getNameFromAddressBook } from 'src/logic/addressBook/utils'
import { nftTokensSelector, safeActiveSelectorMap } from 'src/logic/collectibles/store/selectors'
import SafeInfo from 'src/routes/safe/components/Balances/SendModal/SafeInfo'
import AddressBookInput from 'src/routes/safe/components/Balances/SendModal/screens/AddressBookInput'
import CollectibleSelectField from 'src/routes/safe/components/Balances/SendModal/screens/SendCollectible/CollectibleSelectField'
import TokenSelectField from 'src/routes/safe/components/Balances/SendModal/screens/SendCollectible/TokenSelectField'
import { sm } from 'src/theme/variables'

import ArrowDown from '../assets/arrow-down.svg'

import { styles } from './style'
import { NFTToken } from 'src/logic/collectibles/sources/collectibles'

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
  selectedToken: NFTToken
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
  const nftAssets = useSelector(safeActiveSelectorMap)
  const nftTokens = useSelector(nftTokensSelector)
  const addressBook = useSelector(addressBookSelector)
  const [selectedEntry, setSelectedEntry] = useState<{ address?: string; name?: string | null } | null>({
    address: recipientAddress || initialValues.recipientAddress,
    name: '',
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
          Send Collectible
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
              name: scannedName,
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
                <Row margin="md">
                  <Col xs={1}>
                    <img alt="Arrow Down" src={ArrowDown} style={{ marginLeft: sm }} />
                  </Col>
                  <Col center="xs" layout="column" xs={11}>
                    <Hairline />
                  </Col>
                </Row>
                {selectedEntry && selectedEntry.address ? (
                  <div
                    onKeyDown={(e) => {
                      if (e.keyCode !== 9) {
                        setSelectedEntry({ address: '', name: 'string' })
                      }
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
                      <Col xs={1}>
                        <Identicon address={selectedEntry.address} diameter={32} />
                      </Col>
                      <Col layout="column" xs={11}>
                        <Block justify="left">
                          <Block>
                            <Paragraph
                              className={classes.selectAddress}
                              noMargin
                              onClick={() => setSelectedEntry({ address: '', name: 'string' })}
                              weight="bolder"
                            >
                              {selectedEntry.name}
                            </Paragraph>
                            <Paragraph
                              className={classes.selectAddress}
                              noMargin
                              onClick={() => setSelectedEntry({ address: '', name: 'string' })}
                              weight="bolder"
                            >
                              {selectedEntry.address}
                            </Paragraph>
                          </Block>
                          <CopyBtn content={selectedEntry.address} />
                          <EtherscanBtn value={selectedEntry.address} />
                        </Block>
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
                          recipientAddress={recipientAddress}
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
                    <TokenSelectField assets={nftAssets} initialValue={(selectedToken as any).assetAddress} />
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
                    <CollectibleSelectField initialValue={(selectedToken as any).tokenId} tokens={selectedNFTTokens} />
                  </Col>
                </Row>
              </Block>
              <Hairline />
              <Row align="center" className={classes.buttonRow}>
                <Button minWidth={140} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  className={classes.submitButton}
                  color="primary"
                  data-testid="review-tx-btn"
                  disabled={shouldDisableSubmitButton}
                  minWidth={140}
                  type="submit"
                  variant="contained"
                >
                  Review
                </Button>
              </Row>
            </>
          )
        }}
      </GnoForm>
    </>
  )
}

export default SendCollectible
