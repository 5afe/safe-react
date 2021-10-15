import { makeStyles, createStyles } from '@material-ui/core'

import { lg, md } from 'src/theme/variables'

export const useStyles = makeStyles(({ palette }) =>
  createStyles({
    container: {
      padding: lg,
    },
    hide: {
      '&:hover': {
        backgroundColor: palette.backgroundColor[palette.type],
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
      backgroundColor: palette.backgroundColor[palette.type],
      padding: `0 ${lg}`,
    },
  }),
)
