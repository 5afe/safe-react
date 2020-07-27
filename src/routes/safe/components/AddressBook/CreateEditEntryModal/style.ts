import { lg, md } from 'src/theme/variables'

export const styles = () => ({
  heading: {
    padding: lg,
    justifyContent: 'space-between',
    boxSizing: 'border-box',
  },
  manage: {
    fontSize: lg,
  },
  container: {
    padding: `${md} ${lg}`,
  },
  close: {
    height: '35px',
    width: '35px',
  },
  buttonRow: {
    height: '84px',
    justifyContent: 'center',
  },
  smallerModalWindow: {
    height: 'auto',
  },
})
