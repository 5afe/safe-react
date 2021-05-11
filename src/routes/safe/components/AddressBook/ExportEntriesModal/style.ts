import { createStyles, makeStyles } from '@material-ui/core/styles'

import { lg, md, background } from 'src/theme/variables'

export const useStyles = makeStyles(
  createStyles({
    heading: {
      padding: lg,
      justifyContent: 'space-between',
      boxSizing: 'border-box',
    },
    manage: {
      fontSize: lg,
    },
    imageContainer: {
      padding: `${md} ${lg}`,
      justifyContent: 'center',
    },
    close: {
      height: '35px',
      width: '35px',
    },
    buttonRow: {
      height: '84px',
      justifyContent: 'center',
    },
    downloader: {
      display: 'flex',
      flex: 1,
      justifyContent: 'center',
    },
    loader: {
      marginRight: '5px',
    },
    info: {
      backgroundColor: background,
      flexDirection: 'column',
      justifyContent: 'center',
      padding: lg,
      textAlign: 'center',
    },
  }),
)
