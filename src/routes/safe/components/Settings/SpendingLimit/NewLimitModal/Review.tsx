import { Button, Text } from '@gnosis.pm/safe-react-components'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import {
  getGnosisSafeInstanceAt,
  getSpendingLimitContract,
  MULTI_SEND_ADDRESS,
} from 'src/logic/contracts/safeContracts'
import createTransaction from 'src/logic/safe/store/actions/createTransaction'
import { SpendingLimit } from 'src/logic/safe/store/models/safe'
import { safeParamAddressFromStateSelector, safeSpendingLimitsSelector } from 'src/logic/safe/store/selectors'
import { DELEGATE_CALL, TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { getEncodedMultiSendCallData, MultiSendTx } from 'src/logic/safe/utils/upgradeSafe'
import { Token, makeToken } from 'src/logic/tokens/store/model/token'
import { ETH_ADDRESS } from 'src/logic/tokens/utils/tokenHelpers'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { ActionCallback, CREATE } from 'src/routes/safe/components/Settings/SpendingLimit/NewLimitModal/index'
import { SPENDING_LIMIT_MODULE_ADDRESS } from 'src/utils/constants'

import { RESET_TIME_OPTIONS } from 'src/routes/safe/components/Settings/SpendingLimit/FormFields/ResetTime'
import { AddressInfo, ResetTimeInfo, TokenInfo } from 'src/routes/safe/components/Settings/SpendingLimit/InfoDisplay'
import Modal from 'src/routes/safe/components/Settings/SpendingLimit/Modal'
import { useStyles } from 'src/routes/safe/components/Settings/SpendingLimit/style'
import {
  adjustAmountToToken,
  currentMinutes,
  fromTokenUnit,
  SpendingLimitRow,
  toTokenUnit,
} from 'src/routes/safe/components/Settings/SpendingLimit/utils'

interface ReviewSpendingLimitProps {
  onBack: ActionCallback
  onClose: () => void
  txToken: Token
  values: Record<string, string>
  existentSpendingLimit?: SpendingLimitRow
}

const Review = ({ onBack, onClose, txToken, values }: ReviewSpendingLimitProps): React.ReactElement => {
  const classes = useStyles()

  const dispatch = useDispatch()

  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const spendingLimits = useSelector(safeSpendingLimitsSelector)

  // undefined: before setting a value
  // null: if no previous value
  // SpendingLimit: if previous value exists
  const [existentSpendingLimit, setExistentSpendingLimit] = React.useState<SpendingLimit | null>(null)
  React.useEffect(() => {
    const checkExistence = async () => {
      // if `delegate` already exist, check what tokens were delegated to the _beneficiary_ `getTokens(safe, delegate)`
      const currentDelegate = spendingLimits?.find(
        ({ delegate, token }) =>
          delegate.toLowerCase() === values.beneficiary.toLowerCase() &&
          token.toLowerCase() === (values.token === ETH_ADDRESS ? ZERO_ADDRESS : values.token.toLowerCase()),
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

    const transactions: MultiSendTx[] = []

    // is spendingLimit module enabled? -> if not, create the tx to enable it, and encode it
    if (!isSpendingLimitEnabled && safeAddress) {
      const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
      transactions.push({
        to: safeAddress,
        value: 0,
        data: safeInstance.methods.enableModule(SPENDING_LIMIT_MODULE_ADDRESS).encodeABI(),
        operation: DELEGATE_CALL,
      })
    }

    // does `delegate` already exist? (`getDelegates`, previously queried to build the table with allowances (??))
    //                                  ^ - shall we rely on this or query the list of delegates once again?
    const isDelegateAlreadyAdded =
      spendingLimits?.some(({ delegate }) => delegate.toLowerCase() === values?.beneficiary.toLowerCase()) ?? false

    // if `delegate` does not exist, add it by calling `addDelegate(beneficiary)`
    if (!isDelegateAlreadyAdded && values?.beneficiary) {
      transactions.push({
        to: SPENDING_LIMIT_MODULE_ADDRESS,
        value: 0,
        data: spendingLimitContract.methods.addDelegate(values?.beneficiary).encodeABI(),
        operation: DELEGATE_CALL,
      })
    }

    // prepare the setAllowance tx
    const startTime = currentMinutes() - 30
    const setAllowanceTx = {
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
      operation: DELEGATE_CALL,
    }

    if (safeAddress) {
      // if there's no tx for enable module or adding a delegate, then we avoid using multiSend Tx
      if (transactions.length === 0) {
        dispatch(
          createTransaction({
            safeAddress,
            to: SPENDING_LIMIT_MODULE_ADDRESS,
            valueInWei: '0',
            txData: setAllowanceTx.data,
            notifiedTransaction: TX_NOTIFICATION_TYPES.NEW_SPENDING_LIMIT_TX,
          }),
        )
      } else {
        transactions.push(setAllowanceTx)

        dispatch(
          createTransaction({
            safeAddress,
            to: MULTI_SEND_ADDRESS,
            valueInWei: '0',
            txData: getEncodedMultiSendCallData(transactions, getWeb3()),
            notifiedTransaction: TX_NOTIFICATION_TYPES.NEW_SPENDING_LIMIT_TX,
            operation: DELEGATE_CALL,
          }),
        )
      }
    }
  }

  const resetTimeLabel = React.useMemo(
    () => (values.withResetTime ? RESET_TIME_OPTIONS.find(({ value }) => value === values.resetTime)?.label : ''),
    [values.resetTime, values.withResetTime],
  )

  const previousResetTime = (existentSpendingLimit: SpendingLimit) =>
    RESET_TIME_OPTIONS.find(({ value }) => value === (+existentSpendingLimit.resetTimeMin / 60 / 24).toString())
      ?.label ?? 'One-time spending limit'

  return (
    <>
      <Modal.TopBar title="New Spending Limit" titleNote="2 of 2" onClose={onClose} />

      <Block className={classes.container}>
        <Col margin="lg">
          <AddressInfo address={values.beneficiary} title="Beneficiary" />
        </Col>
        <Col margin="lg">
          <TokenInfo amount={adjustAmountToToken(values.amount, txToken.decimals)} title="Amount" token={txToken} />
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
                Previous Reset Time: {previousResetTime(existentSpendingLimit)}
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

      <Modal.Footer>
        <Button color="primary" size="md" onClick={() => onBack({ values: {}, txToken: makeToken(), step: CREATE })}>
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
      </Modal.Footer>
    </>
  )
}

export default Review
