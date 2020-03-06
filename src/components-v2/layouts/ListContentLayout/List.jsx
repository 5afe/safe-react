// @flow

import { withStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import React from 'react'
import styled from 'styled-components'

// TODO: move these styles to a generic place
import styles from './style'

const Wrapper = styled.div``

const Item = styled.div`
  border-bottom: solid 2px rgb(232, 231, 230);

  .container {
    display: flex;
    align-items: flex-end;
  }
`

const IconImg = styled.img`
  width: 20px;
  margin-right: 10px;
`
type Props = {
  items: Array<{
    id: string,
    name: string,
    iconUrl?: string,
  }>,
  activeItem: string,
  onItemClick: () => void,
  classes: Object,
}

const List = ({ activeItem, classes, items, onItemClick }: Props) => {
  return (
    <Wrapper>
      {items.map(i => (
        <Item
          className={cn(classes.menuOption, activeItem === i.id && classes.active)}
          key={i.id}
          onClick={() => onItemClick(i.id)}
        >
          <div className="container">
            {i.iconUrl && <IconImg alt={i.name} src={i.iconUrl} />}
            <span>{i.name}</span>
          </div>
        </Item>
      ))}
    </Wrapper>
  )
}

export default withStyles(styles)(List)
