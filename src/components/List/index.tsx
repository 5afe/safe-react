import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import ListMui from '@material-ui/core/List'
import ListItem, { ListItemProps } from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import { FixedIcon } from '@gnosis.pm/safe-react-components'

const StyledListItem = styled(ListItem)<ListItemProps>`
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

const StyledListSubItem = styled(ListItem)<ListItemProps>`
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
    font-family: ${({ theme }) => theme.fonts.fontFamily};
  }
`

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 200,
      backgroundColor: theme.palette.background.paper,
      overflowX: 'auto',
      margin: '8px 0 -4px 0',
      '&::-webkit-scrollbar': {
        width: '0.5em',
      },
      '&::-webkit-scrollbar-track': {
        boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
        webkitBoxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
        borderRadius: '20px',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'darkgrey',
        outline: '1px solid #dadada',
        borderRadius: '20px',
      },
    },
    nested: {
      paddingLeft: theme.spacing(3),
    },
  }),
)

export type ListItemType = {
  label: string
  href: string
  icon?: React.ReactNode
  selected?: boolean
  subItems?: ListItemType[]
}

type Props = {
  items: ListItemType[]
}

const List = ({ items }: Props): React.ReactElement => {
  const classes = useStyles()
  const [groupCollapseStatus, setGroupCollapseStatus] = useState({})

  const onItemClick = (item: ListItemType) => {
    if (item.subItems) {
      const cp = { ...groupCollapseStatus }
      cp[item.label] = cp[item.label] ? false : true
      setGroupCollapseStatus(cp)
    }
  }

  const isSubItemSelected = (item: ListItemType): boolean => {
    const res = item.subItems?.find((subItem) => subItem.selected)
    return res !== undefined
  }

  const getListItem = (item: ListItemType, isSubItem = true) => {
    const onClick = () => onItemClick(item)

    const ListItemAux = isSubItem ? StyledListSubItem : StyledListItem
    const ListItemTextAux = isSubItem ? StyledListSubItemText : StyledListItemText

    return (
      <ListItemAux
        button
        // For some reason when wrapping a MUI component with styled() component prop gets lost in types
        // But this prop is totally valid
        // eslint-disable-next-line
        // @ts-ignore
        component={Link}
        to={item.href}
        key={item.label}
        onClick={onClick}
        selected={item.selected || isSubItemSelected(item)}
      >
        {item.icon && item.icon}

        <ListItemTextAux primary={item.label} />

        {item.subItems &&
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
      {items.map((i) => (
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
      ))}
    </ListMui>
  )
}

export default List
