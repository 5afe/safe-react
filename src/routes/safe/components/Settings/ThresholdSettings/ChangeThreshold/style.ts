import { makeStyles } from '@material-ui/core'

import { lg, md, sm } from 'src/theme/variables'

export const useStyles = makeStyles(({ palette }) => ({
  modalContent: {
    padding: `${md} ${lg}`,
  },
  ownersText: {
    marginLeft: sm,
  },
  inputRow: {
    position: 'relative',
  },
  gasCostsContainer: {
    backgroundColor: palette.backgroundColor[palette.type],
    padding: `${sm} ${lg}`,
  },
}))
