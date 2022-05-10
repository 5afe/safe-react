import { lg, md } from 'src/theme/variables'
import { createStyles } from '@material-ui/core'

export const styles = createStyles({
  formContainer: {
    padding: `${md} ${lg}`,
    minHeight: '340px',
  },
  buttonRow: {
    height: '84px',
    justifyContent: 'center',
    gap: '16px',
  },
})
