import { makeStyles, createStyles } from '@material-ui/core'

import { border, lg, sm } from 'src/theme/variables'

export const useStyles = makeStyles(({ palette }) =>
  createStyles({
    root: {
      height: '372px',
    },
    info: {
      backgroundColor: palette.backgroundColor[palette.type],
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
    selectedOwnerRemoved: {
      padding: sm,
      alignItems: 'center',
      backgroundColor: palette.rejection[palette.type],
    },
    selectedOwnerAdded: {
      padding: sm,
      alignItems: 'center',
      backgroundColor: palette.backgroundColor[palette.type],
    },
    gasCostsContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      width: '100%',
      backgroundColor: palette.backgroundColor[palette.type],
    },
  }),
)
