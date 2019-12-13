// @flow
import { makeStyles } from '@material-ui/core/styles'
import {
  xs, mediumFontSize, secondaryText, md,
} from '~/theme/variables'

const sidebarWidth = '400px'
const sidebarMarginLeft = '12px'
const sidebarMarginTop = '67px'
const sidebarBorderRadius = '8px'

const useSidebarStyles = makeStyles({
  sidebar: {
    width: sidebarWidth,
    marginLeft: sidebarMarginLeft,
    borderRadius: sidebarBorderRadius,
    top: sidebarMarginTop,
  },
  sidebarPaper: {
    width: sidebarWidth,
    marginLeft: sidebarMarginLeft,
    maxHeight: '902px',
    borderRadius: sidebarBorderRadius,
    top: sidebarMarginTop,
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
    width: '180px',
    marginLeft: xs,
    marginRight: xs,
  },
  searchRoot: {
    letterSpacing: '-0.5px',
    border: 'none',
    boxShadow: 'none',
    '& > button': {
      display: 'none',
    },
  },
  searchIconInput: {
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  },
})

export default useSidebarStyles
