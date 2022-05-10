import { makeStyles } from '@material-ui/core/styles'

const buttonWidth = '140px'
export const useButtonStyles = makeStyles({
  button: {
    borderRadius: '4px',
    boxSizing: 'border-box',
    color: '#5d6d74',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'normal',
    lineHeight: '1.5',
    marginRight: '20px',
    minWidth: (props: any) => (props.buttonWidth ? props.buttonWidth : buttonWidth),
    outline: 'none',
    padding: '16px',
    textAlign: 'left',
    '&:active': {
      opacity: '0.8',
    },
  },
  buttonInner: {
    boxSizing: 'border-box',
    display: 'block',
    height: '100%',
    lineHeight: '24px',
    position: 'relative',
    padding: '0 !important',
    width: '100%',
    '&::after': {
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      borderTop: '5px solid #5d6d74',
      content: '""',
      height: '0',
      position: 'absolute',
      right: '8px',
      top: '9px',
      width: '0',
    },
  },
  openMenuButton: {
    '&::after': {
      borderBottom: '5px solid #5d6d74',
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      borderTop: 'none',
    },
  },
})
