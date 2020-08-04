import { List } from 'immutable'

export const FIXED = 'fixed'

export const buildOrderFieldFrom = (attr: string): string => `${attr}Order`

const desc = (a: string, b: string, orderBy: string, orderProp: boolean): number => {
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
export const stableSort = (dataArray, cmp, fixed) => {
  const fixedElems = fixed ? dataArray.filter((elem) => elem.fixed) : List([])
  const data = fixed ? dataArray.filter((elem) => !elem[FIXED]) : dataArray
  let stabilizedThis = data.map((el, index) => [el, index])

  stabilizedThis = stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0])

    if (order !== 0) {
      return order
    }

    return a[1] - b[1]
  })

  const sortedElems = stabilizedThis.map((el) => el[0])

  return fixedElems.concat(sortedElems)
}

export const getSorting = (
  order: 'desc' | 'asc',
  orderBy: string,
  orderProp: boolean,
): ((a: string, b: string) => number) =>
  order === 'desc' ? (a, b) => desc(a, b, orderBy, orderProp) : (a, b) => -desc(a, b, orderBy, orderProp)
