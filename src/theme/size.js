// @flow
import { xs, sm, md, lg, xl } from '~/theme/variables'

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export const getSize = (size: Size) => {
  switch (size) {
  case 'xs':
    return xs
  case 'sm':
    return sm
  case 'md':
    return md
  case 'lg':
    return lg
  case 'xl':
    return xl
  default:
    return md
  }
}
