import InputAdornment from '@material-ui/core/InputAdornment'
import { makeStyles } from '@material-ui/core/styles'
import { BigNumber } from 'bignumber.js'
import { ReactElement, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { getExplorerInfo, getNativeCurrency } from 'src/config'
import Field from 'src/components/forms/Field'
import GnoForm from 'src/components/forms/GnoForm'
import TextField from 'src/components/forms/TextField'
import {
  composeValidators,
  maxValue,
  minValue,
  minMaxDecimalsLength,
  mustBeFloat,
  mustBeEthereumAddress,
  required,
} from 'src/components/forms/validator'
import Block from 'src/components/layout/Block'
import ButtonLink from 'src/components/layout/ButtonLink'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { ScanQRWrapper } from 'src/components/ScanQRModal/ScanQRWrapper'
import { currentNetworkAddressBook } from 'src/logic/addressBook/store/selectors'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { SpendingLimit } from 'src/logic/safe/store/models/safe'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'

import SafeInfo from 'src/routes/safe/components/Balances/SendModal/SafeInfo'
import { AddressBookInput } from 'src/routes/safe/components/Balances/SendModal/screens/AddressBookInput'
import { SpendingLimitRow } from 'src/routes/safe/components/Balances/SendModal/screens/SendFunds/SpendingLimitRow'
import TokenSelectField from 'src/routes/safe/components/Balances/SendModal/screens/SendFunds/TokenSelectField'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { extendedSafeTokensSelector } from 'src/routes/safe/container/selector'
import { currentSafeSpendingLimits } from 'src/logic/safe/store/selectors'
import { sameString } from 'src/utils/strings'

import { styles } from './style'
import { spendingLimitAllowedBalance, getSpendingLimitByTokenAddress } from 'src/logic/safe/utils/spendingLimits'
import { getBalanceAndDecimalsFromToken } from 'src/logic/tokens/utils/tokenHelpers'
import Divider from 'src/components/Divider'
import { Modal } from 'src/components/Modal'
import { ModalHeader } from '../ModalHeader'
import { isSpendingLimit } from 'src/routes/safe/components/Transactions/helpers/utils'
import { getStepTitle } from 'src/routes/safe/components/Balances/SendModal/utils'

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
  name?: string
  token?: string
  txType?: string
  tokenSpendingLimit?: SpendingLimit
}

type SendFundsProps = {
  initialValues: SendFundsTx
  onClose: () => void
  onReview: (txInfo: unknown) => void
  recipientAddress?: string
  selectedToken?: string
  amount?: string
}

const InputAdornmentChildSymbol = ({ symbol }: { symbol?: string }): ReactElement => {
  return <>{symbol}</>
}

const SendFunds = ({
  initialValues,
  onClose,
  onReview,
  recipientAddress,
  selectedToken = '',
  amount,
}: SendFundsProps): ReactElement => {
  const classes = useStyles()
  const tokens = useSelector(extendedSafeTokensSelector)
  const addressBook = useSelector(currentNetworkAddressBook)
  const nativeCurrency = getNativeCurrency()
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
  const [addressErrorMsg, setAddressErrorMsg] = useState('')

  useEffect(() => {
    if (selectedEntry === null && pristine) {
      setPristine(false)
    }
  }, [selectedEntry, pristine])

  let tokenSpendingLimit
  const handleSubmit = (values) => {
    const submitValues = { ...values }
    // If the input wasn't modified, there was no mutation of the recipientAddress
    if (!values.recipientAddress) {
      submitValues.recipientAddress = selectedEntry?.address
    }
    submitValues.recipientName = selectedEntry?.name
    onReview({ ...submitValues, tokenSpendingLimit })
  }

  const spendingLimits = useSelector(currentSafeSpendingLimits)
  const currentUser = useSelector(userAccountSelector)

  const sendFundsValidation = (values: { amount?: string; token?: string; txType?: string }) => {
    const { amount, token: tokenAddress, txType } = values ?? {}
    const tokenValidation = composeValidators(required)(tokenAddress)

    const isSpendingLimitTx = tokenSpendingLimit && isSpendingLimit(txType)
    const tokenDecimals =
      (tokenAddress && Number(getBalanceAndDecimalsFromToken({ tokenAddress, tokens })?.decimals)) ||
      nativeCurrency.decimals
    const amountValidation = composeValidators(
      required,
      mustBeFloat,
      minMaxDecimalsLength(1, tokenDecimals),
      minValue(0, false),
      tokenAddress
        ? maxValue(
            isSpendingLimitTx
              ? spendingLimitAllowedBalance({ tokenAddress, tokenSpendingLimit, tokens })
              : getBalanceAndDecimalsFromToken({ tokenAddress, tokens })?.balance ?? 0,
          )
        : () => undefined,
    )(amount)

    return {
      amount: amountValidation,
      token: tokenValidation,
    }
  }

  return (
    <>
      <ModalHeader onClose={onClose} subTitle={getStepTitle(1, 2)} title="Send funds" />
      <Hairline />
      <GnoForm
        formMutators={formMutators}
        initialValues={{
          amount: initialValues?.amount || amount,
          recipientAddress: initialValues.recipientAddress || recipientAddress,
          token: initialValues?.token || selectedToken,
        }}
        onSubmit={handleSubmit}
        validation={sendFundsValidation}
      >
        {(...args) => {
          const formState = args[2]
          const mutators = args[3]
          const { token: tokenAddress, txType } = formState.values
          const selectedToken = tokens?.find((token) => token.address === tokenAddress)
          const userSpendingLimits = spendingLimits?.filter(({ delegate }) => sameAddress(delegate, currentUser))

          tokenSpendingLimit = getSpendingLimitByTokenAddress({
            spendingLimits: userSpendingLimits,
            tokenAddress: selectedToken?.address,
          })

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

          const setMaxAllowedAmount = () => {
            const isSpendingLimitTx = tokenSpendingLimit && isSpendingLimit(txType)
            let maxAmount = selectedToken?.balance.tokenBalance ?? 0

            if (isSpendingLimitTx) {
              const spendingLimitBalance = fromTokenUnit(
                new BigNumber(tokenSpendingLimit.amount).minus(tokenSpendingLimit.spent).toString(),
                selectedToken?.decimals ?? 0,
              )

              maxAmount = new BigNumber(maxAmount).gt(spendingLimitBalance) ? spendingLimitBalance : maxAmount
            }

            mutators.setMax(maxAmount)
          }

          return (
            <>
              <Block className={classes.formContainer}>
                <SafeInfo text="Sending from" />
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
                    <Row margin="sm">
                      <Paragraph color="disabled" noMargin size="lg">
                        Recipient
                      </Paragraph>
                    </Row>
                    <Row align="center" margin="md">
                      <PrefixedEthHashInfo
                        hash={selectedEntry.address}
                        name={selectedEntry.name}
                        strongName
                        showAvatar
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
                <Row margin="md">
                  <Col>
                    <TokenSelectField
                      initialValue={selectedToken?.address}
                      isValid={!!selectedToken?.address}
                      tokens={tokens}
                    />
                  </Col>
                </Row>
                {tokenSpendingLimit && selectedToken && (
                  <SpendingLimitRow selectedToken={selectedToken} tokenSpendingLimit={tokenSpendingLimit} />
                )}
                <Row margin="xs">
                  <Col between="lg">
                    <Paragraph color="disabled" noMargin size="md">
                      Amount
                    </Paragraph>
                    <ButtonLink onClick={setMaxAllowedAmount} weight="bold" testId="send-max-btn">
                      Send max
                    </ButtonLink>
                  </Col>
                </Row>
                <Row margin="md">
                  <Col>
                    <Field
                      component={TextField}
                      inputAdornment={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <InputAdornmentChildSymbol symbol={selectedToken?.symbol} />
                          </InputAdornment>
                        ),
                      }}
                      name="amount"
                      placeholder="Amount*"
                      type="text"
                      testId="amount-input"
                    />
                  </Col>
                </Row>
              </Block>
              <Modal.Footer>
                <Modal.Footer.Buttons
                  cancelButtonProps={{ onClick: onClose }}
                  confirmButtonProps={{
                    disabled: !formState.valid || shouldDisableSubmitButton,
                    testId: 'review-tx-btn',
                    text: 'Review',
                  }}
                />
              </Modal.Footer>
            </>
          )
        }}
      </GnoForm>
    </>
  )
}

export default SendFunds
