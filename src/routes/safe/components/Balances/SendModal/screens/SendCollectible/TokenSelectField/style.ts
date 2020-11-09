import { sm } from 'src/theme/variables'
import { createStyles } from '@material-ui/core'

export const selectedTokenStyles = createStyles({
  container: {
    minHeight: '55px',
    padding: 0,
    width: '100%',
  },
  tokenData: {
    padding: 0,
    margin: 0,
    lineHeight: '14px',
  },
  tokenImage: {
    marginRight: sm,
  },
})

export const selectStyles = createStyles({
  selectMenu: {
    paddingRight: 0,
  },
  tokenImage: {
    marginRight: sm,
  },
})
