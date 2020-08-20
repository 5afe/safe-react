import { Button, EthHashInfo, Text, Title } from '@gnosis.pm/safe-react-components'
import TableContainer from '@material-ui/core/TableContainer'
import cn from 'classnames'
import { useSnackbar } from 'notistack'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { TableCell, TableRow } from 'src/components/layout/Table'
import Table from 'src/components/Table'
import { getNetwork } from 'src/config'
import { getAddressBook } from 'src/logic/addressBook/store/selectors'
import { getNameFromAdbk } from 'src/logic/addressBook/utils'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import { useWindowDimensions } from 'src/routes/safe/container/hooks/useWindowDimensions'

import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import GnoModal from 'src/components/Modal'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { ETH_ADDRESS } from 'src/logic/tokens/utils/tokenHelpers'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import sendTransactions from 'src/routes/safe/components/Apps/sendTransactions'
import { extendedSafeTokensSelector, grantedSelector } from 'src/routes/safe/container/selector'
import SpendingLimitModule from 'src/utils/AllowanceModule.json'
import { SPENDING_LIMIT_MODULE_ADDRESS } from 'src/utils/constants'

import NewSpendingLimit from './NewSpendingLimit'
import ReviewSpendingLimit from './ReviewSpendingLimit'
import SpendingLimitSteps from './SpendingLimitSteps'
import {
  currentMinutes,
  fromTokenUnit,
  requestAllowancesByDelegatesAndTokens,
  requestModuleData,
  requestTokensByDelegate,
  toTokenUnit,
  SpendingLimitRow,
} from './utils'
import {
  generateColumns,
  getSpendingLimitData,
  SPENDING_LIMIT_TABLE_BENEFICIARY_ID,
  SPENDING_LIMIT_TABLE_RESET_TIME_ID,
  SPENDING_LIMIT_TABLE_SPENT_ID,
  SpendingLimitTable,
} from './dataFetcher'
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

const NewSpendingLimitModal = ({ close, open }: { close: () => void; open: boolean }): React.ReactElement => {
  const classes = useStyles()

  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const dispatch = useDispatch()

  const [step, setStep] = React.useState<'create' | 'review'>('create')
  const [values, setValues] = React.useState()
  const tokens = useSelector(extendedSafeTokensSelector)
  const [txToken, setTxToken] = React.useState(null)
  const [existentSpendingLimit, setExistentSpendingLimit] = React.useState<SpendingLimitRow>()

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

const TableActionButton = styled(Button)`
  background-color: transparent;
  padding: 0;

  &:hover {
    background-color: transparent;
  }
`

const SpendingLimit = (): React.ReactElement => {
  const classes = useStyles()
  const granted = useSelector(grantedSelector)
  const tokens = useSelector(extendedSafeTokensSelector)
  const addressBook = useSelector(getAddressBook)
  const [showNewSpendingLimitModal, setShowNewSpendingLimitModal] = React.useState(false)

  // TODO: Refactor `delegates` for better performance. This is just to verify allowance works
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const [spendingLimits, setSpendingLimits] = React.useState<SpendingLimitRow[]>()
  const [spendingLimitData, setSpendingLimitData] = React.useState<SpendingLimitTable[] | undefined>()
  React.useEffect(() => {
    const doRequestData = async () => {
      const [, delegates] = await requestModuleData(safeAddress)
      const tokensByDelegate = await requestTokensByDelegate(safeAddress, delegates.results)
      const allowances = await requestAllowancesByDelegatesAndTokens(safeAddress, tokensByDelegate)
      setSpendingLimits(allowances)
      setSpendingLimitData(getSpendingLimitData(allowances))
    }
    doRequestData()
  }, [safeAddress, tokens])

  const [cut, setCut] = React.useState(undefined)
  const { width } = useWindowDimensions()
  React.useEffect(() => {
    if (width <= 1024) {
      setCut(4)
    } else {
      setCut(8)
    }
  }, [width])

  const columns = generateColumns()
  const autoColumns = columns.filter(({ custom }) => !custom)

  const openNewSpendingLimitModal = () => {
    setShowNewSpendingLimitModal(true)
  }

  const closeNewSpendingLimitModal = () => {
    setShowNewSpendingLimitModal(false)
  }

  const humanReadableSpent = (spent: string, amount: string, tokenAddress: string): React.ReactElement => {
    const token = tokens.find((token) => token.address === tokenAddress)
    const formattedSpent = formatAmount(fromTokenUnit(spent, token.decimals)).toString()
    const formattedAmount = formatAmount(fromTokenUnit(amount, token.decimals)).toString()

    return (
      <StyledImageName>
        {width > 1024 && <StyledImage alt={token.name} onError={setImageToPlaceholder} src={token.logoUri} />}
        <Text size="lg">{`${formattedSpent} of ${formattedAmount} ${token.symbol}`}</Text>
      </StyledImageName>
    )
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
        {spendingLimits?.length && spendingLimitData?.length ? (
          <TableContainer style={{ minHeight: '400px' }}>
            <Table
              columns={columns}
              data={spendingLimitData}
              defaultFixed
              defaultOrderBy={SPENDING_LIMIT_TABLE_BENEFICIARY_ID}
              defaultRowsPerPage={5}
              label="Spending Limits"
              noBorder
              size={spendingLimitData.length}
            >
              {(sortedData) =>
                sortedData.map((row, index) => (
                  <TableRow
                    className={cn(classes.hide, index >= 3 && index === sortedData.size - 1 && classes.noBorderBottom)}
                    data-testid="spending-limit-table-row"
                    key={index}
                    tabIndex={-1}
                  >
                    {autoColumns.map((column, index) => {
                      const columnId = column.id
                      const rowElement = row[columnId]

                      return (
                        <TableCell align={column.align} component="td" key={`${columnId}-${index}`}>
                          {columnId === SPENDING_LIMIT_TABLE_BENEFICIARY_ID && (
                            <EthHashInfo
                              hash={rowElement}
                              name={addressBook ? getNameFromAdbk(addressBook, rowElement) : ''}
                              showCopyBtn
                              showEtherscanBtn
                              showIdenticon
                              textSize="lg"
                              shortenHash={cut}
                              network={getNetwork()}
                            />
                          )}

                          {columnId === SPENDING_LIMIT_TABLE_SPENT_ID &&
                            humanReadableSpent(rowElement.spent, rowElement.amount, rowElement.tokenAddress)}

                          {columnId === SPENDING_LIMIT_TABLE_RESET_TIME_ID && <Text size="lg">{rowElement}</Text>}
                        </TableCell>
                      )
                    })}
                    <TableCell component="td">
                      <Row align="end" className={classes.actions}>
                        {granted && (
                          <TableActionButton
                            size="md"
                            iconType="delete"
                            color="error"
                            variant="outlined"
                            onClick={() => console.log({ row })}
                            data-testid="remove-action"
                          >
                            {null}
                          </TableActionButton>
                        )}
                      </Row>
                    </TableCell>
                  </TableRow>
                ))
              }
            </Table>
          </TableContainer>
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
