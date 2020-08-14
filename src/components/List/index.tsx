import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import ListMui from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import { FixedIcon } from '@gnosis.pm/safe-react-components'

const StyledListItem = styled(ListItem)`
  &.MuiButtonBase-root.MuiListItem-root {
    margin: 4px 0;
  }

  &.MuiListItem-button:hover {
    border-radius: 8px;
  }

  &.MuiListItem-root.Mui-selected {
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: 8px;
    color: ${({ theme }) => theme.colors.primary};
    span {
      color: ${({ theme }) => theme.colors.primary};
    }
    .icon-color {
      fill: ${({ theme }) => theme.colors.primary};
    }
  }
`

const StyledListSubItem = styled(ListItem)`
  &.MuiButtonBase-root.MuiListItem-root {
    color: ${({ theme }) => theme.colors.text};
  }

  &.MuiButtonBase-root.MuiListItem-root.Mui-selected {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const StyledListItemText = styled(ListItemText)`
  span {
    font-family: ${({ theme }) => theme.fonts.fontFamily};
    font-size: 0.76em;
    font-weight: 600;
    line-height: 1.5;
    letter-spacing: 1px;
    color: ${({ theme }) => theme.colors.placeHolder};
    text-transform: uppercase;
  }
`

const StyledListSubItemText = styled(ListItemText)`
  span {
    text-transform: none;
    font-weight: 400;
    font-size: 0.85em;
    letter-spacing: 0px;
    color: ${({ theme }) => theme.colors.secondary};
  }
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

  const isSubItemSelected = (item: ListItemType): boolean => {
    const res = item.subItems?.find((subItem) => subItem.selected)
    return res !== undefined
  }

  const getListItem = (item: ListItemType | ListSubItemType, isSubItem = true) => {
    const onClick = () => onItemClick(item)

    const ListItemAux = isSubItem ? StyledListSubItem : StyledListItem
    const ListItemTextAux = isSubItem ? StyledListSubItemText : StyledListItemText

    return (
      <ListItemAux
        button
        key={item.label}
        onClick={onClick}
        selected={item.selected || isSubItemSelected(item as ListItemType)}
      >
        {item.icon && item.icon}

        <ListItemTextAux primary={item.label} />

        {(item as ListItemType).subItems &&
          (groupCollapseStatus[item.label] ? <FixedIcon type="chevronUp" /> : <FixedIcon type="chevronDown" />)}
      </ListItemAux>
    )
  }

  useEffect(() => {
    if (Object.keys(groupCollapseStatus).length) {
      return
    }

    items.forEach((i) => {
      if (isSubItemSelected(i)) {
        setGroupCollapseStatus({ ...groupCollapseStatus, ...{ [i.label]: true } })
      }
    })
  }, [groupCollapseStatus, items])

  return (
    <ListMui component="nav" aria-labelledby="nested-list-subheader" className={classes.root}>
      {items.map((i) => {
        return (
          <div key={i.label}>
            {getListItem(i, false)}
            {i.subItems && (
              <Collapse in={groupCollapseStatus[i.label]} timeout="auto" unmountOnExit>
                <ListMui component="div" disablePadding>
                  {i.subItems.map((subItem) => getListItem(subItem))}
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
