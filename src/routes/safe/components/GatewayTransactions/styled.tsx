import { Accordion, AccordionDetails, EthHashInfo } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'

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
  flex-grow: 1;
  align-items: center;
`

export const ColumnDisplayAccordionDetails = styled(AccordionDetails)`
  flex-flow: column;
`

export const NoPaddingAccordion = styled(Accordion)`
  &.MuiAccordion-root {
    background-color: transparent;
    .MuiAccordionSummary-root {
      background-color: transparent;
    }
    .MuiAccordionDetails-root {
      padding: 0;
    }
  }
`

export const ActionAccordion = styled(Accordion)`
  &.MuiAccordion-root {
    &:first-child {
      border-top: none;
    }

    &.Mui-expanded {
      &:last-child {
        border-bottom: none;
      }
    }

    .MuiAccordionDetails-root {
      padding: 16px;
    }
  }
`

export const StyledTransactionsGroup = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 16px 8px;
  width: 98%;
`

export const H2 = styled.h2`
  text-transform: uppercase;
  font-size: smaller;
`

export const StyledTransactions = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  box-shadow: #00000026 0 0 8px 2px;
  overflow: hidden;
  width: 100%;

  // '^' to prevent applying rules to the 'Actions' accordion components
  & > .MuiAccordion-root {
    &:first-child {
      border-top: none;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.inputField};

    div {
      background-color: ${({ theme }) => theme.colors.inputField};
    }
  }
`

const gridColumns = {
  nonce: '0.5fr',
  type: '3fr',
  info: '3fr',
  time: '1fr',
  votes: '2fr',
  actions: '2fr',
  status: '3fr',
}

export const StyledTransaction = styled.div`
  display: grid;
  grid-template-columns: ${Object.values(gridColumns).join(' ')};
  width: 100%;

  & > div {
    align-self: center;
  }

  .tx-actions {
    visibility: hidden;
    justify-self: end;
  }

  .tx-status {
    justify-self: end;
    margin-right: 8px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: end;

    p {
      margin-left: 8px;
    }
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.inputField};

    .tx-actions {
      visibility: visible;
    }
  }
`

export const StyledGroupedTransactions = styled(StyledTransaction)`
  // no \`tx-nonce\` column required
  grid-template-columns: ${Object.values(gridColumns).slice(1).join(' ')};
`

export const GroupedTransactions = styled(StyledTransaction)`
  // add a bottom division line for all elements but the last
  &:not(:last-of-type) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.separator};
  }

  // builds the tree-view layout
  .tree-lines {
    height: 100%;
    margin-left: 50%;
    position: relative;
    width: 20%;

    // this is a special case, the first element in the list needs to have a block child component
    // add tree lines line to the first item of the list
    .first-node {
      display: block;
      position: absolute;
      top: -16px;
      width: 100%;

      &::before {
        border-bottom: 2px solid ${({ theme }) => theme.colors.separator};
        border-left: 2px solid ${({ theme }) => theme.colors.separator};
        content: '';
        height: 30px;
        position: absolute;
        top: 0;
        width: 100%;
      }
    }

    // add tree lines to all elements of the list (except for the last one)
    // :last-of-type won't work with classes selector (HTML elements only)
    // as we need block-level elements, we're using paragraphs for .tree-lines and .first-node
    // given that divs are already being used for the transaction row, and both (p and div) are siblings
    &:not(:last-of-type) {
      &::before {
        border-bottom: 2px solid ${({ theme }) => theme.colors.separator};
        border-left: 2px solid ${({ theme }) => theme.colors.separator};
        content: '';
        height: 100%;
        margin-top: 14px;
        position: absolute;
        width: 100%;
      }
    }
  }

  // overrides Accordion styles, as grouped txs behave differently
  > .MuiAccordion-root {
    transition: none;
    border: 0;
    grid-column-end: span 6;
    grid-column-start: 2;

    &:first-child {
      border: 0;
    }

    &.Mui-expanded {
      justify-self: center;
      width: calc(100% - 32px);
      
      &:not(:last-of-type) {
        border-bottom: 2px solid ${({ theme }) => theme.colors.separator};
      }

      &:not(:first-of-type) {
        border-top: 2px solid ${({ theme }) => theme.colors.separator};
        // if two consecutive accordions are expanded, borders will get duplicated
        // this rule is to overlap them
        margin-top: -2px;
      }

      > .MuiAccordionSummary-root {
        padding: 0;
      }
    }
  }
}
`

export const DisclaimerContainer = styled(StyledTransaction)`
  background-color: ${({ theme }) => theme.colors.separator} !important;
  border-radius: 5px;
  margin: 8px;
  padding: 8px;
  width: calc(100% - 32px);

  .nonce {
    grid-column-start: 1;
  }

  .disclaimer {
    grid-column-start: 2;
    grid-column-end: span 6;
  }
`

export const TxDetailsContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.separator} !important;
  column-gap: 2px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: [first] 115px;
  min-height: 115px;
  row-gap: 2px;
  width: 100%;

  & > div {
    background-color: ${({ theme }) => theme.colors.white};
    line-break: anywhere;
    overflow: hidden;
    padding: 8px 16px;
    word-break: break-all;
  }

  .tx-summary {
  }

  .tx-details {
    &.not-executed {
      grid-row-end: span 2;
    }

    &.no-padding {
      padding: 0;
    }
  }

  .tx-owners {
    grid-column-start: 2;
    grid-row-end: span 2;
    grid-row-start: 1;

    &.no-owner {
      grid-row-end: span 3;
    }
  }

  .tx-details-actions {
    align-items: center;
    display: flex;
    height: 60px;
    justify-content: center;

    button {
      color: ${({ theme }) => theme.colors.white};
      margin: 0 8px;

      &:hover {
        color: ${({ theme }) => theme.colors.white};
      }

      &.error {
        background-color: ${({ theme }) => theme.colors.error};

        &:hover {
          background-color: ${({ theme }) => theme.colors.errorHover};
        }
      }

      &.primary {
        background-color: ${({ theme }) => theme.colors.primary};

        &:hover {
          background-color: ${({ theme }) => theme.colors.secondary};
        }
      }
    }
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
    left: -7px;
    position: absolute;
    width: 16px;
    z-index: 2;
  }
`

export const OwnerListItem = styled.li`
  display: flex;
  position: relative;

  &::before {
    border-left: 2px #919191 solid;
    content: '';
    height: 100%;
    left: 0;
    position: absolute;
    z-index: 1;
  }

  &:last-child::before {
    border-left: none;
  }
`

export const InlineEthHashInfo = styled(EthHashInfo)`
  display: inline-flex;
`

export const StyledScrollableBar = styled.div`
  &::-webkit-scrollbar {
    width: 0.7em;
    scroll-behavior: smooth;
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 20px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    outline: 1px solid #dadada;
    border-radius: 20px;
  }

  // firefox experimental
  scrollbar-color: darkgrey #dadada;
  scrollbar-width: thin;
`

export const ScrollableTransactionsContainer = styled(StyledScrollableBar)`
  height: calc(100vh - 225px);
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
`
