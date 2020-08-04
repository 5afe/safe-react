import React from 'react'
import styled from 'styled-components'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import { Icon, FixedIcon } from '@gnosis.pm/safe-react-components'

const StyledListItemText = styled(ListItemText)`
  span {
    font-family: ${({ theme }) => theme.fonts.fontFamily};
    font-size: 0.68em;
    font-weight: 600;
    line-height: 1.5;
    letter-spacing: 2px;
    color: ${({ theme }) => theme.colors.secondaryLight};
    text-transform: uppercase;
  }
`

const StyledListItemIcon = styled(ListItemIcon)`
  min-width: 32px !important;
`

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 200,
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(3),
    },
  }),
)

export default function NestedList() {
  const classes = useStyles()
  const [open, setOpen] = React.useState(true)

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <List component="nav" aria-labelledby="nested-list-subheader" className={classes.root}>
      <ListItem button>
        <StyledListItemIcon>
          <Icon size="md" type="assets" />
        </StyledListItemIcon>
        <StyledListItemText primary="Assets" />
      </ListItem>
      <ListItem button>
        <StyledListItemIcon>
          <Icon size="md" type="transactionsInactive" />
        </StyledListItemIcon>
        <StyledListItemText primary="Transactions" />
      </ListItem>
      <ListItem button>
        <StyledListItemIcon>
          <Icon size="md" type="addressBook" />
        </StyledListItemIcon>
        <StyledListItemText primary="Address Book" />
      </ListItem>
      <ListItem button onClick={handleClick}>
        <StyledListItemIcon>
          <Icon size="md" type="apps" />
        </StyledListItemIcon>
        <StyledListItemText primary="Apps" />
        {open ? <FixedIcon type="chevronUp" /> : <FixedIcon type="chevronDown" />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button className={classes.nested}>
            <StyledListItemIcon>
              <Icon size="md" type="apps" />
            </StyledListItemIcon>
            <StyledListItemText primary="App 1" />
          </ListItem>
          <ListItem button className={classes.nested}>
            <StyledListItemIcon>
              <Icon size="md" type="apps" />
            </StyledListItemIcon>
            <StyledListItemText primary="App 2" />
          </ListItem>
          <ListItem button className={classes.nested}>
            <StyledListItemIcon>
              <Icon size="md" type="apps" />
            </StyledListItemIcon>
            <StyledListItemText primary="App 3" />
          </ListItem>
        </List>
      </Collapse>
      <ListItem button onClick={handleClick}>
        <StyledListItemIcon>
          <Icon size="md" type="settings" />
        </StyledListItemIcon>
        <StyledListItemText primary="Settings" />
        {open ? <FixedIcon type="chevronUp" /> : <FixedIcon type="chevronDown" />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button className={classes.nested}>
            <StyledListItemIcon>
              <Icon size="md" type="settings" />
            </StyledListItemIcon>
            <StyledListItemText primary="Setting 1" />
          </ListItem>
          <ListItem button className={classes.nested}>
            <StyledListItemIcon>
              <Icon size="md" type="settings" />
            </StyledListItemIcon>
            <StyledListItemText primary="Setting 2" />
          </ListItem>
          <ListItem button className={classes.nested}>
            <StyledListItemIcon>
              <Icon size="md" type="settings" />
            </StyledListItemIcon>
            <StyledListItemText primary="Setting 3" />
          </ListItem>
        </List>
      </Collapse>
    </List>
  )
}
