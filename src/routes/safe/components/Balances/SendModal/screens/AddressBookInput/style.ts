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
    root: {
      fontSize: '16px',
      padding: '0 !important',
    },
    input: {
      padding: '16px !important',
    },
  }),
)
