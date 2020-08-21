import { Button, EthHashInfo, Text, Title } from '@gnosis.pm/safe-react-components'
import TableContainer from '@material-ui/core/TableContainer'
import cn from 'classnames'
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import { TableCell, TableRow } from 'src/components/layout/Table'
import Table from 'src/components/Table'
import { getNetwork } from 'src/config'
import { getAddressBook } from 'src/logic/addressBook/store/selectors'
import { getNameFromAdbk } from 'src/logic/addressBook/utils'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { Token } from 'src/logic/tokens/store/model/token'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { ETH_ADDRESS } from 'src/logic/tokens/utils/tokenHelpers'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { useWindowDimensions } from 'src/routes/safe/container/hooks/useWindowDimensions'
import { extendedSafeTokensSelector, grantedSelector } from 'src/routes/safe/container/selector'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'

import {
  generateColumns,
  getSpendingLimitData,
  SPENDING_LIMIT_TABLE_BENEFICIARY_ID,
  SPENDING_LIMIT_TABLE_RESET_TIME_ID,
  SPENDING_LIMIT_TABLE_SPENT_ID,
  SpendingLimitTable,
} from './dataFetcher'
import RemoveSpendingLimitModal from './RemoveSpendingLimitModal'
import SpendingLimitModal from './SpendingLimitModal'
import SpendingLimitSteps from './SpendingLimitSteps'
import { useStyles } from './style'
import {
  fromTokenUnit,
  requestAllowancesByDelegatesAndTokens,
  requestModuleData,
  requestTokensByDelegate,
  SpendingLimitRow,
} from './utils'

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

type SpentInfo = {
  token: Token
  spent: string
  amount: string
}

interface HumanReadableSpentProps {
  spent: string
  amount: string
  tokenAddress: string
}

const HumanReadableSpent = ({ spent, amount, tokenAddress }: HumanReadableSpentProps): React.ReactElement => {
  const tokens = useSelector(extendedSafeTokensSelector)
  const { width } = useWindowDimensions()
  const [spentInfo, setSpentInfo] = React.useState<SpentInfo>()

  React.useEffect(() => {
    if (tokens) {
      const safeTokenAddress = tokenAddress === ZERO_ADDRESS ? ETH_ADDRESS : tokenAddress
      const token = tokens.find((token) => token.address === safeTokenAddress)
      const formattedSpent = formatAmount(fromTokenUnit(spent, token.decimals)).toString()
      const formattedAmount = formatAmount(fromTokenUnit(amount, token.decimals)).toString()

      setSpentInfo({ token, spent: formattedSpent, amount: formattedAmount })
    }
  }, [amount, spent, tokenAddress, tokens])

  return spentInfo ? (
    <StyledImageName>
      {width > 1024 && (
        <StyledImage alt={spentInfo.token.name} onError={setImageToPlaceholder} src={spentInfo.token.logoUri} />
      )}
      <Text size="lg">{`${spentInfo.spent} of ${spentInfo.amount} ${spentInfo.token.symbol}`}</Text>
    </StyledImageName>
  ) : null
}

const SpendingLimitSettings = (): React.ReactElement => {
  const classes = useStyles()
  const granted = useSelector(grantedSelector)
  const tokens = useSelector(extendedSafeTokensSelector)
  const addressBook = useSelector(getAddressBook)

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

  const [showNewSpendingLimitModal, setShowNewSpendingLimitModal] = React.useState(false)
  const openNewSpendingLimitModal = () => {
    setShowNewSpendingLimitModal(true)
  }
  const closeNewSpendingLimitModal = () => {
    setShowNewSpendingLimitModal(false)
  }

  const [showRemoveSpendingLimitModal, setShowRemoveSpendingLimitModal] = React.useState(false)
  const [selectedRow, setSelectedRow] = React.useState<SpendingLimitTable>(null)
  const openRemoveSpendingLimitModal = (row: SpendingLimitTable) => {
    setSelectedRow(row)
    setShowRemoveSpendingLimitModal(true)
  }
  const closeRemoveSpendingLimitModal = () => {
    setShowRemoveSpendingLimitModal(false)
    setSelectedRow(null)
  }
  const handleDeleteSpendingLimit = (row: SpendingLimitTable): void => {
    openRemoveSpendingLimitModal(row)
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
          <TableContainer style={{ minHeight: '420px' }}>
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

                          {columnId === SPENDING_LIMIT_TABLE_SPENT_ID && <HumanReadableSpent {...rowElement} />}
                          {columnId === SPENDING_LIMIT_TABLE_RESET_TIME_ID && (
                            <Text size="lg">{rowElement.relativeTime}</Text>
                          )}
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
                            onClick={() => handleDeleteSpendingLimit(row)}
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

      {granted && (
        <>
          <Row align="end" className={classes.buttonRow} grow>
            <Col end="xs">
              <Button
                className={classes.actionButton}
                color="primary"
                size="md"
                data-testid="new-spending-limit-button"
                onClick={openNewSpendingLimitModal}
                variant="contained"
              >
                New spending limit
              </Button>
            </Col>
          </Row>
          {showNewSpendingLimitModal && <SpendingLimitModal close={closeNewSpendingLimitModal} open={true} />}
        </>
      )}
      {showRemoveSpendingLimitModal && (
        <RemoveSpendingLimitModal onClose={closeRemoveSpendingLimitModal} spendingLimit={selectedRow} open={true} />
      )}
    </>
  )
}

export default SpendingLimitSettings
