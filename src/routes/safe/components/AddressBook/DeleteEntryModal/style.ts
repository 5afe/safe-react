import { error, lg, md } from 'src/theme/variables'

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
  buttonDelete: {
    color: '#fff',
    backgroundColor: error,
  },
  buttonCancel: {
    color: '#008c73',
  },
  smallerModalWindow: {
    height: 'auto',
  },
})
