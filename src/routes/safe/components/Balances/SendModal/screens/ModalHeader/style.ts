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
    color: secondaryText,
    marginRight: 'auto',
    marginLeft: '8px',
    whiteSpace: 'nowrap',
    flex: 1,
  },
  headingText: {
    whiteSpace: 'nowrap',
  },
  closeIcon: {
    height: '24px',
    width: '24px',
  },
  icon: {
    width: '20px',
    marginRight: '10px',
  },
})
