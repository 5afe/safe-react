import { sm, xs } from 'src/theme/variables'
import { createStyles } from '@material-ui/core'

export const styles = createStyles({
  iconSmall: {
    fontSize: 16,
  },
  tooltipInfo: {
    position: 'relative',
    top: '3px',
    left: '3px',
  },
  hide: {
    '&:hover': {
      backgroundColor: '#fff3e2',
    },
    '&:hover $actions': {
      visibility: 'initial',
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
