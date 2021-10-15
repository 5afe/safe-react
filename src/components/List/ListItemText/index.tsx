import { createStyles, withStyles } from '@material-ui/core/styles'
import * as React from 'react'

import MuiListItemText from '@material-ui/core/ListItemText'

const styles = createStyles({
  itemTextSecondary: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
})

class ListItemText extends React.PureComponent<any> {
  render() {
    const { classes, cut = false, primary, secondary } = this.props

    const cutStyle = cut
      ? {
          secondary: classes.itemTextSecondary,
        }
      : undefined

    return <MuiListItemText classes={cutStyle} inset primary={primary} secondary={secondary} />
  }
}

export default withStyles(styles)(ListItemText)
