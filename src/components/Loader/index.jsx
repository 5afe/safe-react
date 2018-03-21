// @flow
import * as React from 'react'
import { CircularProgress } from 'material-ui/Progress'
import RefreshIcon from 'material-ui-icons/Refresh'
import Block from '~/components/layout/Block'
import { xs } from '~/theme/variables'

type Props = {
  callback: () => void,
}

type State = {
  loading: boolean,
}

const loaderStyle = {
  margin: `0px 0px 0px ${xs}`,
}

class Loader extends React.Component<Props, State> {
  constructor() {
    super()

    this.state = {
      loading: false,
    }
  }

  onReload = async () => {
    this.setState({ loading: true }, await this.props.callback())
    this.setState({ loading: false })
  }

  render() {
    const { loading } = this.state

    return (
      <Block style={loaderStyle}>
        {loading
          ? <CircularProgress color="inherit" size={24} />
          : <RefreshIcon color="inherit" onClick={this.onReload} /> }
      </Block>
    )
  }
}

export default Loader
