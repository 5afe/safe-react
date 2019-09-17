// @flow
import { makeStyles } from '@material-ui/core/styles'
import { headerHeight } from '~/theme/variables'

const sidebarWidth = '400px'

const useSidebarStyles = makeStyles({
  sidebar: {
    width: sidebarWidth,
  },
  sidebarPaper: {
    width: sidebarWidth,
  },
  headerPlaceholder: {
    height: headerHeight, // for some reason it didn't want to work with an imported variable 🤔
  },
})

export default useSidebarStyles
