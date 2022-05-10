import { createStyles, makeStyles } from '@material-ui/core'

import { background, lg, md } from 'src/theme/variables'

export const useStyles = makeStyles(
  createStyles({
    container: {
      padding: lg,
    },
    hide: {
      '&:hover': {
        backgroundColor: `${background}`,
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
  }),
)
