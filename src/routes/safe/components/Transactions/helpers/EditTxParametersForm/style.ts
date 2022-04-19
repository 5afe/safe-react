import { lg, md, secondaryText, sm } from 'src/theme/variables'
import { createStyles } from '@material-ui/core'

export const styles = createStyles({
  annotation: {
    letterSpacing: '-1px',
    color: secondaryText,
    marginRight: 'auto',
    marginLeft: '20px',
  },
  container: {
    padding: `${md} ${lg}`,
  },
  amount: {
    marginLeft: sm,
  },
  address: {
    marginRight: sm,
  },
  buttonRow: {
    height: '52px',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
  },
})
