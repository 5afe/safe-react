// @flow
import { border, fontColor, lg, secondaryText, smallFontSize, xl } from '~/theme/variables'

export const styles = () => ({
  ownersText: {
    color: secondaryText,
    '& b': {
      color: fontColor,
    },
  },
  container: {
    padding: lg,
  },
  buttonRow: {
    padding: lg,
    position: 'absolute',
    left: 0,
    bottom: 0,
    boxSizing: 'border-box',
    width: '100%',
    justifyContent: 'flex-end',
    borderTop: `2px solid ${border}`,
  },
  modifyBtn: {
    height: xl,
    fontSize: smallFontSize,
  },
})
