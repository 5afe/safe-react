import { createStyles, makeStyles } from '@material-ui/core'

import { lg, sm } from 'src/theme/variables'

export const useStyles = makeStyles(
  createStyles({
    formContainer: {
      minHeight: '420px',
    },
    title: {
      padding: lg,
      paddingBottom: 0,
    },
    annotation: {
      paddingLeft: lg,
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
    editOwnerIcon: {
      cursor: 'pointer',
    },
    replaceOwnerIcon: {
      marginLeft: lg,
      cursor: 'pointer',
    },
    controlsRow: {
      backgroundColor: 'white',
      padding: lg,
      borderRadius: sm,
    },
    removeOwnerIcon: {
      marginLeft: lg,
      cursor: 'pointer',
    },
  }),
)
