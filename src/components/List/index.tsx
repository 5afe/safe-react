import Badge from '@material-ui/core/Badge'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link, useHistory } from 'react-router-dom'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'

import ListMui from '@material-ui/core/List'
import ListItem, { ListItemProps } from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import { primary, secondary, secondaryText } from 'src/theme/variables'

const ListItemWrapper = styled.div`
  padding: 0 12px;
`

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

  &.MuiListItem-gutters {
    padding-left: 12px;
    padding-right: 12px;
  }

  &.MuiListItem-root {
    padding-top: 9px;
    padding-bottom: 9px;
    span {
      & svg {
        fill: #06fc99;
      }
    }
  }

  &.MuiListItem-root.Mui-selected {
    border: 2px solid #06fc99;
    color: #000;
    border-radius: 8px;
    color: #06fc99;
    span {
      color: #06fc99;

      & svg {
        fill: #06fc99;
      }
    }
    .icon-color {
      fill: #06fc99;
    }
  }

  & .beamer_icon.active {
    background-color: ${secondary} !important;
    top: auto;
    bottom: 10px;
    left: 22px;
    width: 6px;
    height: 6px;
    border: white solid 1px;
    text-indent: -9000px;
  }
`

const subItemLeftSpace = '10px'
const StyledListSubItem = styled(ListItem)<ListItemProps>`
  &.MuiButtonBase-root.MuiListItem-root {
    margin: 4px 0 4px ${subItemLeftSpace};
    width: calc(100% - ${subItemLeftSpace});

    &::before {
      content: '';
      width: 6px;
      height: 1px;
      background: ${primary};
      position: absolute;
      left: -${subItemLeftSpace};
    }
  }

  & .MuiListItemText-root span {
    line-height: 1;
  }

  &.MuiListItem-button:hover {
    border-radius: 8px;
  }

  &.MuiButtonBase-root.MuiListItem-root.Mui-selected {
    border-radius: 8px;
    color: #06fc99;
    span {
      color: #06fc99;
    }
    .icon-color {
      fill: #06fc99;
    }
  }
`

export const StyledListItemText = styled(ListItemText)`
  span {
    font-family: "IBM Plex Mono", monospace;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.5;
    letter-spacing: 0.5px;
    color: #06fc99 !important;
  }
`

const StyledListSubItemText = styled(ListItemText)`
  span {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0;
    color: ${secondaryText} !important;
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
      // backgroundColor: theme.palette.background.paper,
      overflowX: 'auto',
      margin: '8px 0 -4px 0',
      '&::-webkit-scrollbar': {
        width: '0.5em',
      },
      '&::-webkit-scrollbar-track': {
        webkitBoxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
        borderRadius: '20px',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'darkgrey',
        outline: '1px solid #dadada',
        borderRadius: '20px',
      },
    },
    listMui: {
      marginLeft: '20px',
      borderLeft: `1px solid ${primary}`,

      '&::after': {
        content: '""',
        height: '18px',
        width: '1px',
        position: 'absolute',
        bottom: 0,
        left: '-1px',
        background: '#000',
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
        {/* {item.icon && !isSubItem && item.icon} */}

        <TextAndBadgeWrapper>
          <StyledBadge badgeContent=" " color="error" invisible={!item.badge} variant="dot">
            <ListItemTextAux primary={item.label} />
          </StyledBadge>
        </TextAndBadgeWrapper>

        {item.subItems &&
          (groupCollapseStatus[item.href] ? (
            <KeyboardArrowUp fontSize="small" />
          ) : (
            <KeyboardArrowDown fontSize="small" />
          ))}
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
          <ListItemWrapper key={item.label}>
            {getListItem(item, false)}
            {item.subItems && (
              <Collapse in={groupCollapseStatus[item.href]} timeout="auto" unmountOnExit>
                <ListMui component="div" disablePadding className={classes.listMui}>
                  {item.subItems.filter(({ disabled }) => !disabled).map((subItem) => getListItem(subItem))}
                </ListMui>
              </Collapse>
            )}
          </ListItemWrapper>
        ))}
    </ListMui>
  )
}

export default List
