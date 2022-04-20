import { createStyles } from '@material-ui/core/styles'
import { border, lg, sm } from 'src/theme/variables'

export const styles = createStyles({
  formContainer: {
    padding: lg,
  },
  root: {
    display: 'flex',
    maxWidth: '480px',
  },
  controlsRow: {
    borderTop: `2px solid ${border}`,
    padding: lg,
    marginTop: sm,
  },
})
