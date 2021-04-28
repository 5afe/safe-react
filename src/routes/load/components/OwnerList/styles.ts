import { border, disabled, extraSmallFontSize, lg, md, screenSm, sm } from 'src/theme/variables'
import { createStyles } from '@material-ui/core'

export const styles = createStyles({
  details: {
    padding: lg,
    borderRight: `solid 1px ${border}`,
    height: '100%',
  },
  owners: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  ownerName: {
    marginBottom: '15px',
    minWidth: '100%',
    [`@media (min-width: ${screenSm}px)`]: {
      marginBottom: '0',
      minWidth: '0',
    },
  },
  ownerAddresses: {
    alignItems: 'center',
    marginLeft: `${sm}`,
  },
  open: {
    paddingLeft: sm,
    width: 'auto',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  title: {
    padding: `${md} ${lg}`,
  },
  owner: {
    padding: `0 ${lg}`,
    marginBottom: '12px',
  },
  header: {
    padding: `${sm} ${lg}`,
    color: disabled,
    fontSize: extraSmallFontSize,
  },
  name: {
    marginRight: `${sm}`,
  },
})
