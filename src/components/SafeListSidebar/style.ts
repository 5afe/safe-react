import { makeStyles } from '@material-ui/core/styles'

import { headerHeight, md, mediumFontSize, screenSm, secondaryText, xs } from 'src/theme/variables'

const sidebarWidth = '400px'
const sidebarMarginLeft = '0px'
const sidebarMarginTop = '0px'
const sidebarPaddingTop = '3rem'
const sidebarBorderRadius = '0px'

const useSidebarStyles = makeStyles({
  sidebar: {
    borderRadius: sidebarBorderRadius,
    marginLeft: sidebarMarginLeft,
    top: sidebarMarginTop,
    width: sidebarWidth,
    zIndex: '99999',
    background: '#000',
  },
  sidebarPaper: {
    borderRadius: sidebarBorderRadius,
    background: '#000',
    marginTop: '-5rem',
    borderRight: '#06fc99 2px solid',
    paddingTop: sidebarPaddingTop,
    marginLeft: sidebarMarginLeft,
    maxHeight: '100vh',
    top: `calc(${headerHeight} + ${sidebarMarginTop})`,
    width: sidebarWidth,
    maxWidth: `calc(100% - ${sidebarMarginLeft} - ${sidebarMarginLeft})`,

    [`@media (min-width: ${screenSm}px)`]: {
      maxWidth: 'none',
    },
  },
  topComponents: {
    alignItems: 'center',
    flexFlow: 'column',
    paddingBottom: '30px',

    [`@media (min-width: ${screenSm}px)`]: {
      flexFlow: 'row',
      paddingBottom: '0',
    },
  },
  searchWrapper: {
    width: '100%',
    [`@media (min-width: ${screenSm}px)`]: {
      width: 'auto',
    },
  },
  divider: {
    display: 'none',
    [`@media (min-width: ${screenSm}px)`]: {
      display: 'block',
    },
  },
  spacer: {
    display: 'none',
    [`@media (min-width: ${screenSm}px)`]: {
      display: 'block',
    },
  },
  headerPlaceholder: {
    minHeight: headerHeight,
  },
  addSafeBtn: {
    fontSize: mediumFontSize,
  },
  searchIcon: {
    color: secondaryText,
    paddingLeft: md,
  },
  searchInput: {
    backgroundColor: 'transparent',
    lineHeight: 'initial',
    padding: 0,
    '& > input::placeholder': {
      letterSpacing: '-0.5px',
      fontSize: mediumFontSize,
      color: 'black',
    },
    '& > input': {
      letterSpacing: '-0.5px',
    },
  },
  searchContainer: {
    flexGrow: '1',
    marginLeft: xs,
    marginRight: xs,
    minWidth: '190px',
  },
  searchRoot: {
    letterSpacing: '-0.5px',
    border: 'none',
    boxShadow: 'none',
    flexGrow: '1',
    '& > button': {
      display: 'none',
    },
  },
  searchIconInput: {
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  },
} as any)

export default useSidebarStyles
