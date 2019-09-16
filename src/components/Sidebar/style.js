// @flow
import { makeStyles } from '@material-ui/core/styles'
import { headerHeight } from '~/components/Header/component/Layout'

const sidebarWidth = '400px'

const useSidebarStyles = makeStyles({
  sidebar: {
    width: sidebarWidth,
  },
  sidebarPaper: {
    width: sidebarWidth,
  },
  headerPlaceholder: {
    height: headerHeight,
  },
})

export default useSidebarStyles
