import { createStyles, makeStyles } from '@material-ui/core'

import { background, lg, md, sm } from 'src/theme/variables'

export const useStyles = makeStyles(
  createStyles({
    container: {
      padding: lg,
    },
    hide: {
      '&:hover': {
        backgroundColor: '#f7f5f5',
      },
      '&:hover $actions': {
        visibility: 'initial',
      },
    },
    actions: {
      justifyContent: 'flex-end',
      visibility: 'hidden',
      minWidth: '100px',
    },
    noBorderBottom: {
      '& > td': {
        borderBottom: 'none',
      },
    },
    modalHeading: {
      boxSizing: 'border-box',
      justifyContent: 'space-between',
      height: '74px',
      padding: `${sm} ${lg}`,
    },
    modalManage: {
      fontSize: lg,
    },
    modalClose: {
      height: '35px',
      width: '35px',
    },
    modalOwner: {
      padding: md,
      alignItems: 'center',
    },
    modalDescription: {
      padding: md,
    },
    accordionContainer: {
      margin: `0 ${md}`,
    },
    gasCostsContainer: {
      backgroundColor: background,
      padding: `0 ${lg}`,
    },
  }),
)
