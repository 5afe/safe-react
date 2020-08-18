import GnosisSafeSol from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe.json'
import { Button, Text, Title } from '@gnosis.pm/safe-react-components'
import { BigNumber } from 'bignumber.js'
import { useSnackbar } from 'notistack'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import GnoModal from 'src/components/Modal'
import generateBatchRequests from 'src/logic/contracts/generateBatchRequests'
import { getGnosisSafeInstanceAt, SENTINEL_ADDRESS } from 'src/logic/contracts/safeContracts'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { getWeb3, web3ReadOnly } from 'src/logic/wallets/getWeb3'

import sendTransactions from 'src/routes/safe/components/Apps/sendTransactions'
import NewSpendingLimit from 'src/routes/safe/components/Settings/SpendingLimit/NewSpendingLimit'
import ReviewSpendingLimit from 'src/routes/safe/components/Settings/SpendingLimit/ReviewSpendingLimit'
import SpendingLimitSteps from 'src/routes/safe/components/Settings/SpendingLimit/SpendingLimitSteps'
import { extendedSafeTokensSelector, grantedSelector } from 'src/routes/safe/container/selector'
import SpendingLimitModule from 'src/utils/AllowanceModule.json'
import { SPENDING_LIMIT_MODULE_ADDRESS } from 'src/utils/constants'

import { useStyles } from './style'

const InfoText = styled(Text)`
  margin-top: 16px;
`

export const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.separator};
`

export const StyledButton = styled.button`
  background: none;
  border: none;
  padding: 5px;
  width: 26px;
  height: 26px;

  span {
    margin-right: 0;
  }

  :hover {
    background: ${({ theme }) => theme.colors.separator};
    border-radius: 16px;
    cursor: pointer;
  }
`

export const FooterSection = styled.div`
  border-top: 2px solid ${({ theme }) => theme.colors.separator};
  padding: 16px 24px;
`

export const FooterWrapper = styled.div`
  display: flex;
  justify-content: space-around;
`

const requestModuleData = (safeAddress: string): Promise<any[]> => {
  const batch = new web3ReadOnly.BatchRequest()

  const requests = [
    {
      abi: GnosisSafeSol.abi,
      address: safeAddress,
      methods: [{ method: 'getModulesPaginated', args: [SENTINEL_ADDRESS, 100] }],
      batch,
    },
    {
      abi: SpendingLimitModule.abi,
      address: SPENDING_LIMIT_MODULE_ADDRESS,
      methods: [{ method: 'getDelegates', args: [safeAddress, 0, 100] }],
      batch,
    },
  ]

  const whenRequestsValues = requests.map(generateBatchRequests)

  batch.execute()

  return Promise.all(whenRequestsValues).then(([modules, delegates]) => [modules[0], delegates[0]])
}

const requestTokensByDelegate = async (safeAddress: string, delegates: string[]): Promise<any[]> => {
  const batch = new web3ReadOnly.BatchRequest()

  const whenRequestValues = delegates.map((delegateAddress: string) =>
    generateBatchRequests({
      abi: SpendingLimitModule.abi,
      address: SPENDING_LIMIT_MODULE_ADDRESS,
      methods: [{ method: 'getTokens', args: [safeAddress, delegateAddress] }],
      batch,
      context: delegateAddress,
    }),
  )

  batch.execute()

  return Promise.all(whenRequestValues)
}

const requestAllowancesByDelegatesAndTokens = async (
  safeAddress: string,
  tokensByDelegate: [string, string[]][],
): Promise<any[]> => {
  const batch = new web3ReadOnly.BatchRequest()

  let whenRequestValues = []

  tokensByDelegate.map(([delegate, tokens]): void => {
    whenRequestValues = tokens.map((token) =>
      generateBatchRequests({
        abi: SpendingLimitModule.abi,
        address: SPENDING_LIMIT_MODULE_ADDRESS,
        methods: [{ method: 'getTokenAllowance', args: [safeAddress, delegate, token] }],
        batch,
        context: { delegate, token },
      }),
    )
  })

  batch.execute()

  return Promise.all(whenRequestValues).then((allowances) =>
    allowances.map(([{ delegate, token }, [amount, spent, resetTimeMin, lastResetMin, nonce]]) => ({
      delegate,
      token,
      amount,
      spent,
      resetTimeMin,
      lastResetMin,
      nonce,
    })),
  )
}

const fromTokenUnit = (amount: string, decimals: string | number): string =>
  new BigNumber(amount).times(`1e-${decimals}`).toFixed()
const toTokenUnit = (amount: string, decimals: string | number): string =>
  new BigNumber(amount).times(`1e${decimals}`).toFixed()
const currentMinutes = () => Math.floor(Date.now() / (1000 * 60))

const NewSpendingLimitModal = ({ close, open }: { close: () => void; open: boolean }): React.ReactElement => {
  const classes = useStyles()

  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const dispatch = useDispatch()

  const [step, setStep] = React.useState<'create' | 'review'>('create')
  const [values, setValues] = React.useState()
  const tokens = useSelector(extendedSafeTokensSelector)
  const [txToken, setTxToken] = React.useState(null)
  const [existentSpendingLimit, setExistentSpendingLimit] = React.useState()

  const handleReview = async (values) => {
    const selectedToken = tokens.find((token) => token.address === values.token)

    setValues(values)
    setTxToken(selectedToken)

    const checkExistence = async () => {
      const [, delegates] = await requestModuleData(safeAddress)
      const tokensByDelegate = await requestTokensByDelegate(safeAddress, delegates.results)
      const allowances = await requestAllowancesByDelegatesAndTokens(safeAddress, tokensByDelegate)

      // if `delegate` already exist, check what tokens were delegated to the _beneficiary_ `getTokens(safe, delegate)`
      const currentDelegate = allowances.find(
        ({ delegate, token }) =>
          delegate.toLowerCase() === values.beneficiary.toLowerCase() &&
          token.toLowerCase() === values.token.toLowerCase(),
      )

      // let the user know that is about to replace an existent allowance
      if (currentDelegate !== undefined) {
        setExistentSpendingLimit({
          ...currentDelegate,
          amount: fromTokenUnit(currentDelegate.amount, selectedToken.decimals),
        })
      } else {
        setExistentSpendingLimit(undefined)
      }
    }

    await checkExistence()
    setStep('review')
  }

  const handleSubmit = async (values: Record<string, string>) => {
    const [enabledModules, delegates] = await requestModuleData(safeAddress)
    const isSpendingLimitEnabled =
      enabledModules?.array?.some((module) => module.toLowerCase() === SPENDING_LIMIT_MODULE_ADDRESS.toLowerCase()) ??
      false
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
      delegates.results.some((delegate) => delegate.toLowerCase() === values?.beneficiary.toLowerCase()) ?? false

    // if `delegate` does not exist, add it by calling `addDelegate(beneficiary)`
    if (!isDelegateAlreadyAdded) {
      const web3 = getWeb3()
      const spendingLimit = new web3.eth.Contract(SpendingLimitModule.abi as any, SPENDING_LIMIT_MODULE_ADDRESS)
      transactions.push({
        to: SPENDING_LIMIT_MODULE_ADDRESS,
        value: 0,
        data: spendingLimit.methods.addDelegate(values?.beneficiary).encodeABI(),
      })
    }

    // prepare the setAllowance tx
    const web3 = getWeb3()
    const spendingLimit = new web3.eth.Contract(SpendingLimitModule.abi as any, SPENDING_LIMIT_MODULE_ADDRESS)
    const startTime = currentMinutes() - 30
    transactions.push({
      to: SPENDING_LIMIT_MODULE_ADDRESS,
      value: 0,
      data: spendingLimit.methods
        .setAllowance(
          values.beneficiary,
          values.token,
          toTokenUnit(values.amount, txToken.decimals),
          values.withResetTime ? +values.resetTime * 60 * 24 : 0,
          startTime,
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
      .then(close)
      .catch(console.error)
  }
  return (
    <GnoModal
      handleClose={close}
      open={open}
      title="New Spending Limit"
      description="set rules for specific beneficiaries to access funds from this Safe without having to collect all signatures"
      paperClassName={classes.modal}
    >
      {step === 'create' && <NewSpendingLimit initialValues={values} onCancel={close} onReview={handleReview} />}
      {step === 'review' && (
        <ReviewSpendingLimit
          onBack={() => setStep('create')}
          onClose={close}
          onSubmit={() => handleSubmit(values)}
          txToken={txToken}
          values={values}
          existentSpendingLimit={existentSpendingLimit}
        />
      )}
    </GnoModal>
  )
}
const SpendingLimit = (): React.ReactElement => {
  const classes = useStyles()
  const granted = useSelector(grantedSelector)
  const [showNewSpendingLimitModal, setShowNewSpendingLimitModal] = React.useState(false)

  // TODO: Refactor `delegates` for better performance. This is just to verify allowance works
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const [delegates, setDelegates] = React.useState({ results: [], next: '' })
  React.useEffect(() => {
    const doRequestData = async () => {
      const [, delegates] = await requestModuleData(safeAddress)
      setDelegates(delegates)
    }
    doRequestData()
  }, [safeAddress])

  const openNewSpendingLimitModal = () => {
    setShowNewSpendingLimitModal(true)
  }

  const closeNewSpendingLimitModal = () => {
    setShowNewSpendingLimitModal(false)
  }

  return (
    <>
      <Block className={classes.container}>
        <Title size="xs" withoutMargin>
          Spending Limit
        </Title>
        <InfoText size="lg">
          You can set rules for specific beneficiaries to access funds from this Safe without having to collect all
          signatures.
        </InfoText>
        {delegates?.results?.length ? (
          delegates.results.map((delegate) => <div key={delegate}>{delegate}</div>)
        ) : (
          <SpendingLimitSteps />
        )}
      </Block>
      <Row align="end" className={classes.buttonRow} grow>
        <Col end="xs">
          <Button
            className={classes.actionButton}
            color="primary"
            disabled={!granted}
            size="md"
            data-testid="new-spending-limit-button"
            onClick={openNewSpendingLimitModal}
            variant="contained"
          >
            New spending limit
          </Button>
        </Col>
      </Row>
      {showNewSpendingLimitModal && <NewSpendingLimitModal close={closeNewSpendingLimitModal} open={true} />}
    </>
  )
}

export default SpendingLimit
