import { screenSm, sm } from 'src/theme/variables'
import { createStyles } from '@material-ui/core'

export const styles = createStyles({
  receiveModal: {
    height: 'auto',
    maxWidth: 'calc(100% - 30px)',
    minHeight: '544px',
    overflow: 'hidden',
  },
  receive: {
    borderRadius: '4px',
    marginLeft: sm,
    width: '50%',

    '& > span': {
      fontSize: '14px',
    },
    [`@media (min-width: ${screenSm}px)`]: {
      minWidth: '95px',
      width: 'auto',
    },
  },
})
