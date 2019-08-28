// @flow
import {
  fontColor, lg, smallFontSize, md, border,
} from '~/theme/variables'

export const styles = () => ({
  ownersText: {
    fontSize: '26px',
    color: '#B2B5B2',
    '& b': {
      color: fontColor,
    },
  },
  container: {
    height: '100%',
    position: 'relative',
    padding: lg,
  },
  buttonRow: {
    position: 'absolute',
    bottom: '51px',
    left: 0,
    height: '51px',
    width: '100%',
    paddingRight: md,
    display: 'flex',
    justifyContent: 'flex-end',
    borderTop: `solid 1px ${border}`,
    boxSizing: 'border-box',
  },
  modifyBtn: {
    height: '32px',
    fontSize: smallFontSize,
  },
})
