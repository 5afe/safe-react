import { secondaryText } from 'src/theme/variables'

export const styles = () => ({
  etherscanLink: {
    display: 'flex',
    alignItems: 'center',

    '& svg': {
      fill: secondaryText,
    },
  },
  address: {
    display: 'block',
    flexShrink: '1',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  addressParagraph: {
    fontSize: '13px',
  },
  button: {
    height: '24px',
    margin: '0',
    width: '24px',
  },
  firstButton: {
    marginLeft: '8px',
  },
})
