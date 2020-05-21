import {
  background,
  bolderFont,
  border,
  fontColor,
  largeFontSize,
  md,
  screenSm,
  secondary,
  sm,
  xs,
} from 'src/theme/variables'

const styles = () => ({
  menuOption: {
    alignItems: 'center',
    borderRight: `solid 1px ${border}`,
    boxSizing: 'border-box',
    cursor: 'pointer',
    flexGrow: '1',
    flexShrink: '1',
    fontSize: '13px',
    justifyContent: 'center',
    lineHeight: '1.2',
    minWidth: '0',
    padding: `${md} ${sm}`,
    width: '100%',

    [`@media (min-width: ${screenSm}px)`]: {
      borderRight: 'none',
      flexGrow: '0',
      fontSize: largeFontSize,
      justifyContent: 'flex-start',
      padding: `${md} 0 ${md} ${md}`,
    },
    '&:last-of-type': {
      borderRight: 'none',
    },
    '&:first-child': {
      borderTopLeftRadius: sm,
    },
    '& svg': {
      display: 'block',
      marginRight: xs,
      maxWidth: '16px',

      [`@media (min-width: ${screenSm}px)`]: {
        marginRight: sm,
      },
    },
    '& .fill': {
      fill: fontColor,
    },
  },
  active: {
    backgroundColor: background,
    color: secondary,
    fontWeight: bolderFont,
    '& .fill': {
      fill: secondary,
    },
  },
})

export default styles
