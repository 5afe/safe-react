// @flow
import { xs, sm, md, secondary, screenSm } from '~/theme/variables'

export const styles = (theme: Object) => ({
  root: {
    marginRight: sm,
    width: '20px',
  },
  controls: {
    alignItems: 'center',
    boxSizing: 'border-box',
    justifyContent: 'space-between',
    padding: `${md} 0`,
  },
  assetTabs: {
    alignItems: 'center',
    display: 'flex',
    order: '2',

    [`@media (min-width: ${screenSm}px)`]: {
      order: '1',
    },
  },
  assetDivider: {
    borderRightColor: `${secondary} !important`,
    height: '18px !important',
  },
  assetTabActive: {
    textDecoration: 'none',
  },
  tokenControls: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    order: '1',
    padding: '0 0 10px',

    [`@media (min-width: ${screenSm}px)`]: {
      justifyContent: 'flex-end',
      order: '2',
      padding: '0',
    },
  },
  manageTokensButton: {
    marginLeft: 'auto',

    [`@media (min-width: ${screenSm}px)`]: {
      marginLeft: '0',
    },
  },
  actionIcon: {
    marginRight: theme.spacing(1),
  },
  iconSmall: {
    fontSize: 16,
  },
  receiveModal: {
    height: 'auto',
    maxWidth: 'calc(100% - 30px)',
    minHeight: '544px',
    overflow: 'hidden',
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
  links: {
    textDecoration: 'underline',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  currencyValueRow: {
    maxWidth: '125px',
    textAlign: 'right',
  },
})
