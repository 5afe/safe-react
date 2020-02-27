// @flow
import React from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import TablePagination from '@material-ui/core/TablePagination'
import Card from '@material-ui/core/Card'
import { screenSm, fontColor } from '~/theme/variables'
import Item from './components/Item'
import { getConfiguredSource } from '~/routes/safe/components/Balances/Collectibles/sources'
import type { AssetCollectible, CollectibleData } from '~/routes/safe/components/Balances/Collectibles/types'
import { ETHEREUM_NETWORK } from '~/logic/wallets/getWeb3'
import { safeParamAddressFromStateSelector } from '~/routes/safe/store/selectors'

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

type Props = {
  networkName?: $Values<typeof ETHEREUM_NETWORK>,
}

const Collectibles = ({ networkName = ETHEREUM_NETWORK.RINKEBY }: Props) => {
  const classes = useStyles()
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const [collectibleCategories, setCollectibleCategories] = React.useState<CollectibleData[]>([])

  React.useEffect(() => {
    const retrieveCollectibleInfo = async () => {
      const source = getConfiguredSource()
      setCollectibleCategories(await source.fetchAllUserCollectiblesByCategoryAsync(safeAddress, networkName))
    }
    retrieveCollectibleInfo()
  }, [])

  return (
    <Card>
      <div className={classes.cardInner}>
        {collectibleCategories.map(categories => (
          <React.Fragment key={categories.slug}>
            <div className={classes.title}>
              <div className={classes.titleImg} style={{ backgroundImage: `url(${categories.image || ''})` }} />
              <h2 className={classes.titleText}>{categories.title}</h2>
              <div className={classes.titleFiller} />
            </div>
            <div className={classes.gridRow}>
              {categories.data.map((collectible: AssetCollectible) => (
                <Item key={`${collectible.assetAddress}_${collectible.tokenId}`} data={collectible} />
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
