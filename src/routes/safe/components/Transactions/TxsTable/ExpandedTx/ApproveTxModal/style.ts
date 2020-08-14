import { createStyles } from '@material-ui/core'
import { border, lg, md, sm } from 'src/theme/variables'

export const styles = createStyles({
  heading: {
    padding: `${sm} ${lg}`,
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    maxHeight: '75px',
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
  buttonRow: {
    height: '84px',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTop: `1px solid ${border}`,
  },
  nonceNumber: {
    marginTop: sm,
    fontSize: md,
  },
})
