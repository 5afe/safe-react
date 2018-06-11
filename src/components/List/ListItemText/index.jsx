// @flow
import * as React from 'react'
import ListItemText from '@material-ui/core/ListItemText'
import { withStyles } from '@material-ui/core/styles'
import { type WithStyles } from '~/theme/mui'

type Props = WithStyles & {
  primary: string,
  secondary: string,
  cut?: boolean,
}

const styles = {
  itemTextSecondary: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
}

const GnoListItemText = ({
  primary, secondary, classes, cut = false,
}: Props) => {
  const cutStyle = cut ? {
    secondary: classes.itemTextSecondary,
  } : undefined

  return (
    <ListItemText
      classes={cutStyle}
      inset
      primary={primary}
      secondary={secondary}
    />
  )
}

export default withStyles(styles)(GnoListItemText)
