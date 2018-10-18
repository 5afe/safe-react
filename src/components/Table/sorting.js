// @flow

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

export const stableSort = (array: any, cmp: any) => {
  const stabilizedThis = array.map((el, index) => [el, index])

  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0])
    if (order !== 0) {
      return order
    }

    return a[1] - b[1]
  })

  return stabilizedThis.map(el => el[0])
}

export type Order = 'asc' | 'desc'

export const getSorting = (order: Order, orderBy: string, orderProp: boolean) =>
  (order === 'desc' ? (a: any, b: any) => desc(a, b, orderBy, orderProp) : (a: any, b: any) => -desc(a, b, orderBy, orderProp))
