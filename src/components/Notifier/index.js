// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withSnackbar } from 'notistack'
import actions from './actions'
import selector from './selector'

class Notifier extends Component {
  displayed = []

  shouldComponentUpdate({ notifications: newSnacks = [] }) {
    const { notifications: currentSnacks, closeSnackbar, removeSnackbar } = this.props

    if (!newSnacks.size) {
      this.displayed = []
      return false
    }
    let notExists = false
    for (let i = 0; i < newSnacks.size; i += 1) {
      const newSnack = newSnacks.get(i)

      if (newSnack.dismissed) {
        closeSnackbar(newSnack.key)
        removeSnackbar(newSnack.key)
      }

      if (notExists) {
        continue
      }
      notExists = notExists || !currentSnacks.filter(({ key }) => newSnack.key === key).length
    }
    return notExists
  }

  componentDidUpdate() {
    const { notifications = [], enqueueSnackbar, removeSnackbar } = this.props

    notifications.map(({ key, message, options = {} }) => {
      // Do nothing if snackbar is already displayed
      if (this.displayed.includes(key)) {
        return
      }
      // Display snackbar using notistack
      enqueueSnackbar(message, {
        ...options,
        onClose: (event, reason, key) => {
          if (options.onClose) {
            options.onClose(event, reason, key)
          }
          // Dispatch action to remove snackbar from redux store
          removeSnackbar(key)
        },
      })
      // Keep track of snackbars that we've displayed
      this.storeDisplayed(key)
    })
  }

  storeDisplayed = (id) => {
    this.displayed = [...this.displayed, id]
  }

  render() {
    return null
  }
}

export default withSnackbar(
  connect(
    selector,
    actions,
  )(Notifier),
)
