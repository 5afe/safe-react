import { Breadcrumb, BreadcrumbElement, Loader, Icon, Menu } from '@gnosis.pm/safe-react-components'
import { makeStyles } from '@material-ui/core/styles'
import { useState, lazy } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom'

import { LoadingContainer } from 'src/components/LoaderContainer'
import { styles } from './style'
import Block from 'src/components/layout/Block'
import ButtonLink from 'src/components/layout/ButtonLink'
import Col from 'src/components/layout/Col'
import Span from 'src/components/layout/Span'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { grantedSelector } from 'src/routes/safe/container/selector'
import { generatePrefixedAddressRoutes, SAFE_ROUTES, SAFE_SUBSECTION_ROUTE } from 'src/routes/routes'
import { getShortName } from 'src/config'

const Advanced = lazy(() => import('./Advanced'))
const SpendingLimitSettings = lazy(() => import('./SpendingLimit'))
const ManageOwners = lazy(() => import('./ManageOwners'))
const RemoveSafeModal = lazy(() => import('./RemoveSafeModal'))
const SafeDetails = lazy(() => import('./SafeDetails'))
const ThresholdSettings = lazy(() => import('./ThresholdSettings'))
const Appearance = lazy(() => import('./Appearance'))

export const OWNERS_SETTINGS_TAB_TEST_ID = 'owner-settings-tab'

const INITIAL_STATE = {
  showRemoveSafe: false,
}

const useStyles = makeStyles(styles)

const Settings = (): React.ReactElement => {
  const classes = useStyles()
  const [state, setState] = useState(INITIAL_STATE)
  const { address: safeAddress, owners, loadedViaUrl } = useSelector(currentSafeWithNames)
  const granted = useSelector(grantedSelector)

  // Question mark makes matching [SAFE_SUBSECTION_SLUG] optional
  const matchSafeWithSettingSection = useRouteMatch(`${SAFE_SUBSECTION_ROUTE}?`)

  const currentSafeRoutes = generatePrefixedAddressRoutes({
    shortName: getShortName(),
    safeAddress,
  })

  let settingsSection
  switch (matchSafeWithSettingSection?.url) {
    case currentSafeRoutes.SETTINGS_DETAILS:
      settingsSection = 'Safe Details'
      break
    case currentSafeRoutes.SETTINGS_APPEARANCE:
      settingsSection = 'Appearance'
      break
    case currentSafeRoutes.SETTINGS_OWNERS:
      settingsSection = 'Owners'
      break
    case currentSafeRoutes.SETTINGS_POLICIES:
      settingsSection = 'Policies'
      break
    case currentSafeRoutes.SETTINGS_SPENDING_LIMIT:
      settingsSection = 'Spending Limit'
      break
    case currentSafeRoutes.SETTINGS_ADVANCED:
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
        {!loadedViaUrl ? (
          <Col end="sm" sm={6} xs={12}>
            <ButtonLink className={classes.removeSafeBtn} color="error" onClick={onShow('RemoveSafe')} size="lg">
              <Span className={classes.links}>Remove Safe</Span>
              <Icon size="sm" type="delete" color="error" tooltip="Remove Safe" />
            </ButtonLink>
            <RemoveSafeModal isOpen={showRemoveSafe} onClose={onHide('RemoveSafe')} />
          </Col>
        ) : (
          <Col end="sm" sm={6} xs={12}></Col>
        )}
      </Menu>
      <Block className={classes.root}>
        <Col className={classes.contents} layout="column">
          <Block className={classes.container}>
            <Switch>
              <Route path={SAFE_ROUTES.SETTINGS_DETAILS} exact render={() => <SafeDetails />} />
              <Route path={SAFE_ROUTES.SETTINGS_APPEARANCE} exact render={() => <Appearance />} />
              <Route
                path={SAFE_ROUTES.SETTINGS_OWNERS}
                exact
                render={() => <ManageOwners granted={granted} owners={owners} />}
              />
              <Route path={SAFE_ROUTES.SETTINGS_POLICIES} exact render={() => <ThresholdSettings />} />
              <Route path={SAFE_ROUTES.SETTINGS_SPENDING_LIMIT} exact render={() => <SpendingLimitSettings />} />
              <Route path={SAFE_ROUTES.SETTINGS_ADVANCED} exact render={() => <Advanced />} />
              <Redirect to={SAFE_ROUTES.SETTINGS_DETAILS} />
            </Switch>
          </Block>
        </Col>
      </Block>
    </>
  )
}

export default Settings
