import { lg, md } from 'src/theme/variables'
import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles(({ palette }) => ({
  modalContent: {
    padding: `${md} ${lg}`,
  },
  gasCostsContainer: {
    backgroundColor: palette.backgroundColor[palette.type],
    padding: `0 ${lg}`,
  },
}))
