//
import MuiListItemText from '@material-ui/core/ListItemText'
import { withStyles } from '@material-ui/core/styles'
import * as React from 'react'

import {} from 'src/theme/mui'

const styles = {
  itemTextSecondary: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
}

class ListItemText extends React.PureComponent {
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
