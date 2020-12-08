import { Button, Text } from '@gnosis.pm/safe-react-components'
import React, { ReactElement, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import { getNetworkInfo } from 'src/config'
import createTransaction from 'src/logic/safe/store/actions/createTransaction'
import { SafeRecordProps, SpendingLimit } from 'src/logic/safe/store/models/safe'
import {
  addSpendingLimitBeneficiaryMultiSendTx,
  currentMinutes,
  enableSpendingLimitModuleMultiSendTx,
  setSpendingLimitMultiSendTx,
  setSpendingLimitTx,
  spendingLimitMultiSendTx,
  SpendingLimitRow,
} from 'src/logic/safe/utils/spendingLimits'
import { MultiSendTx } from 'src/logic/safe/utils/upgradeSafe'
import { makeToken, Token } from 'src/logic/tokens/store/model/token'
import { fromTokenUnit, toTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { sameAddress, ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { RESET_TIME_OPTIONS } from 'src/routes/safe/components/Settings/SpendingLimit/FormFields/ResetTime'
import { AddressInfo, ResetTimeInfo, TokenInfo } from 'src/routes/safe/components/Settings/SpendingLimit/InfoDisplay'
import Modal from 'src/routes/safe/components/Settings/SpendingLimit/Modal'
import { useStyles } from 'src/routes/safe/components/Settings/SpendingLimit/style'
import { safeParamAddressFromStateSelector, safeSpendingLimitsSelector } from 'src/logic/safe/store/selectors'

import { ActionCallback, CREATE } from '.'

const { nativeCoin } = getNetworkInfo()

const useExistentSpendingLimit = ({
  spendingLimits,
  txToken,
  values,
}: {
  spendingLimits?: SafeRecordProps['spendingLimits']
  txToken: Token
  values: ReviewSpendingLimitProps['values']
}) => {
  // undefined: before setting a value
  // null: if no previous value
  // SpendingLimit: if previous value exists
  return useMemo<SpendingLimit | null>(() => {
    // if `delegate` already exist, check what tokens were delegated to the _beneficiary_ `getTokens(safe, delegate)`
    const currentDelegate = spendingLimits?.find(
      ({ delegate, token }) =>
        sameAddress(delegate, values.beneficiary) &&
        sameAddress(token, sameAddress(values.token, nativeCoin.address) ? ZERO_ADDRESS : values.token),
    )

    // let the user know that is about to replace an existent allowance
    if (currentDelegate !== undefined) {
      return {
        ...currentDelegate,
        amount: fromTokenUnit(currentDelegate.amount, txToken.decimals),
      }
    } else {
      return null
    }
  }, [spendingLimits, txToken.decimals, values.beneficiary, values.token])
}

interface ReviewSpendingLimitProps {
  onBack: ActionCallback
  onClose: () => void
  txToken: Token
  values: Record<string, string>
  existentSpendingLimit?: SpendingLimitRow
}

const Review = ({ onBack, onClose, txToken, values }: ReviewSpendingLimitProps): ReactElement => {
  const classes = useStyles()

  const dispatch = useDispatch()

  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const spendingLimits = useSelector(safeSpendingLimitsSelector)
  const existentSpendingLimit = useExistentSpendingLimit({ spendingLimits, txToken, values })

  const handleSubmit = () => {
    const isSpendingLimitEnabled = spendingLimits !== null
    const transactions: MultiSendTx[] = []

    // is spendingLimit module enabled? -> if not, create the tx to enable it, and encode it
    if (!isSpendingLimitEnabled && safeAddress) {
      transactions.push(enableSpendingLimitModuleMultiSendTx(safeAddress))
    }

    // does `delegate` already exist? (`getDelegates`, previously queried to build the table with allowances (??))
    //                                  ^ - shall we rely on this or query the list of delegates once again?
    const isDelegateAlreadyAdded =
      spendingLimits?.some(({ delegate }) => sameAddress(delegate, values?.beneficiary)) ?? false

    // if `delegate` does not exist, add it by calling `addDelegate(beneficiary)`
    if (!isDelegateAlreadyAdded && values?.beneficiary) {
      transactions.push(addSpendingLimitBeneficiaryMultiSendTx(values.beneficiary))
    }

    // prepare the setAllowance tx
    const startTime = currentMinutes() - 30
    const spendingLimitArgs = {
      beneficiary: values.beneficiary,
      token: values.token,
      spendingLimitInWei: toTokenUnit(values.amount, txToken.decimals),
      resetTimeMin: values.withResetTime ? +values.resetTime * 60 * 24 : 0,
      resetBaseMin: values.withResetTime ? startTime : 0,
    }

    if (safeAddress) {
      // if there's no tx for enable module or adding a delegate, then we avoid using multiSend Tx
      if (transactions.length === 0) {
        dispatch(createTransaction(setSpendingLimitTx({ spendingLimitArgs, safeAddress })))
      } else {
        transactions.push(setSpendingLimitMultiSendTx({ spendingLimitArgs, safeAddress }))
        dispatch(createTransaction(spendingLimitMultiSendTx({ transactions, safeAddress })))
      }
    }
  }

  const resetTimeLabel = useMemo(
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
          <TokenInfo
            amount={fromTokenUnit(toTokenUnit(values.amount, txToken.decimals), txToken.decimals)}
            title="Amount"
            token={txToken}
          />
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
