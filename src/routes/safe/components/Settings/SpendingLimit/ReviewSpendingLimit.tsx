import { Button, EthHashInfo, Icon, IconText, Text, Title } from '@gnosis.pm/safe-react-components'
import { useSnackbar } from 'notistack'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import { getNetwork } from 'src/config'
import { getAddressBook } from 'src/logic/addressBook/store/selectors'
import { getNameFromAdbk } from 'src/logic/addressBook/utils'
import { getGnosisSafeInstanceAt, getSpendingLimitContract } from 'src/logic/contracts/safeContracts'
import { SpendingLimit } from 'src/logic/safe/store/models/safe'
import { safeParamAddressFromStateSelector, safeSpendingLimitsSelector } from 'src/logic/safe/store/selectors'
import { Token } from 'src/logic/tokens/store/model/token'
import { ETH_ADDRESS } from 'src/logic/tokens/utils/tokenHelpers'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import sendTransactions from 'src/routes/safe/components/Apps/sendTransactions'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import { SPENDING_LIMIT_MODULE_ADDRESS } from 'src/utils/constants'

import { FooterSection, FooterWrapper, StyledButton, TitleSection } from '.'
import { RESET_TIME_OPTIONS } from './ResetTime'
import { useStyles } from './style'
import { currentMinutes, fromTokenUnit, SpendingLimitRow, toTokenUnit } from './utils'

const StyledImage = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
  margin: 0 8px 0 0;
`

const StyledImageName = styled.div`
  display: flex;
  align-items: center;
`

interface ReviewSpendingLimitProps {
  onBack: () => void
  onClose: () => void
  txToken: Token | null
  values: Record<string, string>
  existentSpendingLimit?: SpendingLimitRow
}

interface GenericInfoProps {
  title?: string
  children: React.ReactNode
}
const GenericInfo = ({ title, children }: GenericInfoProps): React.ReactElement => (
  <>
    {title && (
      <Text size="lg" color="secondaryLight">
        {title}
      </Text>
    )}
    {children}
  </>
)

interface AddressInfoProps {
  address: string
  title?: string
}
const AddressInfo = ({ address, title }: AddressInfoProps): React.ReactElement => {
  const addressBook = useSelector(getAddressBook)

  return (
    <GenericInfo title={title}>
      <EthHashInfo
        hash={address}
        name={addressBook ? getNameFromAdbk(addressBook, address) : ''}
        showCopyBtn
        showEtherscanBtn
        showIdenticon
        textSize="lg"
        network={getNetwork()}
      />
    </GenericInfo>
  )
}

interface TokenInfoProps {
  amount: string
  title?: string
  token: Token
}
const TokenInfo = ({ amount, title, token }: TokenInfoProps): React.ReactElement => {
  return (
    <GenericInfo title={title}>
      <StyledImageName>
        <StyledImage alt={token.name} onError={setImageToPlaceholder} src={token.logoUri} />
        <Text size="lg">
          {amount} {token.symbol}
        </Text>
      </StyledImageName>
    </GenericInfo>
  )
}

interface ResetTimeInfoProps {
  title?: string
  label?: string
}
const ResetTimeInfo = ({ title, label }: ResetTimeInfoProps): React.ReactElement => {
  return (
    <GenericInfo title={title}>
      {label ? (
        <Row align="center" margin="md">
          <IconText iconSize="md" iconType="fuelIndicator" text={label} textSize="lg" />
        </Row>
      ) : (
        <Row align="center" margin="md">
          <Text size="lg">
            {/* TODO: review message */}
            One-time spending limit allowance
          </Text>
        </Row>
      )}
    </GenericInfo>
  )
}

const ReviewSpendingLimit = ({ onBack, onClose, txToken, values }: ReviewSpendingLimitProps): React.ReactElement => {
  const classes = useStyles()

  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const dispatch = useDispatch()

  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const spendingLimits = useSelector(safeSpendingLimitsSelector)

  // undefined: before setting a value
  // null: if no previous value
  // SpendingLimit: if previous value exists
  const [existentSpendingLimit, setExistentSpendingLimit] = React.useState<SpendingLimit>()
  React.useEffect(() => {
    const checkExistence = async () => {
      // if `delegate` already exist, check what tokens were delegated to the _beneficiary_ `getTokens(safe, delegate)`
      const currentDelegate = spendingLimits.find(
        ({ delegate, token }) =>
          delegate.toLowerCase() === values.beneficiary.toLowerCase() &&
          token.toLowerCase() === values.token.toLowerCase(),
      )

      // let the user know that is about to replace an existent allowance
      if (currentDelegate !== undefined) {
        setExistentSpendingLimit({
          ...currentDelegate,
          amount: fromTokenUnit(currentDelegate.amount, txToken.decimals),
        })
      } else {
        setExistentSpendingLimit(null)
      }
    }

    checkExistence()
  }, [spendingLimits, txToken.decimals, values.beneficiary, values.token])

  const handleSubmit = async () => {
    const spendingLimitContract = getSpendingLimitContract()
    const isSpendingLimitEnabled = spendingLimits !== null

    const transactions = []

    // is spendingLimit module enabled? -> if not, create the tx to enable it, and encode it
    if (!isSpendingLimitEnabled) {
      const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
      transactions.push({
        to: safeAddress,
        value: 0,
        data: safeInstance.methods.enableModule(SPENDING_LIMIT_MODULE_ADDRESS).encodeABI(),
      })
    }

    // does `delegate` already exist? (`getDelegates`, previously queried to build the table with allowances (??))
    //                                  ^ - shall we rely on this or query the list of delegates once again?
    const isDelegateAlreadyAdded =
      spendingLimits.some(({ delegate }) => delegate.toLowerCase() === values?.beneficiary.toLowerCase()) ?? false

    // if `delegate` does not exist, add it by calling `addDelegate(beneficiary)`
    if (!isDelegateAlreadyAdded && values?.beneficiary) {
      transactions.push({
        to: SPENDING_LIMIT_MODULE_ADDRESS,
        value: 0,
        data: spendingLimitContract.methods.addDelegate(values?.beneficiary).encodeABI(),
      })
    }

    // prepare the setAllowance tx
    const startTime = currentMinutes() - 30
    transactions.push({
      to: SPENDING_LIMIT_MODULE_ADDRESS,
      value: 0,
      data: spendingLimitContract.methods
        .setAllowance(
          values.beneficiary,
          values.token === ETH_ADDRESS ? ZERO_ADDRESS : values.token,
          toTokenUnit(values.amount, txToken.decimals),
          values.withResetTime ? +values.resetTime * 60 * 24 : 0,
          values.withResetTime ? startTime : 0,
        )
        .encodeABI(),
    })

    await sendTransactions(
      dispatch,
      safeAddress,
      transactions,
      enqueueSnackbar,
      closeSnackbar,
      JSON.stringify({ name: 'Spending Limit', message: 'New Allowance' }),
    )
      .then(onClose)
      .catch(console.error)
  }

  const resetTimeLabel = values.withResetTime
    ? RESET_TIME_OPTIONS.find(({ value }) => value === values.resetTime).label
    : ''

  return (
    <>
      <TitleSection>
        <Title size="xs" withoutMargin>
          New Spending Limit{' '}
          <Text size="lg" color="secondaryLight">
            2 of 2
          </Text>
        </Title>

        <StyledButton onClick={onClose}>
          <Icon size="sm" type="cross" />
        </StyledButton>
      </TitleSection>

      <Block className={classes.container}>
        <Col margin="lg">
          <AddressInfo address={values.beneficiary} title="Beneficiary" />
        </Col>
        <Col margin="lg">
          <TokenInfo amount={values.amount} title="Amount" token={txToken} />
          {existentSpendingLimit && (
            <Text size="lg" color="error">
              Previous Amount: {existentSpendingLimit.amount}
            </Text>
          )}
        </Col>
        <Col margin="lg">
          <ResetTimeInfo title="Reset Time" label={resetTimeLabel} />
          {existentSpendingLimit && (
            <Row align="center" margin="md">
              <Text size="lg" color="error">
                Previous Reset Time:{' '}
                {RESET_TIME_OPTIONS.find(
                  ({ value }) => value === (+existentSpendingLimit.resetTimeMin / 60 / 24).toString(),
                )?.label ?? 'One-time spending limit allowance'}
              </Text>
            </Row>
          )}
        </Col>

        {existentSpendingLimit && (
          <Text size="xl" color="error" center strong>
            You are about to replace an existent spending limit
          </Text>
        )}
      </Block>

      <FooterSection>
        <FooterWrapper>
          <Button color="primary" size="md" onClick={onBack}>
            Back
          </Button>

          <Button
            color="primary"
            size="md"
            variant="contained"
            onClick={handleSubmit}
            disabled={existentSpendingLimit === undefined}
          >
            Submit
          </Button>
        </FooterWrapper>
      </FooterSection>
    </>
  )
}

export default ReviewSpendingLimit
