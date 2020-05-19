import { lg, md, secondaryText, sm } from 'src/theme/variables'

export const styles = () => ({
  heading: {
    padding: `${sm} ${lg}`,
    justifyContent: 'flex-start',
    boxSizing: 'border-box',
    maxHeight: '75px',
  },
  annotation: {
    color: secondaryText,
    marginRight: 'auto',
    marginLeft: '20px',
    lineHeight: 'normal',
  },
  manage: {
    fontSize: lg,
  },
  closeIcon: {
    height: '35px',
    width: '35px',
  },
  headingText: {
    fontSize: md,
  },
  formContainer: {
    padding: `${md} ${lg}`,
    minHeight: '340px',
  },
  ownersText: {
    marginLeft: sm,
  },
  buttonRow: {
    height: '84px',
    justifyContent: 'center',
  },
  inputRow: {
    position: 'relative',
  },
  errorText: {
    position: 'absolute',
    bottom: '-25px',
  },
})
