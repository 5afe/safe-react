// @flow
import React, { useState } from 'react'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import { OnChange } from 'react-final-form-listeners'
import Close from '@material-ui/icons/Close'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import GnoForm from '~/components/forms/GnoForm'
import Col from '~/components/layout/Col'
import Button from '~/components/layout/Button'
import Block from '~/components/layout/Block'
import Img from '~/components/layout/Img'
import Hairline from '~/components/layout/Hairline'
import ButtonLink from '~/components/layout/ButtonLink'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import { type Token } from '~/logic/tokens/store/model/token'
import {
  composeValidators,
  required,
  mustBeFloat,
  maxValue,
  greaterThan,
} from '~/components/forms/validator'
import TokenSelectField from '~/routes/safe/components/Balances/SendModal/screens/SendFunds/TokenSelectField'
import SafeInfo from '~/routes/safe/components/Balances/SendModal/SafeInfo'
import ScanQRModal from '~/components/ScanQRModal'
import ArrowDown from '../assets/arrow-down.svg'
import QRIcon from '~/assets/icons/qrcode.svg'
import { styles } from './style'
import { sm } from '~/theme/variables'
import AddressBookInput from '~/routes/safe/components/Balances/SendModal/screens/AddressBookInput'
import Identicon from '~/components/Identicon'
import CopyBtn from '~/components/CopyBtn'
import EtherscanBtn from '~/components/EtherscanBtn'

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
  recipientAddress?: string
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
  onClose,
  safeAddress,
  safeName,
  ethBalance,
  tokens,
  selectedToken,
  initialValues,
  onSubmit,
  recipientAddress,
}: Props) => {
  const [qrModalOpen, setQrModalOpen] = useState<boolean>(false)
  const [selectedEntry, setSelectedEntry] = useState<Object | null>({
    address: recipientAddress,
    name: '',
  })

  const handleSubmit = (values) => {
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
      <Row align="center" grow className={classes.heading}>
        <Paragraph weight="bolder" className={classes.manage} noMargin>
          Send Funds
        </Paragraph>
        <Paragraph className={classes.annotation}>1 of 2</Paragraph>
        <IconButton onClick={onClose} disableRipple>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm
        onSubmit={handleSubmit}
        formMutators={formMutators}
        initialValues={initialValues}
      >
        {(...args) => {
          const formState = args[2]
          const mutators = args[3]
          const { token: tokenAddress } = formState.values
          const selectedTokenRecord = tokens.find(
            (token) => token.address === tokenAddress,
          )

          const handleScan = (value) => {
            let scannedAddress = value

            if (scannedAddress.startsWith('ethereum:')) {
              scannedAddress = scannedAddress.replace('ethereum:', '')
            }

            mutators.setRecipient(scannedAddress)
            closeQrModal()
          }

          return (
            <>
              <Block className={classes.formContainer}>
                <SafeInfo
                  safeAddress={safeAddress}
                  safeName={safeName}
                  ethBalance={ethBalance}
                />
                <Row margin="md">
                  <Col xs={1}>
                    <img
                      src={ArrowDown}
                      alt="Arrow Down"
                      style={{ marginLeft: sm }}
                    />
                  </Col>
                  <Col xs={11} center="xs" layout="column">
                    <Hairline />
                  </Col>
                </Row>
                {selectedEntry && selectedEntry.address ? (
                  <div
                    role="listbox"
                    tabIndex="0"
                    onClick={() => setSelectedEntry(null)}
                    onKeyDown={(e) => {
                      if (e.keyCode !== 9) {
                        setSelectedEntry(null)
                      }
                    }}
                  >
                    <Row margin="xs">
                      <Paragraph
                        size="md"
                        color="disabled"
                        style={{ letterSpacing: '-0.5px' }}
                        noMargin
                      >
                        Recipient
                      </Paragraph>
                    </Row>
                    <Row margin="md" align="center">
                      <Col xs={1}>
                        <Identicon
                          address={selectedEntry.address}
                          diameter={32}
                        />
                      </Col>
                      <Col xs={11} layout="column">
                        <Block justify="left">
                          <Block>
                            <Paragraph
                              weight="bolder"
                              className={classes.address}
                              noMargin
                            >
                              {selectedEntry.name}
                            </Paragraph>
                            <Paragraph
                              weight="bolder"
                              className={classes.address}
                              noMargin
                            >
                              {selectedEntry.address}
                            </Paragraph>
                          </Block>
                          <CopyBtn content={selectedEntry.address} />
                          <EtherscanBtn
                            type="address"
                            value={selectedEntry.address}
                          />
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
                          recipientAddress={recipientAddress}
                          setSelectedEntry={setSelectedEntry}
                        />
                      </Col>
                      <Col xs={1} center="xs" middle="xs" className={classes}>
                        <Img
                          src={QRIcon}
                          className={classes.qrCodeBtn}
                          role="button"
                          height={20}
                          alt="Scan QR"
                          onClick={() => {
                            openQrModal()
                          }}
                        />
                      </Col>
                    </Row>
                  </>
                )}
                <Row margin="sm">
                  <Col>
                    <TokenSelectField
                      tokens={tokens}
                      initialValue={selectedToken}
                    />
                  </Col>
                </Row>
                <Row margin="xs">
                  <Col between="lg">
                    <Paragraph
                      size="md"
                      color="disabled"
                      style={{ letterSpacing: '-0.5px' }}
                      noMargin
                    >
                      Amount
                    </Paragraph>
                    <ButtonLink
                      weight="bold"
                      onClick={() => mutators.setMax(selectedTokenRecord.balance)}
                    >
                      Send max
                    </ButtonLink>
                  </Col>
                </Row>
                <Row margin="md">
                  <Col>
                    <Field
                      name="amount"
                      component={TextField}
                      type="text"
                      validate={composeValidators(
                        required,
                        mustBeFloat,
                        greaterThan(0),
                        maxValue(
                          selectedTokenRecord && selectedTokenRecord.balance,
                        ),
                      )}
                      placeholder="Amount*"
                      text="Amount*"
                      className={classes.addressInput}
                      inputAdornment={
                        selectedTokenRecord && {
                          endAdornment: (
                            <InputAdornment position="end">
                              {selectedTokenRecord.symbol}
                            </InputAdornment>
                          ),
                        }
                      }
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
                  type="submit"
                  variant="contained"
                  minWidth={140}
                  color="primary"
                  data-testid="review-tx-btn"
                  className={classes.submitButton}
                  disabled={!setSelectedEntry}
                >
                  Review
                </Button>
              </Row>
              {qrModalOpen && (
                <ScanQRModal
                  isOpen={qrModalOpen}
                  onScan={handleScan}
                  onClose={closeQrModal}
                />
              )}
            </>
          )
        }}
      </GnoForm>
    </>
  )
}

export default withStyles(styles)(SendFunds)
