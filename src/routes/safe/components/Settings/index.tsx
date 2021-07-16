import { Breadcrumb, BreadcrumbElement, Loader, Icon, Menu } from '@gnosis.pm/safe-react-components'
import { LoadingContainer } from 'src/components/LoaderContainer'
import { makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch, useRouteMatch } from 'react-router-dom'

import { styles } from './style'

import { SAFELIST_ADDRESS } from 'src/routes/routes'
import Block from 'src/components/layout/Block'
import ButtonLink from 'src/components/layout/ButtonLink'
import Col from 'src/components/layout/Col'
import Span from 'src/components/layout/Span'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { grantedSelector } from 'src/routes/safe/container/selector'

const Advanced = React.lazy(() => import('./Advanced'))
const SpendingLimitSettings = React.lazy(() => import('./SpendingLimit'))
const ManageOwners = React.lazy(() => import('./ManageOwners'))
const RemoveSafeModal = React.lazy(() => import('./RemoveSafeModal'))
const SafeDetails = React.lazy(() => import('./SafeDetails'))
const ThresholdSettings = React.lazy(() => import('./ThresholdSettings'))

export const OWNERS_SETTINGS_TAB_TEST_ID = 'owner-settings-tab'

const INITIAL_STATE = {
  showRemoveSafe: false,
}

const useStyles = makeStyles(styles)

const Settings = (): React.ReactElement => {
  const classes = useStyles()
  const [state, setState] = useState(INITIAL_STATE)
  const { address, owners, loadedViaUrl } = useSelector(currentSafeWithNames)
  const granted = useSelector(grantedSelector)
  const matchSafeWithAction = useRouteMatch({
    path: `${SAFELIST_ADDRESS}/:safeAddress/:safeAction/:safeSubaction?`,
  }) as {
    url: string
    params: Record<string, string>
  }

  let settingsSection
  switch (matchSafeWithAction.url) {
    // FIXME should use global routes enum once PR #2536 is merged
    case `${SAFELIST_ADDRESS}/${address}/settings/details`:
      settingsSection = 'Safe Details'
      break
    // FIXME should use global routes enum once PR #2536 is merged
    case `${SAFELIST_ADDRESS}/${address}/settings/owners`:
      settingsSection = 'Owners'
      break
    // FIXME should use global routes enum once PR #2536 is merged
    case `${SAFELIST_ADDRESS}/${address}/settings/policies`:
      settingsSection = 'Policies'
      break
    // FIXME should use global routes enum once PR #2536 is merged
    case `${SAFELIST_ADDRESS}/${address}/settings/spending-limit`:
      settingsSection = 'Spending Limit'
      break
    // FIXME should use global routes enum once PR #2536 is merged
    case `${SAFELIST_ADDRESS}/${address}/settings/advanced`:
      settingsSection = 'Advanced'
      break
    default:
      settingsSection = ''
  }

  const onShow = (action) => () => {
    setState((prevState) => ({ ...prevState, [`show${action}`]: true }))
  }

  const onHide = (action) => () => {
    setState((prevState) => ({ ...prevState, [`show${action}`]: false }))
  }

  const { showRemoveSafe } = state

  return !owners ? (
    <LoadingContainer>
      <Loader size="md" />
    </LoadingContainer>
  ) : (
    <>
      <Menu>
        <Col start="sm" sm={6} xs={12}>
          <Breadcrumb>
            <BreadcrumbElement iconType="settings" text="SETTINGS" />
            <BreadcrumbElement text={settingsSection} color="placeHolder" />
          </Breadcrumb>
        </Col>
        {!loadedViaUrl && (
          <Col end="sm" sm={6} xs={12}>
            <ButtonLink className={classes.removeSafeBtn} color="error" onClick={onShow('RemoveSafe')} size="lg">
              <Span className={classes.links}>Remove Safe</Span>
              <Icon size="sm" type="delete" color="error" tooltip="Remove Safe" />
            </ButtonLink>
            <RemoveSafeModal isOpen={showRemoveSafe} onClose={onHide('RemoveSafe')} />
          </Col>
        )}
      </Menu>
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
