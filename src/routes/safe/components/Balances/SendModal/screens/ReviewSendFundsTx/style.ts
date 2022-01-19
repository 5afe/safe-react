import { lg, md } from 'src/theme/variables'
import { createStyles } from '@material-ui/core'

export const styles = createStyles({
  container: {
    padding: `${md} ${lg}`,
  },
  buttonRow: {
    height: '84px',
    justifyContent: 'center',
    gap: '16px',
  },
})
