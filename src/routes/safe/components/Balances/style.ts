import { md, screenSm, secondary, xs } from 'src/theme/variables'
import { createStyles } from '@material-ui/core'

export const styles = createStyles({
  controls: {
    alignItems: 'center',
    boxSizing: 'border-box',
    justifyContent: 'space-between',
    padding: `${md} 0`,
  },
  assetTabs: {
    alignItems: 'center',
    display: 'flex',
    order: 2,

    [`@media (min-width: ${screenSm}px)`]: {
      order: '1',
    },
  },
  assetDivider: {
    borderRightColor: `${secondary} !important`,
    height: '18px !important',
  },
  assetTab: {
    color: '#686868',
    margin: '2px 0',
    padding: '0 10px',
    textDecoration: 'underline',

    '&:hover': {
      cursor: 'pointer',
    },
  },
  assetTabActive: {
    color: secondary,
    fontWeight: 'bold',
    margin: '2px 0',
    padding: '0 10px',
    textDecoration: 'none',
  },
  tokenControls: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    order: 1,
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
  receiveModal: {
    height: 'auto',
    maxWidth: 'calc(100% - 30px)',
    minHeight: '544px',
    overflow: 'hidden',
  },
  send: {
    width: '75px',
    minWidth: '75px',
    borderRadius: xs,
    '& > span': {
      fontSize: '14px',
    },
  },
})
