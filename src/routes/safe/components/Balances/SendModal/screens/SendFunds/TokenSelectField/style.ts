import { createStyles, makeStyles } from '@material-ui/core'

import { sm } from 'src/theme/variables'

export const useSelectedTokenStyles = makeStyles(
  createStyles({
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
  }),
)

export const useSelectStyles = makeStyles(
  createStyles({
    selectMenu: {
      paddingRight: 0,
    },
  }),
)
