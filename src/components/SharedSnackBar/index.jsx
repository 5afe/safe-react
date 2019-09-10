// @flow
import * as React from 'react'
import { Snackbar } from '@material-ui/core'
import SnackbarContent from '~/components/SnackbarContent'

export const SharedSnackbar = () => (
  <SharedSnackbarConsumer>
    {(value) => {
      const {
        snackbarIsOpen, message, closeSnackbar, variant,
      } = value

      return (
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={snackbarIsOpen}
          autoHideDuration={4000}
          onClose={closeSnackbar}
        >
          <SnackbarContent onClose={closeSnackbar} message={message} variant={variant} />
        </Snackbar>
      )
    }}
  </SharedSnackbarConsumer>
)

type SnackbarContext = {
  openSnackbar: Function,
  closeSnackbar: Function,
  snackbarIsOpen: boolean,
  message: string,
  variant: string,
}

const SharedSnackbarContext = React.createContext<SnackbarContext>({
  openSnackbar: undefined,
  closeSnackbar: undefined,
  snackbarIsOpen: false,
  message: '',
  variant: 'info',
})

type Props = {
  children: React.Node,
}

export type Variant = 'success' | 'error' | 'warning' | 'info'

type State = {
  isOpen: boolean,
  message: string,
  variant: Variant,
}

export class SharedSnackbarProvider extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      isOpen: false,
      message: '',
      variant: 'info',
    }
  }

  openSnackbar = (message: string, variant: Variant) => {
    this.setState({
      message,
      variant,
      isOpen: true,
    })
  }

  closeSnackbar = () => {
    this.setState({
      message: '',
      isOpen: false,
    })
  }

  render() {
    const { children } = this.props
    const { message, variant, isOpen } = this.state

    return (
      <SharedSnackbarContext.Provider
        value={{
          openSnackbar: this.openSnackbar,
          closeSnackbar: this.closeSnackbar,
          snackbarIsOpen: isOpen,
          message,
          variant,
        }}
      >
        <SharedSnackbar />
        {children}
      </SharedSnackbarContext.Provider>
    )
  }
}

export const SharedSnackbarConsumer = SharedSnackbarContext.Consumer
