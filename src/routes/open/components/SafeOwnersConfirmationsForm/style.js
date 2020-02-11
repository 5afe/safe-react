// @flow
import {
  md, lg, sm, disabled, extraSmallFontSize, screenSm,
} from '~/theme/variables'

export const styles = () => ({
  root: {
    display: 'flex',
  },
  title: {
    padding: `${md} ${lg}`,
  },
  owner: {
    flexDirection: 'column',
    marginTop: '12px',
    padding: `0 ${lg}`,
    '&:first-child': {
      marginTop: 0,
    },

    [`@media (min-width: ${screenSm}px)`]: {
      flexDirection: 'row',
    },
  },
  ownerName: {
    marginBottom: '5px',
    minWidth: '100%',
    [`@media (min-width: ${screenSm}px)`]: {
      marginBottom: '0',
      minWidth: '0',
    },
  },
  ownerAddress: {
    marginBottom: '15px',
    minWidth: '100%',
    [`@media (min-width: ${screenSm}px)`]: {
      marginBottom: '0',
      minWidth: '0',
    },
  },
  header: {
    padding: `${sm} ${lg}`,
    fontSize: extraSmallFontSize,
    color: disabled,
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
  ownersAmount: {
    flexDirection: 'column',
    [`@media (min-width: ${screenSm}px)`]: {
      flexDirection: 'row',
    },
  },
  ownersAmountItem: {
    minWidth: '100%',
    [`@media (min-width: ${screenSm}px)`]: {
      minWidth: '0',
    },
  },
})
