import { lg, md, secondaryText, sm } from 'src/theme/variables'

export const styles = () => ({
  heading: {
    padding: `${sm} ${lg}`,
    justifyContent: 'flex-start',
    boxSizing: 'border-box',
    maxHeight: '75px',
  },
  annotation: {
    lineHeight: 'normal',
    color: secondaryText,
    marginRight: 'auto',
    marginLeft: '20px',
  },
  manage: {
    fontSize: lg,
  },
  closeIcon: {
    height: '35px',
    width: '35px',
  },
  formContainer: {
    padding: `${md} ${lg}`,
    minHeight: '340px',
  },
  buttonRow: {
    height: '84px',
    justifyContent: 'center',
  },
})
