import { background, lg, md, secondaryText, sm } from 'src/theme/variables'
import { createStyles } from '@material-ui/core'

export const styles = createStyles({
  heading: {
    padding: `${md} ${lg}`,
    justifyContent: 'flex-start',
    boxSizing: 'border-box',
    maxHeight: '74px',
  },
  annotation: {
    letterSpacing: '-1px',
    color: secondaryText,
    marginRight: 'auto',
    marginLeft: '20px',
  },
  headingText: {
    fontSize: lg,
  },
  closeIcon: {
    height: '35px',
    width: '35px',
  },
  container: {
    padding: `${md} ${lg}`,
  },
  amount: {
    marginLeft: sm,
  },
  buttonRow: {
    height: '84px',
    justifyContent: 'center',
    gap: '16px',
  },
  gasCostsContainer: {
    backgroundColor: background,
    padding: `0 ${lg}`,
  },
})
