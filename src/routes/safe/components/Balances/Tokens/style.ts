import { lg, md } from 'src/theme/variables'
import { createStyles } from '@material-ui/core'

export const styles = createStyles({
  heading: {
    padding: `${md} ${lg}`,
    justifyContent: 'space-between',
    maxHeight: '75px',
    boxSizing: 'border-box',
  },
  close: {
    height: '35px',
    width: '35px',
  },
})
