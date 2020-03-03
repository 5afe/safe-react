// @flow
import Card from '@material-ui/core/Card'
import TablePagination from '@material-ui/core/TablePagination'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useSelector } from 'react-redux'

import Item from './components/Item'

import { collectiblesSelector } from '~/logic/collectibles/store/selectors'
import type { AssetCollectible } from '~/routes/safe/components/Balances/Collectibles/types'
import { fontColor, screenSm, screenXs } from '~/theme/variables'

const useStyles = makeStyles({
  cardInner: {
    boxSizing: 'border-box',
    maxWidth: '100%',
    padding: '52px 54px',
  },
  gridRow: {
    boxSizing: 'border-box',
    columnGap: '30px',
    display: 'grid',
    gridTemplateColumns: '1fr',
    marginBottom: '45px',
    maxWidth: '100%',
    rowGap: '45px',

    '&:last-child': {
      marginBottom: '0',
    },

    [`@media (min-width: ${screenXs}px)`]: {
      gridTemplateColumns: '1fr 1fr',
    },

    [`@media (min-width: ${screenSm}px)`]: {
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
    },
  },
  title: {
    alignItems: 'center',
    display: 'flex',
    margin: '0 0 18px',
  },
  titleImg: {
    backgroundPosition: '50% 50%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    borderRadius: '50%',
    height: '45px',
    margin: '0 10px 0 0',
    width: '45px',
  },
  titleText: {
    color: fontColor,
    fontSize: '18px',
    fontWeight: 'normal',
    lineHeight: '1.2',
    margin: '0',
  },
  titleFiller: {
    backgroundColor: '#e8e7e6',
    flexGrow: '1',
    height: '2px',
    marginLeft: '40px',
  },
})

const Collectibles = () => {
  const classes = useStyles()
  const collectibleCategories = useSelector(collectiblesSelector)

  return (
    <Card>
      <div className={classes.cardInner}>
        {collectibleCategories &&
          collectibleCategories.valueSeq().map(category => (
            <React.Fragment key={category.slug}>
              <div className={classes.title}>
                <div className={classes.titleImg} style={{ backgroundImage: `url(${category.image || ''})` }} />
                <h2 className={classes.titleText}>{category.title}</h2>
                <div className={classes.titleFiller} />
              </div>
              <div className={classes.gridRow}>
                {category.data.map((collectible: AssetCollectible) => (
                  <Item data={collectible} key={`${collectible.assetAddress}_${collectible.tokenId}`} />
                ))}
              </div>
            </React.Fragment>
          ))}
      </div>
      <TablePagination
        component="div"
        count={11}
        onChangePage={() => {}}
        onChangeRowsPerPage={() => {}}
        page={1}
        rowsPerPage={10}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
      />
    </Card>
  )
}

export default Collectibles
