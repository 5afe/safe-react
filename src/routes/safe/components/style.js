// @flow
import { sm, xs, smallFontSize } from '~/theme/variables'

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
    backgroundColor: '#a2a8ba',
    fontFamily: 'Roboto Mono, monospace',
    textTransform: 'uppercase',
    padding: `0 ${sm}`,
    marginLeft: sm,
    borderRadius: xs,
    lineHeight: '28px',
  },
  balance: {
    marginLeft: 'auto',
    overflow: 'hidden',
    border: '1px solid #c8ced4',
    borderRadius: '3px',
    padding: '20px',
  },
  receive: {
    width: '95px',
  },
  send: {
    width: '70px',
    marginLeft: sm,
  },
  leftIcon: {
    marginRight: xs,
  },
})
