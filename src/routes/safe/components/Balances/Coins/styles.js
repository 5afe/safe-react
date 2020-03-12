// @flow
import { sm, xs } from '~/theme/variables'

export const styles = () => ({
  iconSmall: {
    fontSize: 16,
  },
  hide: {
    '&:hover': {
      backgroundColor: '#fff3e2',
    },
    '&:focus $actions': {
      visibility: 'initial',
    },
  },
  actions: {
    justifyContent: 'flex-end',
    visibility: 'hidden',
  },
  receive: {
    width: '95px',
    minWidth: '95px',
    marginLeft: sm,
    borderRadius: xs,
    '& > span': {
      fontSize: '14px',
    },
  },
  send: {
    width: '75px',
    minWidth: '75px',
    borderRadius: xs,
    '& > span': {
      fontSize: '14px',
    },
  },
  leftIcon: {
    marginRight: sm,
  },
  currencyValueRow: {
    maxWidth: '125px',
    textAlign: 'right',
  },
})
