import { useEffect, useState } from 'react'
import Card from '@material-ui/core/Card'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import { VariableSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'

import Item from './components/Item'

import Paragraph from 'src/components/layout/Paragraph'
import { nftAssetsFromNftTokensSelector, orderedNFTAssets } from 'src/logic/collectibles/store/selectors'
import SendModal from 'src/routes/safe/components/Balances/SendModal'
import { fontColor, lg, screenSm, screenXs } from 'src/theme/variables'
import { useAnalytics, SAFE_EVENTS } from 'src/utils/googleAnalytics'
import { NFTToken } from 'src/logic/collectibles/sources/collectibles.d'

const useStyles = makeStyles(
  createStyles({
    cardInner: {
      boxSizing: 'border-box',
      maxWidth: '100%',
      padding: '52px 54px',
    },
    cardOuter: {
      boxShadow: '1px 2px 10px 0 rgba(212, 212, 211, 0.59)',
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
      flexGrow: 1,
      height: '2px',
      marginLeft: '40px',
    },
    noData: {
      fontSize: lg,
      textAlign: 'center',
    },
  }),
)

const Collectibles = (): React.ReactElement => {
  const { trackEvent } = useAnalytics()
  const classes = useStyles()
  const [selectedToken, setSelectedToken] = useState<NFTToken | undefined>()
  const [sendNFTsModalOpen, setSendNFTsModalOpen] = useState(false)

  const nftTokens = useSelector(orderedNFTAssets)
  const nftAssetsFromNftTokens = useSelector(nftAssetsFromNftTokensSelector)

  useEffect(() => {
    trackEvent(SAFE_EVENTS.COLLECTIBLES)
  }, [trackEvent])

  const handleItemSend = (nftToken: NFTToken) => {
    setSelectedToken(nftToken)
    setSendNFTsModalOpen(true)
  }

  if (nftAssetsFromNftTokens.length === 0) {
    return (
      <Card className={classes.cardOuter}>
        <div className={classes.cardInner}>
          <Paragraph className={classes.noData}>No collectibles available</Paragraph>
        </div>
      </Card>
    )
  }

  const getNftTokens = (index: number) => {
    const nftAsset = nftAssetsFromNftTokens[index]
    return nftTokens.filter(({ assetAddress }) => nftAsset.address === assetAddress)
  }

  const getItemSize = (index: number) => {
    const NFT_CARD_HEIGHT = 365
    const nftAmount = getNftTokens(index).length
    const rows = Math.ceil(nftAmount / 4)
    return rows * NFT_CARD_HEIGHT
  }

  return (
    <>
      <AutoSizer>
        {(dimensions) => {
          return (
            <List itemCount={50} itemSize={getItemSize} {...dimensions}>
              {({ index, style, key }) => {
                const nftAsset = nftAssetsFromNftTokens[index]
                if (!nftAsset) {
                  return null
                }
                return (
                  <div style={style} key={key}>
                    <div className={classes.title}>
                      <div className={classes.titleImg} style={{ backgroundImage: `url(${nftAsset.image || ''})` }} />
                      <h2 className={classes.titleText}>{nftAsset.name}</h2>
                      <div className={classes.titleFiller} />
                    </div>
                    <div className={classes.gridRow}>
                      {getNftTokens(index).map((nftToken) => (
                        <Item
                          data={nftToken}
                          key={`${nftAsset.slug}_${nftToken.tokenId}`}
                          onSend={() => handleItemSend(nftToken)}
                        />
                      ))}
                    </div>
                  </div>
                )
              }}
            </List>
          )
        }}
      </AutoSizer>
      <SendModal
        activeScreenType="sendCollectible"
        isOpen={sendNFTsModalOpen}
        onClose={() => setSendNFTsModalOpen(false)}
        selectedToken={selectedToken}
      />
    </>
  )
}

export default Collectibles
