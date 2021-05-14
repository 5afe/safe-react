import { List } from 'immutable'

import { TableColumn } from 'src/components/Table/types.d'
import { SpendingLimitRow } from 'src/logic/safe/utils/spendingLimits'
import { relativeTime } from 'src/utils/date'

export const SPENDING_LIMIT_TABLE_BENEFICIARY_ID = 'beneficiary'
export const SPENDING_LIMIT_TABLE_SPENT_ID = 'spent'
export const SPENDING_LIMIT_TABLE_RESET_TIME_ID = 'resetTime'
export const SPENDING_LIMIT_TABLE_ACTION_ID = 'action'

export type SpendingLimitTable = {
  [SPENDING_LIMIT_TABLE_BENEFICIARY_ID]: string
  [SPENDING_LIMIT_TABLE_SPENT_ID]: {
    spent: string
    amount: string
    tokenAddress: string
  }
  [SPENDING_LIMIT_TABLE_RESET_TIME_ID]: {
    relativeTime: string
    lastResetMin: string
    resetTimeMin: string
  }
}

export const getSpendingLimitData = (spendingLimits?: SpendingLimitRow[] | null): SpendingLimitTable[] | undefined =>
  spendingLimits?.map((spendingLimit) => ({
    [SPENDING_LIMIT_TABLE_BENEFICIARY_ID]: spendingLimit.delegate,
    [SPENDING_LIMIT_TABLE_SPENT_ID]: {
      spent: spendingLimit.spent,
      amount: spendingLimit.amount,
      tokenAddress: spendingLimit.token,
    },
    [SPENDING_LIMIT_TABLE_RESET_TIME_ID]: {
      relativeTime: relativeTime(spendingLimit.lastResetMin, spendingLimit.resetTimeMin),
      lastResetMin: spendingLimit.lastResetMin,
      resetTimeMin: spendingLimit.resetTimeMin,
    },
  }))

export const generateColumns = (): List<TableColumn> => {
  const beneficiaryColumn: TableColumn = {
    align: 'left',
    custom: false,
    disablePadding: false,
    id: SPENDING_LIMIT_TABLE_BENEFICIARY_ID,
    label: 'Beneficiary',
    order: false,
  }

  const spentColumn: TableColumn = {
    align: 'left',
    custom: false,
    disablePadding: false,
    id: SPENDING_LIMIT_TABLE_SPENT_ID,
    label: 'Spent',
    order: false,
    static: true,
  }

  const resetColumn: TableColumn = {
    align: 'left',
    custom: false,
    disablePadding: false,
    id: SPENDING_LIMIT_TABLE_RESET_TIME_ID,
    label: 'Reset Time',
    order: false,
    static: true,
  }

  const actionsColumn: TableColumn = {
    custom: true,
    disablePadding: false,
    id: SPENDING_LIMIT_TABLE_ACTION_ID,
    label: '',
    order: false,
  }

  return List([beneficiaryColumn, spentColumn, resetColumn, actionsColumn])
}
