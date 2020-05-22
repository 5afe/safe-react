import { screenSm, sm } from 'src/theme/variables'

export const styles = () => ({
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
