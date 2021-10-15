import { makeStyles, createStyles } from '@material-ui/core/styles'

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
    buttonRow: {
      height: '84px',
      justifyContent: 'center',
      gap: '16px',
    },
    details: {
      padding: lg,
      borderRight: `solid 2px ${border}`,
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
      backgroundColor: palette.backgroundColor[palette.type],
    },
    open: {
      paddingLeft: sm,
      width: 'auto',
      '&:hover': {
        cursor: 'pointer',
      },
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
