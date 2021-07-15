import { md, screenSm, xs } from 'src/theme/variables'
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
  breadCrumb: {
    padding: '0 !important',
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
  send: {
    width: '75px',
    minWidth: '75px',
    borderRadius: xs,
    '& > span': {
      fontSize: '14px',
    },
  },
})
