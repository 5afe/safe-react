import { lg, md, sm, xl, xs } from 'src/theme/variables'

export const getSize = (size) => {
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
      return '0px'
  }
}
