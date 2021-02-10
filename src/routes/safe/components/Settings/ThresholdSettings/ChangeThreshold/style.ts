import { background, lg, md, secondaryText, sm } from 'src/theme/variables'
import { createStyles } from '@material-ui/core'

export const styles = createStyles({
  heading: {
    padding: `${sm} ${lg}`,
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    height: '74px',
  },
  annotation: {
    letterSpacing: '-1px',
    color: secondaryText,
    marginRight: 'auto',
    marginLeft: '20px',
  },
  headingText: {
    fontSize: '20px',
  },
  close: {
    height: '35px',
    width: '35px',
  },
  modalContent: {
    padding: `${md} ${lg}`,
  },
  ownersText: {
    marginLeft: sm,
  },
  buttonRow: {
    height: '84px',
    justifyContent: 'center',
    position: 'relative',
    bottom: 0,
    width: '100%',
  },
  inputRow: {
    position: 'relative',
  },
  errorText: {
    position: 'absolute',
    bottom: '-25px',
  },
  gasCostsContainer: {
    backgroundColor: background,
    padding: `${sm} ${lg}`,
  },
})
