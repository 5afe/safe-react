import React, { useState } from 'react'
import styled from 'styled-components'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import ListMui from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import { FixedIcon } from '@gnosis.pm/safe-react-components'

const StyledListItemText = styled(ListItemText)`
  span {
    font-family: ${({ theme }) => theme.fonts.fontFamily};
    font-size: 0.68em;
    font-weight: 600;
    line-height: 1.5;
    letter-spacing: 2px;
    color: ${({ theme }) => theme.colors.secondaryHover};
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

export type ListSubItemType = {
  label: string
  icon?: React.ReactNode
  selected?: boolean
  onItemClick: () => void
}

export type ListItemType = {
  label: string
  icon?: React.ReactNode
  selected?: boolean
  onItemClick: () => void
  subItems?: ListSubItemType[]
}

type Props = {
  items: ListItemType[]
}

const List = ({ items }: Props): React.ReactElement => {
  const classes = useStyles()
  const [groupCollapseStatus, setGroupCollapseStatus] = useState({})

  const onItemClick = (item: ListItemType | ListSubItemType) => {
    if ((item as ListItemType).subItems) {
      const cp = { ...groupCollapseStatus }
      cp[item.label] = cp[item.label] ? false : true
      setGroupCollapseStatus(cp)
    }
    item.onItemClick()
  }

  const getListItem = (item: ListItemType | ListSubItemType) => {
    const onClick = () => onItemClick(item)
    return (
      <ListItem button key={item.label} onClick={onClick} selected={item.selected}>
        {item.icon && <StyledListItemIcon>{item.icon}</StyledListItemIcon>}
        <StyledListItemText primary={item.label} />
        {(item as ListItemType).subItems &&
          (groupCollapseStatus[item.label] ? <FixedIcon type="chevronUp" /> : <FixedIcon type="chevronDown" />)}
      </ListItem>
    )
  }

  return (
    <ListMui component="nav" aria-labelledby="nested-list-subheader" className={classes.root}>
      {items.map((i) => {
        return (
          <div key={i.label}>
            {getListItem(i)}
            {i.subItems && (
              <Collapse in={groupCollapseStatus[i.label]} timeout="auto" unmountOnExit>
                <ListMui component="div" disablePadding>
                  {i.subItems.map(getListItem)}
                </ListMui>
              </Collapse>
            )}
          </div>
        )
      })}
    </ListMui>
  )
}

export default List
