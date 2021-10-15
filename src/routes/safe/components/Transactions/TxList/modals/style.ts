import { makeStyles } from '@material-ui/core'
import { lg, md, sm } from 'src/theme/variables'

export const useStyles = makeStyles(({ palette }) => ({
  container: {
    padding: `${md} ${lg}`,
  },
  nonceNumber: {
    marginTop: sm,
    fontSize: md,
  },
  gasCostsContainer: {
    backgroundColor: palette.backgroundColor[palette.type],
    padding: `0 ${lg}`,
  },
}))
