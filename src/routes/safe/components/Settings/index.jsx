// @flow
import Badge from '@material-ui/core/Badge'
import { withStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import * as React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'

import ManageOwners from './ManageOwners'
import { RemoveSafeModal } from './RemoveSafeModal'
import SafeDetails from './SafeDetails'
import ThresholdSettings from './ThresholdSettings'
import { OwnersIcon } from './assets/icons/OwnersIcon'
import { RequiredConfirmationsIcon } from './assets/icons/RequiredConfirmationsIcon'
import { SafeDetailsIcon } from './assets/icons/SafeDetailsIcon'
import RemoveSafeIcon from './assets/icons/bin.svg'
import { styles } from './style'

import Loader from '~/components/Loader'
import Block from '~/components/layout/Block'
import ButtonLink from '~/components/layout/ButtonLink'
import Col from '~/components/layout/Col'
import Hairline from '~/components/layout/Hairline'
import Img from '~/components/layout/Img'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import Span from '~/components/layout/Span'
import { getAddressBook } from '~/logic/addressBook/store/selectors'
import { safeNeedsUpdate } from '~/logic/safe/utils/safeVersion'
import { grantedSelector } from '~/routes/safe/container/selector'
import { safeOwnersSelector } from '~/routes/safe/store/selectors'

export const OWNERS_SETTINGS_TAB_TEST_ID = 'owner-settings-tab'

type Props = {
  classes: Object,
}
const INITIAL_STATE = {
  showRemoveSafe: false,
  menuOptionIndex: 1,
}

type Action = 'RemoveSafe'

const Settings = (props: Props) => {
  const [state, setState] = useState(INITIAL_STATE)
  const owners = useSelector(safeOwnersSelector)
  const needsUpdate = useSelector(safeNeedsUpdate)
  const granted = useSelector(grantedSelector)
  const addressBook = useSelector(getAddressBook)

  const handleChange = (menuOptionIndex) => () => {
    setState((prevState) => ({ ...prevState, menuOptionIndex }))
  }

  const onShow = (action: Action) => () => {
    setState((prevState) => ({ ...prevState, [`show${action}`]: true }))
  }

  const onHide = (action: Action) => () => {
    setState((prevState) => ({ ...prevState, [`show${action}`]: false }))
  }

  const { menuOptionIndex, showRemoveSafe } = state
  const { classes } = props

  return !owners ? (
    <Loader />
  ) : (
    <>
      <Row className={classes.message}>
        <ButtonLink className={classes.removeSafeBtn} color="error" onClick={onShow('RemoveSafe')} size="lg">
          <Span className={classes.links}>Remove Safe</Span>
          <Img alt="Trash Icon" className={classes.removeSafeIcon} src={RemoveSafeIcon} />
        </ButtonLink>
        <RemoveSafeModal isOpen={showRemoveSafe} onClose={onHide('RemoveSafe')} />
      </Row>
      <Block className={classes.root}>
        <Col className={classes.menuWrapper} layout="column">
          <Block className={classes.menu}>
            <Row className={cn(classes.menuOption, menuOptionIndex === 1 && classes.active)} onClick={handleChange(1)}>
              <SafeDetailsIcon />
              <Badge
                badgeContent=" "
                color="error"
                invisible={!needsUpdate || !granted}
                style={{ paddingRight: '10px' }}
                variant="dot"
              >
                Safe details
              </Badge>
            </Row>
            <Hairline className={classes.hairline} />
            <Row
              className={cn(classes.menuOption, menuOptionIndex === 2 && classes.active)}
              onClick={handleChange(2)}
              testId={OWNERS_SETTINGS_TAB_TEST_ID}
            >
              <OwnersIcon />
              Owners
              <Paragraph className={classes.counter} size="xs">
                {owners.size}
              </Paragraph>
            </Row>
            <Hairline className={classes.hairline} />
            <Row className={cn(classes.menuOption, menuOptionIndex === 3 && classes.active)} onClick={handleChange(3)}>
              <RequiredConfirmationsIcon />
              Policies
            </Row>
            <Hairline className={classes.hairline} />
          </Block>
        </Col>
        <Col className={classes.contents} layout="column">
          <Block className={classes.container}>
            {menuOptionIndex === 1 && <SafeDetails />}
            {menuOptionIndex === 2 && <ManageOwners addressBook={addressBook} granted={granted} owners={owners} />}
            {menuOptionIndex === 3 && <ThresholdSettings />}
          </Block>
        </Col>
      </Block>
    </>
  )
}

export default withStyles(styles)(Settings)
