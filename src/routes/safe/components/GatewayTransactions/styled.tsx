import { Accordion, AccordionDetails, EthHashInfo } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'

export const NoPaddingAccordion = styled(Accordion)`
  &.MuiAccordion-root {
    & .MuiAccordionDetails-root {
      padding: 0;
    }
  }
`

export const ColumnLikeAccordionDetails = styled(AccordionDetails)`
  flex-flow: column;
`

export const StyledTransaction = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr 3fr 1fr 2fr 2fr 2fr;
  width: 100%;

  & > div {
    align-self: center;
  }

  & .tx-status {
    justify-self: end;
    margin-right: 8px;
  }
`

export const H2 = styled.h2`
  text-transform: uppercase;
  font-size: smaller;
`

export const StyledTransactionsGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 98%;
  align-items: flex-start;
  justify-content: flex-start;
  margin: 16px 8px;
`

export const StyledTransactions = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: #00000026 0 0 8px 2px;
  overflow: hidden;
  width: 100%;

  & > .MuiAccordion-root {
    &:first-child {
      border-top: none;
    }
    &:last-child {
      border-bottom: none;
    }
  }

  & .MuiAccordionSummary-root {
    &.Mui-expanded {
      background-color: ${({ theme }) => theme.colors.background};
    }
  }
`

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export const Breadcrumb = styled.div`
  height: 51px;
`

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  align-items: center;
`

export const TxDetailsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: [first] 115px;
  column-gap: 2px;
  row-gap: 2px;
  background-color: #e8e7e6;
  width: 100%;
  min-height: 115px;

  & > div {
    overflow: hidden;
    background-color: white;
    line-break: anywhere;
    padding: 8px 16px;
    word-break: break-all;
  }

  .tx-summary {
  }

  .tx-details {
    &.no-padding {
      padding: 0;
    }
  }

  .tx-owners {
    grid-column-start: 2;
    grid-row-start: 1;
    grid-row-end: span 2;
  }
`

export const OwnerList = styled.ul`
  list-style: none;
  margin: 1em;
  width: 50%;

  .legend {
    padding: 0 1.5em 1.5em 1.5em;
    position: relative;

    .owner-info {
      margin: 5px;
    }

    span {
      color: #008c73;
      font-weight: bold;
    }
  }

  .icon {
    position: absolute;
    width: 16px;
    z-index: 2;
    left: -7px;
  }
`

export const OwnerListItem = styled.li`
  display: flex;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    z-index: 1;
    left: 0;
    height: 100%;
    border-left: 2px #919191 solid;
  }

  &:last-child::before {
    border-left: none;
  }
`

export const InlineEthHashInfo = styled(EthHashInfo)`
  display: inline-flex;
`
