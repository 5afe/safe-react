// @flow
import { List } from 'immutable'

export const FIXED = 'fixed'
type Fixed = {
  fixed?: boolean,
}

export type SortRow<T> = T & Fixed

export const buildOrderFieldFrom = (attr: string) => `${attr}Order`

const desc = (a: Object, b: Object, orderBy: string, orderProp: boolean) => {
  const order = orderProp ? buildOrderFieldFrom(orderBy) : orderBy

  if (b[order] < a[order]) {
    return -1
  }
  if (b[order] > a[order]) {
    return 1
  }

  return 0
}

// eslint-disable-next-line
export const stableSort = (dataArray: List<any>, cmp: any, fixed: boolean): List<any> => {
  const fixedElems: List<any> = fixed ? dataArray.filter((elem: any) => elem.fixed) : List([])
  const data: List<any> = fixed ? dataArray.filter((elem: any) => !elem[FIXED]) : dataArray
  let stabilizedThis = data.map((el, index) => [el, index])

  stabilizedThis = stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0])

    if (order !== 0) {
      return order
    }

    return a[1] - b[1]
  })

  const sortedElems: List<any> = stabilizedThis.map((el) => el[0])

  return fixedElems.concat(sortedElems)
}

export type Order = 'asc' | 'desc'

export const getSorting = (order: Order, orderBy: string, orderProp: boolean) =>
  order === 'desc'
    ? (a: any, b: any) => desc(a, b, orderBy, orderProp)
    : (a: any, b: any) => -desc(a, b, orderBy, orderProp)
