import { lg, md, secondaryText } from 'src/theme/variables'
import { createStyles } from '@material-ui/core'

export const styles = createStyles({
  heading: {
    padding: `${md} ${lg} 12px`,
    justifyContent: 'flex-start',
    boxSizing: 'border-box',
    maxHeight: '74px',
    flexWrap: 'nowrap',
  },
  annotation: {
    letterSpacing: '-1px',
    color: secondaryText,
    marginRight: 'auto',
    marginLeft: '20px',
    whiteSpace: 'nowrap',
    flex: 1,
  },
  headingText: {
    fontSize: lg,
    whiteSpace: 'nowrap',
  },
  closeIcon: {
    height: '35px',
    width: '35px',
  },
  chainIndicator: {
    padding: `0 ${md}`,
    height: '20px',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  icon: {
    width: '20px',
    marginRight: '10px',
  },
})
