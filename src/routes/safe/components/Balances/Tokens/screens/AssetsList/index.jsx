// @flow
import CircularProgress from '@material-ui/core/CircularProgress'
import MuiList from '@material-ui/core/List'
import { makeStyles } from '@material-ui/core/styles'
import Search from '@material-ui/icons/Search'
import cn from 'classnames'
import { List } from 'immutable'
import SearchBar from 'material-ui-search-bar'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { FixedSizeList } from 'react-window'

import { styles } from './style'

import Spacer from '~/components/Spacer'
import Block from '~/components/layout/Block'
import Button from '~/components/layout/Button'
import Divider from '~/components/layout/Divider'
import Hairline from '~/components/layout/Hairline'
import Row from '~/components/layout/Row'
import type { NFTAssetsState } from '~/logic/collectibles/store/reducer/collectibles'
import { nftAssetsListSelector } from '~/logic/collectibles/store/selectors'
import type { NFTAsset } from '~/routes/safe/components/Balances/Collectibles/types'
import AssetRow from '~/routes/safe/components/Balances/Tokens/screens/AssetsList/AssetRow'
import { ADD_CUSTOM_TOKEN_BUTTON_TEST_ID } from '~/routes/safe/components/Balances/Tokens/screens/TokenList'
const useStyles = makeStyles(styles)

type Props = {
  setActiveScreen: Function,
}

const AssetsList = (props: Props) => {
  const classes = useStyles()
  const searchClasses = {
    input: classes.searchInput,
    root: classes.searchRoot,
    iconButton: classes.searchIcon,
    searchContainer: classes.searchContainer,
  }
  const [filterValue, setFilterValue] = useState('')
  const nftAssetsList: NFTAssetsState = useSelector(nftAssetsListSelector)

  const onCancelSearch = () => {
    setFilterValue('')
  }

  const onChangeSearchBar = (value: string) => {
    setFilterValue(value)
  }

  const getItemKey = index => {
    return index
  }

  const onSwitch = (asset: NFTAsset, activeAssetsList: List[]) => {
    return { ...activeAssetsList }
  }

  const createItemData = (assetsList, activeAssetsList) => {
    return {
      assets: assetsList,
      activeAssetsAddresses: assetsList,
      onSwitch: asset => onSwitch(asset, activeAssetsList),
    }
  }

  const itemData = createItemData(nftAssetsList, nftAssetsList)
  const switchToAddCustomAssetScreen = () => props.setActiveScreen('addCustomToken')
  return (
    <>
      <Block className={classes.root}>
        <Row align="center" className={cn(classes.padding, classes.actions)}>
          <Search className={classes.search} />
          <SearchBar
            classes={searchClasses}
            onCancelSearch={onCancelSearch}
            onChange={onChangeSearchBar}
            placeholder="Search by name or symbol"
            searchIcon={<div />}
            value={filterValue}
          />
          <Spacer />
          <Divider />
          <Spacer />
          <Button
            classes={{ label: classes.addBtnLabel }}
            className={classes.add}
            color="primary"
            onClick={switchToAddCustomAssetScreen}
            size="small"
            testId={ADD_CUSTOM_TOKEN_BUTTON_TEST_ID}
            variant="contained"
          >
            + Add custom token
          </Button>
        </Row>
        <Hairline />
      </Block>
      {!nftAssetsList.size && (
        <Block className={classes.progressContainer} justify="center">
          <CircularProgress />
        </Block>
      )}
      {nftAssetsList.size > 0 && (
        <MuiList className={classes.list}>
          <FixedSizeList
            height={413}
            itemCount={nftAssetsList.size}
            itemData={itemData}
            itemKey={getItemKey}
            itemSize={51}
            overscanCount={process.env.NODE_ENV === 'test' ? 100 : 10}
            width={500}
          >
            {AssetRow}
          </FixedSizeList>
        </MuiList>
      )}
    </>
  )
}

export default AssetsList
