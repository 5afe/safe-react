// @flow
import {
  sm, xs, smallFontSize, secondaryText, secondary,
} from '~/theme/variables'

export const styles = () => ({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  name: {
    marginLeft: sm,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  address: {
    marginRight: sm,
  },
  user: {
    justifyContent: 'left',
  },
  receiveModal: {
    height: '544px',
  },
  open: {
    paddingLeft: sm,
    width: 'auto',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  readonly: {
    fontSize: smallFontSize,
    letterSpacing: '0.5px',
    color: '#ffffff',
    backgroundColor: secondaryText,
    textTransform: 'uppercase',
    padding: `0 ${sm}`,
    marginLeft: sm,
    borderRadius: xs,
    lineHeight: '28px',
  },
  iconSmall: {
    fontSize: 16,
  },
  balance: {
    marginLeft: 'auto',
    overflow: 'hidden',
  },
  receive: {
    width: '95px',
    minWidth: '95px',
    marginLeft: sm,
    borderRadius: '4px',
    '& > span': {
      fontSize: '14px',
    },
  },
  send: {
    width: '75px',
    minWidth: '75px',
    borderRadius: '4px',
    '& > span': {
      fontSize: '14px',
    },
  },
  leftIcon: {
    marginRight: sm,
  },
  tabWrapper: {
    display: 'flex',
    flexDirection: 'row',
    '& svg': {
      display: 'block',
      marginRight: '5px',
    },
    '& .fill': {
      fill: 'rgba(0, 0, 0, 0.54)',
    },
  },
  tabWrapperSelected: {
    '& .fill': {
      fill: secondary,
    },
  },
})
