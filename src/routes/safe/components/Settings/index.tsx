import { IconText, Loader, Icon } from '@gnosis.pm/safe-react-components'
import { LoadingContainer } from 'src/components/LoaderContainer'
import Badge from '@material-ui/core/Badge'
import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import * as React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'

import { Advanced } from './Advanced'
import { SpendingLimitSettings } from './SpendingLimit'
import ManageOwners from './ManageOwners'
import { RemoveSafeModal } from './RemoveSafeModal'
import SafeDetails from './SafeDetails'
import ThresholdSettings from './ThresholdSettings'
import { styles } from './style'

import Block from 'src/components/layout/Block'
import ButtonLink from 'src/components/layout/ButtonLink'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
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

const Settings: React.FC = () => {
  const classes = useStyles()
  const [state, setState] = useState(INITIAL_STATE)
  const { owners, needsUpdate, loadedViaUrl } = useSelector(currentSafeWithNames)
  const granted = useSelector(grantedSelector)

  const handleChange = (menuOptionIndex) => () => {
    setState((prevState) => ({ ...prevState, menuOptionIndex }))
  }

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
        <Col className={classes.menuWrapper} layout="column">
          <Block className={classes.menu}>
            <Row className={cn(classes.menuOption, menuOptionIndex === 1 && classes.active)} onClick={handleChange(1)}>
              <Badge
                badgeContent=" "
                color="error"
                invisible={!needsUpdate || !granted}
                style={{ paddingRight: '10px' }}
                variant="dot"
              >
                <IconText
                  iconSize="sm"
                  textSize="xl"
                  iconType="info"
                  text="Safe Details"
                  color={menuOptionIndex === 1 ? 'primary' : 'secondary'}
                />
              </Badge>
            </Row>
            <Hairline className={classes.hairline} />
            <Row
              className={cn(classes.menuOption, menuOptionIndex === 2 && classes.active)}
              onClick={handleChange(2)}
              testId={OWNERS_SETTINGS_TAB_TEST_ID}
            >
              <IconText
                iconSize="sm"
                textSize="xl"
                iconType="owners"
                text="Owners"
                color={menuOptionIndex === 2 ? 'primary' : 'secondary'}
              />
              <Paragraph className={classes.counter} size="xs">
                {owners.length}
              </Paragraph>
            </Row>
            <Hairline className={classes.hairline} />
            <Row className={cn(classes.menuOption, menuOptionIndex === 3 && classes.active)} onClick={handleChange(3)}>
              <IconText
                iconSize="sm"
                textSize="xl"
                iconType="requiredConfirmations"
                text="Policies"
                color={menuOptionIndex === 3 ? 'primary' : 'secondary'}
              />
            </Row>
            <Hairline className={classes.hairline} />
            <Row className={cn(classes.menuOption, menuOptionIndex === 4 && classes.active)} onClick={handleChange(4)}>
              <IconText
                iconSize="sm"
                textSize="xl"
                iconType="fuelIndicator"
                text="Spending limit"
                color={menuOptionIndex === 4 ? 'primary' : 'secondary'}
              />
            </Row>
            <Hairline className={classes.hairline} />
            <Row className={cn(classes.menuOption, menuOptionIndex === 5 && classes.active)} onClick={handleChange(5)}>
              <IconText
                iconSize="sm"
                textSize="xl"
                iconType="settingsTool"
                text="Advanced"
                color={menuOptionIndex === 5 ? 'primary' : 'secondary'}
              />
            </Row>
            <Hairline className={classes.hairline} />
          </Block>
        </Col>
        <Col className={classes.contents} layout="column">
          <Block className={classes.container}>
            {menuOptionIndex === 1 && <SafeDetails />}
            {menuOptionIndex === 2 && <ManageOwners granted={granted} owners={owners} />}
            {menuOptionIndex === 3 && <ThresholdSettings />}
            {menuOptionIndex === 4 && <SpendingLimitSettings />}
            {menuOptionIndex === 5 && <Advanced />}
          </Block>
        </Col>
      </Block>
    </>
  )
}

export default Settings
