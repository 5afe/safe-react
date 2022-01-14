import { Router, Redirect } from 'react-router'
import { ReactElement } from 'react'
import { History } from 'history'
import { Route } from 'react-router-dom'

type Props = {
  history: History
}

const XDaiGCRedirection = ({ history }: Props): ReactElement => {
  return (
    <Router history={history}>
      <Route // Redirect xdai to gno
        path="/xdai\::url*"
        render={() => <Redirect to={history.location.pathname.replace(/\/xdai:/, '/gno:')} />}
      />
    </Router>
  )
}

export default XDaiGCRedirection
