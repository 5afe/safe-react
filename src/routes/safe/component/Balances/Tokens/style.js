// @flow
import {
  lg, md, sm, xs, mediumFontSize, border,
} from '~/theme/variables'

export const styles = () => ({
  root: {
    minHeight: '143px',
  },
  heading: {
    padding: `${md} ${lg}`,
    justifyContent: 'space-between',
  },
  manage: {
    fontSize: '24px',
  },
  actions: {
    height: '50px',
  },
  close: {
    height: '35px',
    width: '35px',
  },
  search: {
    color: '#a2a8ba',
    paddingLeft: sm,
  },
  padding: {
    padding: `0 ${md}`,
  },
  add: {
    fontWeight: 'normal',
    paddingRight: md,
    paddingLeft: md,
  },
  list: {
    overflow: 'hidden',
    overflowY: 'scroll',
    padding: 0,
  },
  token: {
    minHeight: '50px',
    borderBottom: `1px solid ${border}`,
  },
  searchInput: {
    backgroundColor: 'transparent',
    lineHeight: 'initial',
    fontSize: mediumFontSize,
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
    fontFamily: 'Roboto Mono, monospace',
    fontSize: mediumFontSize,
    border: 'none',
    boxShadow: 'none',
  },
  searchIcon: {
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  },
})
