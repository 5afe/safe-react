import { Text } from '@gnosis.pm/safe-react-components'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import React, { ReactElement, useState } from 'react'

import Paragraph from 'src/components/layout/Paragraph'
import LinkWithRef from 'src/components/layout/Link'
import { shortVersionOf } from 'src/logic/wallets/ethAddresses'

export const styles = createStyles({
  txDataParagraph: {
    whiteSpace: 'normal',
  },
  linkTxData: {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
})

const useStyles = makeStyles(styles)

export const HexEncodedData = ({
  hexData,
  title,
  limit = 20,
}: {
  hexData: string
  title?: string
  limit?: number
}): ReactElement => {
  const classes = useStyles()
  const [showTxData, setShowTxData] = useState(false)
  const showExpandBtn = hexData.length > limit

  return (
    <div className="tx-hexData">
      {title && (
        <Text size="xl" strong>
          {title}:
        </Text>
      )}
      <Paragraph className={classes.txDataParagraph} noMargin size="md">
        {showExpandBtn ? (
          <>
            {showTxData ? (
              <>
                {hexData}{' '}
                <LinkWithRef
                  aria-label="Hide details of the transaction"
                  className={classes.linkTxData}
                  onClick={() => setShowTxData(false)}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Show Less
                </LinkWithRef>
              </>
            ) : (
              <>
                {shortVersionOf(hexData, limit)}{' '}
                <LinkWithRef
                  aria-label="Show details of the transaction"
                  className={classes.linkTxData}
                  onClick={() => setShowTxData(true)}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Show More
                </LinkWithRef>
              </>
            )}
          </>
        ) : (
          hexData
        )}
      </Paragraph>
    </div>
  )
}
