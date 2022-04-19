import { background, sm } from 'src/theme/variables'
import { createStyles } from '@material-ui/core'

export const styles = createStyles({
  loaderContainer: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    backgroundColor: background,
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
})
