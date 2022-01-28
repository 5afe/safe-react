import { lg, md, sm, xs, secondaryText, border, smallFontSize } from 'src/theme/variables'
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
  chainIndicator: {
    fontSize: `${smallFontSize}`,
    padding: `${xs} ${sm}`,
    backgroundColor: `${border}`,
    borderRadius: '4px',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    marginRight: '20px',
  },
  icon: {
    width: '20px',
    marginRight: '10px',
  },
})
