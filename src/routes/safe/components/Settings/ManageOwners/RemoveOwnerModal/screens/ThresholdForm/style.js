// @flow
import { lg, md, sm, secondaryText, } from '~/theme/variables'

export const styles = () => ({
  heading: {
    padding: `${sm} ${lg}`,
    justifyContent: 'flex-start',
    boxSizing: 'border-box',
    maxHeight: '75px',
  },
  annotation: {
    letterSpacing: '-1px',
    color: secondaryText,
    marginRight: 'auto',
    marginLeft: '20px',
  },
  manage: {
    fontSize: '24px',
  },
  closeIcon: {
    height: '35px',
    width: '35px',
  },
  headingText: {
    fontSize: '16px',
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
