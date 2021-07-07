import { Loader, Icon } from '@gnosis.pm/safe-react-components'
import { LoadingContainer } from 'src/components/LoaderContainer'
import Badge from '@material-ui/core/Badge'
import { makeStyles } from '@material-ui/core/styles'
import * as React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'

import { Advanced } from './Advanced'
import { SpendingLimitSettings } from './SpendingLimit'
import ManageOwners from './ManageOwners'
import { RemoveSafeModal } from './RemoveSafeModal'
import SafeDetails from './SafeDetails'
import ThresholdSettings from './ThresholdSettings'
import { styles } from './style'

import { SAFELIST_ADDRESS } from 'src/routes/routes'
import Block from 'src/components/layout/Block'
import ButtonLink from 'src/components/layout/ButtonLink'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import Span from 'src/components/layout/Span'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { grantedSelector } from 'src/routes/safe/container/selector'

export const OWNERS_SETTINGS_TAB_TEST_ID = 'owner-settings-tab'

const INITIAL_STATE = {
  showRemoveSafe: false,
  menuOptionIndex: 1,
}

const useStyles = makeStyles(styles)

const Settings = (): React.ReactElement => {
  const classes = useStyles()
  const [state, setState] = useState(INITIAL_STATE)
  const { address, owners, needsUpdate, loadedViaUrl } = useSelector(currentSafeWithNames)
  const granted = useSelector(grantedSelector)

  const onShow = (action) => () => {
    setState((prevState) => ({ ...prevState, [`show${action}`]: true }))
  }

  const onHide = (action) => () => {
    setState((prevState) => ({ ...prevState, [`show${action}`]: false }))
  }

  const { menuOptionIndex, showRemoveSafe } = state

  return !owners ? (
    <LoadingContainer>
      <Loader size="md" />
    </LoadingContainer>
  ) : (
    <>
      <Row className={classes.message}>
        {!loadedViaUrl && (
          <>
            <ButtonLink className={classes.removeSafeBtn} color="error" onClick={onShow('RemoveSafe')} size="lg">
              <Span className={classes.links}>Remove Safe</Span>
              <Icon size="sm" type="delete" color="error" tooltip="Remove Safe" />
            </ButtonLink>
            <RemoveSafeModal isOpen={showRemoveSafe} onClose={onHide('RemoveSafe')} />
          </>
        )}
      </Row>
      <Block className={classes.root}>
        <Col className={classes.contents} layout="column">
          <Block className={classes.container}>
            <Switch>
              <Route
                path={`${SAFELIST_ADDRESS}/${address}/settings/details`}
                exact
                render={() => <SafeDetails />}
              ></Route>
              <Route
                path={`${SAFELIST_ADDRESS}/${address}/settings/owners`}
                exact
                render={() => <ManageOwners granted={granted} owners={owners} />}
              ></Route>
              <Route
                path={`${SAFELIST_ADDRESS}/${address}/settings/policies`}
                exact
                render={() => <ThresholdSettings />}
              ></Route>
              <Route
                path={`${SAFELIST_ADDRESS}/${address}/settings/spending-limit`}
                exact
                render={() => <SpendingLimitSettings />}
              ></Route>
              <Route
                path={`${SAFELIST_ADDRESS}/${address}/settings/advanced`}
                exact
                render={() => <Advanced />}
              ></Route>
            </Switch>
          </Block>
        </Col>
      </Block>
    </>
  )
}

export default Settings
