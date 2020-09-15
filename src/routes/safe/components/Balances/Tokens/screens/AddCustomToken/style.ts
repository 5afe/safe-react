import { lg, md } from 'src/theme/variables'
import { createStyles } from '@material-ui/core'

export const styles = createStyles({
  title: {
    padding: `${lg} 0 20px`,
    fontSize: md,
  },
  formContainer: {
    padding: '0 20px',
    minHeight: '369px',
  },
  addressInput: {
    marginBottom: '15px',
    display: 'flex',
    flexGrow: 1,
    backgroundColor: 'red',
  },
  tokenImageHeading: {
    margin: '0 0 15px',
  },
  checkbox: {
    padding: '0 7px 0 0',
    width: '18px',
    height: '18px',
  },
  checkboxLabel: {
    letterSpacing: '-0.5px',
  },
  buttonRow: {
    height: '84px',
    justifyContent: 'center',
  },
})
