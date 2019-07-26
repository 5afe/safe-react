// @flow
import { md, lg, sm } from '~/theme/variables'

export const styles = () => ({
  root: {
    display: 'flex',
  },
  title: {
    padding: `${md} ${lg}`,
  },
  owner: {
    padding: `0 ${lg}`,
    marginTop: '12px',
    '&:first-child': {
      marginTop: 0,
    },
  },
  header: {
    padding: `${sm} ${lg}`,
  },
  name: {
    marginRight: `${sm}`,
  },
  trash: {
    top: '5px',
  },
  add: {
    justifyContent: 'center',
  },
  check: {
    color: '#03AE60',
    height: '20px',
  },
  remove: {
    height: '56px',
    maxWidth: '50px',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  owners: {
    paddingLeft: md,
  },
})
