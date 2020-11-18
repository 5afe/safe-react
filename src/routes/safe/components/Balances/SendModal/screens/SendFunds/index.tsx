import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import { BigNumber } from 'bignumber.js'
import React, { ReactElement, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { getExplorerInfo, getNetworkInfo } from 'src/config'
import Field from 'src/components/forms/Field'
import GnoForm from 'src/components/forms/GnoForm'
import TextField from 'src/components/forms/TextField'
import { composeValidators, maxValue, minValue, mustBeFloat, required } from 'src/components/forms/validator'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import ButtonLink from 'src/components/layout/ButtonLink'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { ScanQRWrapper } from 'src/components/ScanQRModal/ScanQRWrapper'
import { addressBookSelector } from 'src/logic/addressBook/store/selectors'
import { getNameFromAddressBook } from 'src/logic/addressBook/utils'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { SpendingLimit } from 'src/logic/safe/store/models/safe'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'

import SafeInfo from 'src/routes/safe/components/Balances/SendModal/SafeInfo'
import { AddressBookInput } from 'src/routes/safe/components/Balances/SendModal/screens/AddressBookInput'
import { SpendingLimitRow } from 'src/routes/safe/components/Balances/SendModal/screens/SendFunds/SpendingLimitRow'
import TokenSelectField from 'src/routes/safe/components/Balances/SendModal/screens/SendFunds/TokenSelectField'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { extendedSafeTokensSelector, safeSpendingLimitsSelector } from 'src/routes/safe/container/selector'
import { sm } from 'src/theme/variables'

import ArrowDown from '../assets/arrow-down.svg'

import { styles } from './style'
import { EthHashInfo } from '@gnosis.pm/safe-react-components'

const formMutators = {
  setMax: (args, state, utils) => {
    utils.changeValue(state, 'amount', () => args[0])
  },
  onTokenChange: (args, state, utils) => {
    utils.changeValue(state, 'amount', () => state.formState.values.amount)
  },
  setRecipient: (args, state, utils) => {
    utils.changeValue(state, 'recipientAddress', () => args[0])
  },
  setTxType: (args, state, utils) => {
    utils.changeValue(state, 'txType', () => args[0])
  },
}

const useStyles = makeStyles(styles)

export type SendFundsTx = {
  amount?: string
  recipientAddress?: string
  token?: string
  txType?: string
  tokenSpendingLimit?: SpendingLimit
}

type SendFundsProps = {
  onClose: () => void
  onNext: (txInfo: unknown) => void
  recipientAddress?: string
  selectedToken?: string
  amount?: string
}

const { nativeCoin } = getNetworkInfo()

const getTokenByAddress = ({ tokenAddress, tokens }) => {
  const token = tokens?.find(({ address }) => sameAddress(address, tokenAddress)) ?? {}
  const balance = token?.balance ?? 0
  const decimals = token?.decimals ?? 0

  return {
    ...token,
    balance,
    decimals,
  }
}

const allowedBySpendingLimit = ({ tokenAddress, tokenSpendingLimit, tokens }) => {
  const { balance, decimals } = getTokenByAddress({ tokenAddress, tokens })
  const diff = new BigNumber(tokenSpendingLimit.amount).minus(tokenSpendingLimit.spent).toString()
  const diffInDecimals = fromTokenUnit(diff, decimals)

  return new BigNumber(balance).gt(diffInDecimals) ? diffInDecimals : balance
}

const SendFunds = ({ onClose, onNext, recipientAddress, selectedToken = '', amount }: SendFundsProps): ReactElement => {
  const classes = useStyles()
  const tokens = useSelector(extendedSafeTokensSelector)
  const addressBook = useSelector(addressBookSelector)
  const [selectedEntry, setSelectedEntry] = useState<{ address: string; name: string } | null>(() => {
    const defaultEntry = { address: recipientAddress || '', name: '' }

    // if there's nothing to lookup for, we return the default entry
    if (!recipientAddress) {
      return defaultEntry
    }

    const addressBookEntry = addressBook.find(({ address }) => {
      return sameAddress(recipientAddress, address)
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

  useEffect(() => {
    if (selectedEntry === null && pristine) {
      setPristine(false)
    }
  }, [selectedEntry, pristine])

  let tokenSpendingLimit
  const handleSubmit = (values) => {
    const submitValues = values
    // If the input wasn't modified, there was no mutation of the recipientAddress
    if (!values.recipientAddress) {
      submitValues.recipientAddress = selectedEntry?.address
    }
    onNext({ ...submitValues, tokenSpendingLimit })
  }

  const spendingLimits = useSelector(safeSpendingLimitsSelector)
  const currentUser = useSelector(userAccountSelector)

  const sendFundsValidation = (values) => {
    const { amount, token: tokenAddress, txType } = values ?? {}

    if (!amount || !tokenAddress) {
      return
    }

    const isSpendingLimit = tokenSpendingLimit && txType === 'spendingLimit'

    const amountValidation = composeValidators(
      required,
      mustBeFloat,
      minValue(0, false),
      maxValue(
        isSpendingLimit
          ? allowedBySpendingLimit({ tokenAddress, tokenSpendingLimit, tokens })
          : getTokenByAddress({ tokenAddress, tokens }).balance,
      ),
    )(amount)

    return {
      amount: amountValidation,
    }
  }

  return (
    <>
      <Row align="center" className={classes.heading} grow data-testid="modal-title-send-funds">
        <Paragraph className={classes.manage} noMargin weight="bolder">
          Send Funds
        </Paragraph>
        <Paragraph className={classes.annotation}>1 of 2</Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm
        formMutators={formMutators}
        initialValues={{ amount, recipientAddress, token: selectedToken }}
        onSubmit={handleSubmit}
        validation={sendFundsValidation}
      >
        {(...args) => {
          const formState = args[2]
          const mutators = args[3]
          const { token: tokenAddress, txType } = formState.values
          const selectedTokenRecord = tokens?.find((token) => token.address === tokenAddress)
          tokenSpendingLimit =
            selectedTokenRecord &&
            spendingLimits
              ?.filter(({ delegate }) => sameAddress(delegate, currentUser))
              .find(({ token }) => {
                const tokenAddress = sameAddress(token, ZERO_ADDRESS) ? nativeCoin.address : token
                return sameAddress(tokenAddress, selectedTokenRecord.address)
              })

          const handleScan = (value, closeQrModal) => {
            let scannedAddress = value

            if (scannedAddress.startsWith('ethereum:')) {
              scannedAddress = scannedAddress.replace('ethereum:', '')
            }
            const scannedName = addressBook ? getNameFromAddressBook(addressBook, scannedAddress) : ''
            mutators.setRecipient(scannedAddress)
            setSelectedEntry({
              name: scannedName || '',
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
                      if (e.key === 'Tab') {
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
                      <EthHashInfo
                        hash={selectedEntry.address}
                        name={selectedEntry.name}
                        showIdenticon
                        showCopyBtn
                        explorerUrl={getExplorerInfo(selectedEntry.address)}
                      />
                    </Row>
                  </div>
                ) : (
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
                )}
                <Row margin="sm">
                  <Col>
                    <TokenSelectField
                      initialValue={selectedToken}
                      isValid={sameAddress(tokenAddress, nativeCoin.name)}
                      tokens={tokens}
                    />
                  </Col>
                </Row>
                {tokenSpendingLimit && selectedTokenRecord && (
                  <SpendingLimitRow selectedToken={selectedTokenRecord} tokenSpendingLimit={tokenSpendingLimit} />
                )}
                <Row margin="xs">
                  <Col between="lg">
                    <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
                      Amount
                    </Paragraph>
                    <ButtonLink
                      onClick={() =>
                        mutators.setMax(
                          tokenSpendingLimit && txType === 'spendingLimit'
                            ? new BigNumber(selectedTokenRecord?.balance ?? 0).gt(
                                fromTokenUnit(
                                  new BigNumber(tokenSpendingLimit.amount).minus(tokenSpendingLimit.spent).toString(),
                                  selectedTokenRecord?.decimals ?? 0,
                                ),
                              )
                              ? fromTokenUnit(
                                  new BigNumber(tokenSpendingLimit.amount).minus(tokenSpendingLimit.spent).toString(),
                                  selectedTokenRecord?.decimals ?? 0,
                                )
                              : selectedTokenRecord?.balance ?? 0
                            : selectedTokenRecord?.balance ?? 0,
                        )
                      }
                      weight="bold"
                      testId="send-max-btn"
                    >
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
                      testId="amount-input"
                    />
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
                  disabled={!formState.valid || shouldDisableSubmitButton}
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

export default SendFunds
