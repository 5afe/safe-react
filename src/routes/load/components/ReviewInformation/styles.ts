import { makeStyles } from '@material-ui/core/styles'
import { border, lg, screenSm, sm, xs } from 'src/theme/variables'

export const useStyles = makeStyles({
  root: {
    flexDirection: 'column',
    minHeight: '300px',
    [`@media (min-width: ${screenSm}px)`]: {
      flexDirection: 'row',
    },
  },
  detailsColumn: {
    minWidth: '100%',
    [`@media (min-width: ${screenSm}px)`]: {
      minWidth: '0',
    },
  },
  ownersColumn: {
    minWidth: '100%',
    [`@media (min-width: ${screenSm}px)`]: {
      minWidth: '0',
    },
  },
  details: {
    padding: lg,
    borderRight: `solid 1px ${border}`,
    height: '100%',
  },
  owners: {
    padding: lg,
  },
  name: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  owner: {
    alignItems: 'center',
    minWidth: 'fit-content',
    padding: sm,
    paddingLeft: lg,
  },
  open: {
    paddingLeft: sm,
    width: 'auto',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  container: {
    marginTop: xs,
    alignItems: 'center',
  },
  address: {
    paddingLeft: '6px',
    marginRight: sm,
  },
})
