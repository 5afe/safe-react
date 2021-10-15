import { makeStyles, createStyles } from '@material-ui/core'

import { lg, secondaryText, sm } from 'src/theme/variables'

export const useStyles = makeStyles(({ palette }) =>
  createStyles({
    heading: {
      padding: lg,
      justifyContent: 'space-between',
      maxHeight: '75px',
      boxSizing: 'border-box',
    },
    loaderContainer: {
      width: '100%',
      height: '100%',
    },
    close: {
      height: '25px',
      width: '25px',
      color: secondaryText,
    },
    detailsContainer: {
      backgroundColor: palette.backgroundColor[palette.type],
      maxHeight: '450px',
    },
    buttonRow: {
      height: '84px',
      justifyContent: 'center',
    },
    button: {
      '&:last-child': {
        marginLeft: sm,
      },
    },
  }),
)
