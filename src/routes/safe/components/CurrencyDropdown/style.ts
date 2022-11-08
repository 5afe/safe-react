import { makeStyles } from '@material-ui/core/styles'

const buttonWidth = '140px'
export const useDropdownStyles = makeStyles({
  listItem: {
    maxWidth: (props: any) => (props.buttonWidth ? props.buttonWidth : buttonWidth),
    boxSizing: 'border-box',
    background: 'black',
    //needs to add correct border here
  },
  listItemSearch: {
    maxWidth: (props: any) => (props.buttonWidth ? props.buttonWidth : buttonWidth),
    padding: '0',
    boxSizing: 'border-box',
  },
  localFlag: {
    backgroundPosition: '50% 50%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    height: '20px !important',
    width: '26px !important',
  },
  etherFlag: {
    backgroundPosition: '50% 50%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    width: '26px',
    height: '26px',
  },
  iconLeft: {
    marginRight: '10px',
  },
  iconRight: {
    marginLeft: '18px',
  },
  button: {
    backgroundColor: '#000',
    border: 'none',
    borderRadius: '3px',
    boxSizing: 'border-box',
    color: '#05de87',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'normal',
    height: '24px',
    width: '30px',
    lineHeight: '1.33',
    marginRight: '20px',
    minWidth: "80px", // this should be enough for any 3 letter text
    outline: 'none',
    padding: '0',
    textAlign: 'left',
    '&:active': {
      opacity: '0.8',
    },
  },
  buttonInner: {
    boxSizing: 'border-box',
    display: 'block',
    height: '100%',
    fontSize: '12px',
    lineHeight: '24px',
    padding: '0 22px 0 8px',
    position: 'relative',
    width: '100%',
    '&::after': {
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      borderTop: '5px solid #05de87',
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
      borderBottom: '5px solid #05de87',
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      borderTop: 'none',
    },
  },
  dropdownItemsScrollWrapper: {
    maxHeight: '280px',
    overflow: 'auto',
  },
  search: {
    position: 'relative',
    borderRadius: '0',
    background: '#000',
    marginRight: 0,
    width: '100%',
    border: '2px solid #05de87',
  },
  searchIcon: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    left: '12px',
    margin: '0',
    pointerEvents: 'none',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '18px',
    '& path': {
      fill: '#05de87',
    },
  },
  inputRoot: {
    color: '#05de87',
    fontSize: '14px',
    fontWeight: 'normal',
    lineHeight: '1.43',
    width: '100%',
  },
  inputInput: {
    boxSizing: 'border-box',
    height: '44px',
    padding: '12px 12px 12px 40px',
    width: '100%',
  },
})
