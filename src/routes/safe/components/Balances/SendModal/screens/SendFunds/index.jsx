// @flow
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import { List } from 'immutable'
import React, { useState } from 'react'
import { OnChange } from 'react-final-form-listeners'

import ArrowDown from '../assets/arrow-down.svg'

import { styles } from './style'

import QRIcon from '~/assets/icons/qrcode.svg'
import CopyBtn from '~/components/CopyBtn'
import EtherscanBtn from '~/components/EtherscanBtn'
import Identicon from '~/components/Identicon'
import ScanQRModal from '~/components/ScanQRModal'
import Field from '~/components/forms/Field'
import GnoForm from '~/components/forms/GnoForm'
import TextField from '~/components/forms/TextField'
import { composeValidators, greaterThan, maxValue, mustBeFloat, required } from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import Button from '~/components/layout/Button'
import ButtonLink from '~/components/layout/ButtonLink'
import Col from '~/components/layout/Col'
import Hairline from '~/components/layout/Hairline'
import Img from '~/components/layout/Img'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import { type Token } from '~/logic/tokens/store/model/token'
import SafeInfo from '~/routes/safe/components/Balances/SendModal/SafeInfo'
import AddressBookInput from '~/routes/safe/components/Balances/SendModal/screens/AddressBookInput'
import TokenSelectField from '~/routes/safe/components/Balances/SendModal/screens/SendFunds/TokenSelectField'
import { sm } from '~/theme/variables'

type Props = {
  onClose: () => void,
  classes: Object,
  safeAddress: string,
  safeName: string,
  ethBalance: string,
  selectedToken: string,
  tokens: List<Token>,
  onSubmit: Function,
  initialValues: Object,
  recipientAddress?: string,
}

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

const SendFunds = ({
  classes,
  ethBalance,
  initialValues,
  onClose,
  onSubmit,
  recipientAddress,
  safeAddress,
  safeName,
  selectedToken,
  tokens,
}: Props) => {
  const [qrModalOpen, setQrModalOpen] = useState<boolean>(false)
  const [selectedEntry, setSelectedEntry] = useState<Object | null>({
    address: recipientAddress,
    name: '',
  })
  const [pristine, setPristine] = useState<boolean>(true)
  const [isValidAddress, setIsValidAddress] = useState<boolean>(true)

  React.useMemo(() => {
    if (selectedEntry === null && pristine) {
      setPristine(false)
    }
  }, [selectedEntry, pristine])

  const handleSubmit = values => {
    const submitValues = values
    // If the input wasn't modified, there was no mutation of the recipientAddress
    if (!values.recipientAddress) {
      submitValues.recipientAddress = selectedEntry.address
    }
    onSubmit(submitValues)
  }

  const openQrModal = () => {
    setQrModalOpen(true)
  }

  const closeQrModal = () => {
    setQrModalOpen(false)
  }

  return (
    <>
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight="bolder">
          Send Funds
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
          const { token: tokenAddress } = formState.values
          const selectedTokenRecord = tokens.find(token => token.address === tokenAddress)

          const handleScan = value => {
            let scannedAddress = value

            if (scannedAddress.startsWith('ethereum:')) {
              scannedAddress = scannedAddress.replace('ethereum:', '')
            }

            mutators.setRecipient(scannedAddress)
            closeQrModal()
          }

          let shouldDisableSubmitButton = !isValidAddress
          if (selectedEntry) {
            shouldDisableSubmitButton = !selectedEntry.address
          }

          return (
            <>
              <Block className={classes.formContainer}>
                <SafeInfo ethBalance={ethBalance} safeAddress={safeAddress} safeName={safeName} />
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
                    onKeyDown={e => {
                      if (e.keyCode !== 9) {
                        setSelectedEntry(null)
                      }
                    }}
                    role="listbox"
                    tabIndex="0"
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
                              onClick={() => setSelectedEntry(null)}
                              weight="bolder"
                            >
                              {selectedEntry.name}
                            </Paragraph>
                            <Paragraph
                              className={classes.selectAddress}
                              noMargin
                              onClick={() => setSelectedEntry(null)}
                              weight="bolder"
                            >
                              {selectedEntry.address}
                            </Paragraph>
                          </Block>
                          <CopyBtn content={selectedEntry.address} />
                          <EtherscanBtn type="address" value={selectedEntry.address} />
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
                        <Img
                          alt="Scan QR"
                          className={classes.qrCodeBtn}
                          height={20}
                          onClick={() => {
                            openQrModal()
                          }}
                          role="button"
                          src={QRIcon}
                        />
                      </Col>
                    </Row>
                  </>
                )}
                <Row margin="sm">
                  <Col>
                    <TokenSelectField
                      initialValue={selectedToken}
                      isValid={tokenAddress && String(tokenAddress).toUpperCase() !== 'ETHER'}
                      tokens={tokens}
                    />
                  </Col>
                </Row>
                <Row margin="xs">
                  <Col between="lg">
                    <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
                      Amount
                    </Paragraph>
                    <ButtonLink onClick={() => mutators.setMax(selectedTokenRecord.balance)} weight="bold">
                      Send max
                    </ButtonLink>
                  </Col>
                </Row>
                <Row margin="md">
                  <Col>
                    <Field
                      component={TextField}
                      inputAdornment={
                        selectedTokenRecord && {
                          endAdornment: <InputAdornment position="end">{selectedTokenRecord.symbol}</InputAdornment>,
                        }
                      }
                      name="amount"
                      placeholder="Amount*"
                      text="Amount*"
                      type="text"
                      validate={composeValidators(
                        required,
                        mustBeFloat,
                        greaterThan(0),
                        maxValue(selectedTokenRecord && selectedTokenRecord.balance),
                      )}
                    />
                    <OnChange name="token">
                      {() => {
                        mutators.onTokenChange()
                      }}
                    </OnChange>
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
              {qrModalOpen && <ScanQRModal isOpen={qrModalOpen} onClose={closeQrModal} onScan={handleScan} />}
            </>
          )
        }}
      </GnoForm>
    </>
  )
}

export default withStyles(styles)(SendFunds)
