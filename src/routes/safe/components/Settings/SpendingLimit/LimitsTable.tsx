import { Button, Text } from '@gnosis.pm/safe-react-components'
import TableContainer from '@material-ui/core/TableContainer'
import cn from 'classnames'
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import Row from 'src/components/layout/Row'
import { TableCell, TableRow } from 'src/components/layout/Table'
import Table from 'src/components/Table'
import { Token } from 'src/logic/tokens/store/model/token'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { ETH_ADDRESS } from 'src/logic/tokens/utils/tokenHelpers'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import { useWindowDimensions } from 'src/routes/safe/container/hooks/useWindowDimensions'
import { extendedSafeTokensSelector, grantedSelector } from 'src/routes/safe/container/selector'

import {
  generateColumns,
  SPENDING_LIMIT_TABLE_BENEFICIARY_ID,
  SPENDING_LIMIT_TABLE_RESET_TIME_ID,
  SPENDING_LIMIT_TABLE_SPENT_ID,
  SpendingLimitTable,
} from './dataFetcher'
import { AddressInfo } from './InfoDisplay'
import RemoveLimitModal from './RemoveLimitModal'
import { useStyles } from './style'
import { fromTokenUnit } from './utils'

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

const useWidthState = (width: number): number | null => {
  const [cut, setCut] = React.useState(null)

  React.useEffect(() => {
    if (width <= 1024) {
      setCut(4)
    } else {
      setCut(8)
    }
  }, [width])

  return cut
}

interface SpendingLimitTableProps {
  data?: SpendingLimitTable[]
}

const LimitsTable = ({ data }: SpendingLimitTableProps): React.ReactElement => {
  const classes = useStyles()
  const granted = useSelector(grantedSelector)

  const columns = generateColumns()
  const autoColumns = columns.filter(({ custom }) => !custom)

  const { width } = useWindowDimensions()
  const cut = useWidthState(width)

  const [selectedRow, setSelectedRow] = React.useState<SpendingLimitTable>(null)

  return (
    <>
      <TableContainer style={{ minHeight: '420px' }}>
        <Table
          columns={columns}
          data={data}
          defaultFixed
          defaultOrderBy={SPENDING_LIMIT_TABLE_BENEFICIARY_ID}
          defaultRowsPerPage={5}
          label="Spending Limits"
          noBorder
          size={data.length}
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
                        <AddressInfo address={rowElement} cut={cut} />
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
                        onClick={() => setSelectedRow(row)}
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
      {selectedRow !== null && (
        <RemoveLimitModal onClose={() => setSelectedRow(null)} spendingLimit={selectedRow} open={true} />
      )}
    </>
  )
}

export default LimitsTable
