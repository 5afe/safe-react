import { md, screenSm, xs } from 'src/theme/variables'
import { createStyles } from '@material-ui/core'

export const styles = createStyles({
  controls: {
    alignItems: 'center',
    boxSizing: 'border-box',
    justifyContent: 'space-between',
    minHeight: '56px',
    padding: `${md} 0`,
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
  send: {
    width: '75px',
    minWidth: '75px',
    borderRadius: xs,
    '& > span': {
      fontSize: '14px',
    },
  },
})
