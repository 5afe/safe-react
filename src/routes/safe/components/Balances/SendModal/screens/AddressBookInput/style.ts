import { createStyles, makeStyles } from '@material-ui/core'

export const useTextFieldLabelStyle = makeStyles(
  createStyles({
    root: {
      overflow: 'hidden',
    },
  }),
)

export const useTextFieldInputStyle = makeStyles(
  createStyles({
    input: {
      padding: '16px !important',
    },
  }),
)
