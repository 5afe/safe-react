// @flow
import * as React from 'react'
import SharedSnackBar from './index'

const SharedSnackbarContext = React.createContext({
  openSnackbar: undefined,
  closeSnackbar: undefined,
  snackbarIsOpen: false,
  message: '',
  variant: 'info',
})

type Props = {
  children: React$Node,
}

export type Variant = 'success' | 'error' | 'warning' | 'info'

type State = {
  isOpen: boolean,
  message: string,
  variant: Variant,
}

export class SharedSnackbarProvider extends React.Component<Props, State> {
  state = {
    isOpen: false,
    message: '',
    variant: 'info',
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

    return (
      <SharedSnackbarContext.Provider
        value={{
          openSnackbar: this.openSnackbar,
          closeSnackbar: this.closeSnackbar,
          snackbarIsOpen: this.state.isOpen,
          message: this.state.message,
          variant: this.state.variant,
        }}
      >
        <SharedSnackBar />
        {children}
      </SharedSnackbarContext.Provider>
    )
  }
}

export const SharedSnackbarConsumer = SharedSnackbarContext.Consumer
