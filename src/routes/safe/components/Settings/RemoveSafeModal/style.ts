import { createStyles, makeStyles } from '@material-ui/core/styles'

import { md, sm } from 'src/theme/variables'

export const useStyles = makeStyles(
  createStyles({
    container: {
      minHeight: '369px',
      padding: `${sm}`,
    },
    owner: {
      padding: md,
      alignItems: 'center',
    },
    description: {
      padding: md,
    },
  }),
)
