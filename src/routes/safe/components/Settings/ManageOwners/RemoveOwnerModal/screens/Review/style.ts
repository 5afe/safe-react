import { createStyles, makeStyles } from '@material-ui/core'

import { background, border, lg, sm } from 'src/theme/variables'

export const useStyles = makeStyles(
  createStyles({
    root: {
      height: '372px',
    },
    info: {
      backgroundColor: background,
      padding: sm,
      justifyContent: 'center',
      textAlign: 'center',
      flexDirection: 'column',
    },
    details: {
      padding: lg,
      borderRight: `solid 1px ${border}`,
      height: '100%',
    },
    owners: {
      overflow: 'auto',
      height: '100%',
    },
    ownersTitle: {
      padding: `${sm} ${lg}`,
    },
    owner: {
      padding: `${sm} ${lg}`,
      alignItems: 'center',
    },
    name: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
    selectedOwner: {
      padding: `${sm} ${lg}`,
      alignItems: 'center',
      backgroundColor: '#ffe6ea',
    },
  }),
)
