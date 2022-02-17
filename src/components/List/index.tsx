import Badge from '@material-ui/core/Badge'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link, useHistory } from 'react-router-dom'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import ListMui from '@material-ui/core/List'
import ListItem, { ListItemProps } from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import { FixedIcon } from '@gnosis.pm/safe-react-components'
import { secondary } from 'src/theme/variables'

export const StyledListItem = styled(ListItem)<ListItemProps>`
  &.MuiButtonBase-root.MuiListItem-root {
    margin: 4px 0;
  }

  & .MuiListItemText-root span {
    line-height: 1;
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

  & .beamer_icon.active {
    background-color: ${secondary} !important;
    top: auto;
    bottom: 8px;
    left: 31px;
    width: 6px;
    height: 6px;
    border: white solid 1px;
    text-indent: -9000px;
  }
`

const StyledListSubItem = styled(ListItem)<ListItemProps>`
  &.MuiButtonBase-root.MuiListItem-root {
    margin: 4px 0;
  }

  & .MuiListItemText-root span {
    line-height: 1;
  }

  &.MuiListItem-button:hover {
    border-radius: 8px;
  }

  &.MuiButtonBase-root.MuiListItem-root.Mui-selected {
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

export const StyledListItemText = styled(ListItemText)`
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
    font-family: ${({ theme }) => theme.fonts.fontFamily};
    font-size: 0.85em;
    font-weight: 400;
    letter-spacing: 0px;
    color: ${({ theme }) => theme.colors.placeHolder};
    text-transform: none;
  }
`

const TextAndBadgeWrapper = styled.div`
  flex: 1 1 auto;
`

const StyledBadge = styled(Badge)`
  .MuiBadge-badge {
    top: 50%;
    right: -1rem;
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
  badge?: boolean
  disabled?: boolean
  label: string
  href: string
  icon?: React.ReactNode
  selected?: boolean
  subItems?: ListItemType[]
}

const isSubItemSelected = (item: ListItemType): boolean => item.subItems?.some(({ selected }) => selected) || false

type Props = {
  items: ListItemType[]
}

const List = ({ items }: Props): React.ReactElement => {
  const classes = useStyles()
  const history = useHistory()
  const [groupCollapseStatus, setGroupCollapseStatus] = useState({})

  const onItemClick = (item: ListItemType, event: MouseEvent) => {
    if (item.subItems) {
      // When we are viewing a subItem of this element we just toggle the expand status
      // preventing navigation
      isSubItemSelected(item) && event.preventDefault()
      // When clicking we toogle item status
      setGroupCollapseStatus((prevStatus) => {
        return { ...prevStatus, ...{ [item.href]: prevStatus[item.href] ? false : true } }
      })
    }
  }

  const getListItem = (item: ListItemType, isSubItem = true) => {
    const onClick = (e) => onItemClick(item, e)

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

        <TextAndBadgeWrapper>
          <StyledBadge badgeContent=" " color="error" invisible={!item.badge} variant="dot">
            <ListItemTextAux primary={item.label} />
          </StyledBadge>
        </TextAndBadgeWrapper>

        {item.subItems &&
          (groupCollapseStatus[item.href] ? <FixedIcon type="chevronUp" /> : <FixedIcon type="chevronDown" />)}
      </ListItemAux>
    )
  }

  useEffect(() => {
    // In the current implementation we only want to allow one expanded item at a time
    // When we click any entry that is not a subItem we want to collapse all current expanded items
    setGroupCollapseStatus({})

    items.forEach((item) => {
      if (isSubItemSelected(item)) {
        setGroupCollapseStatus((prevStatus) => ({ ...prevStatus, ...{ [item.href]: true } }))
      }
    })
  }, [items, history.action, history.location.pathname])

  return (
    <ListMui component="nav" aria-labelledby="nested-list-subheader" className={classes.root}>
      {items
        .filter(({ disabled }) => !disabled)
        .map((item) => (
          <div key={item.label}>
            {getListItem(item, false)}
            {item.subItems && (
              <Collapse in={groupCollapseStatus[item.href]} timeout="auto" unmountOnExit>
                <ListMui component="div" disablePadding>
                  {item.subItems.filter(({ disabled }) => !disabled).map((subItem) => getListItem(subItem))}
                </ListMui>
              </Collapse>
            )}
          </div>
        ))}
    </ListMui>
  )
}

export default List
