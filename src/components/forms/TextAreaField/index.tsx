import { makeStyles, createStyles } from '@material-ui/core/styles'
import { ReactElement } from 'react'

import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'

const useStyles = makeStyles(
  createStyles({
    textarea: {
      '& > div': {
        height: '140px',
        paddingTop: '0',
        paddingBottom: '0',
        alignItems: 'auto',
        '& > textarea': {
          fontSize: '15px',
          letterSpacing: '-0.5px',
          lineHeight: '20px',
          height: '102px',
        },
      },
    },
  }),
)

type Props = {
  name: string
  placeholder: string
  text: string
  type: HTMLInputElement['type']
  validate: (val: string) => undefined | string
}

export const TextAreaField = (props: Props): ReactElement => {
  const classes = useStyles()
  return <Field {...props} className={classes.textarea} component={TextField} multiline rows="5" />
}
