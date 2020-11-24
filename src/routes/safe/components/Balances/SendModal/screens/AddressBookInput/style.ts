import { createStyles, makeStyles } from '@material-ui/core'

export const useTextFieldLabelStyle = makeStyles(
  createStyles({
    root: {
      overflow: 'hidden',
      borderRadius: 4,
      fontSize: '15px',
      width: '500px',
    },
  }),
)

export const useTextFieldInputStyle = makeStyles(
  createStyles({
    root: {
      fontSize: '14px',
      width: '420px',
    },
  }),
)
