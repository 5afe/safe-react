// @flow
import {
  sm, xs, lg, border,
} from '~/theme/variables'

export const styles = () => ({
  title: {
    padding: `${lg} 20px`,
    fontSize: '16px',
  },
  formContainer: {
    minHeight: '369px',
  },
  header: {
    padding: `${sm} ${lg}`,
  },
  owners: {
    padding: lg,
  },
  name: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  userName: {
    whiteSpace: 'nowrap',
  },
  owner: {
    padding: sm,
    paddingLeft: lg,
    alignItems: 'center',
  },
  user: {
    justifyContent: 'left',
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
  },
  open: {
    paddingLeft: sm,
    width: 'auto',
    '&:hover': {
      cursor: 'pointer',
    },
  },
})
