import { createStyles, makeStyles } from '@material-ui/core'

import { background, border, lg, secondaryText, sm } from 'src/theme/variables'

export const useStyles = makeStyles(
  createStyles({
    root: {
      height: '372px',
    },
    heading: {
      padding: `${sm} ${lg}`,
      justifyContent: 'flex-start',
      boxSizing: 'border-box',
      height: '74px',
    },
    annotation: {
      lineHeight: 'normal',
      color: secondaryText,
      marginRight: 'auto',
      marginLeft: '20px',
    },
    manage: {
      fontSize: lg,
    },
    closeIcon: {
      height: '35px',
      width: '35px',
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
      padding: lg,
    },
    owner: {
      padding: sm,
      alignItems: 'center',
    },
    name: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
    selectedOwner: {
      padding: sm,
      alignItems: 'center',
      backgroundColor: '#ffe6ea',
    },
    gasCostsContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      width: '100%',
      backgroundColor: background,
    },
  }),
)
