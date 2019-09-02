// @flow
import {
  sm, xs, smallFontSize, secondaryText,
} from '~/theme/variables'

export const styles = () => ({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  name: {
    marginLeft: sm,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  user: {
    justifyContent: 'left',
  },
  open: {
    paddingLeft: sm,
    width: 'auto',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  readonly: {
    fontSize: smallFontSize,
    letterSpacing: '0.5px',
    color: '#ffffff',
    backgroundColor: secondaryText,
    textTransform: 'uppercase',
    padding: `0 ${sm}`,
    marginLeft: sm,
    borderRadius: xs,
    lineHeight: '28px',
  },
  iconSmall: {
    fontSize: 16,
  },
  balance: {
    marginLeft: 'auto',
    overflow: 'hidden',
    borderRadius: '3px',
    padding: '20px',
  },
  receive: {
    width: '95px',
    minWidth: '95px',
    marginLeft: sm,
  },
  send: {
    width: '75px',
    minWidth: '75px',
  },
  leftIcon: {
    marginRight: sm,
  },
})
