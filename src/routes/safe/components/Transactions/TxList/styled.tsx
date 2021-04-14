import {
  Text,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  EthHashInfo,
  IconText,
} from '@gnosis.pm/safe-react-components'
import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export const Breadcrumb = styled(IconText)`
  p {
    font-weight: bold;
  }
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

export const SubTitle = styled(Text)`
  margin-bottom: 8px;

  font-size: 0.76em;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.placeHolder};
  text-transform: uppercase;
`

export const StyledTransactions = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  box-shadow: #00000026 0 4px 12px 0;
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
`

export const GroupedTransactionsCard = styled(StyledTransactions)`
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  background-color: transparent;
  border-radius: 0;
  box-shadow: none;

  &:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.separator};
  }

  .MuiAccordion-root,
  .MuiAccordionSummary-root,
  .MuiAccordionDetails-root {
    background-color: transparent;

    &:hover,
    &.Mui-expanded {
      background-color: transparent;
    }
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};

    .MuiAccordionDetails-root {
      div[class^='tx-'] {
        background-color: ${({ theme }) => theme.colors.background};
      }
    }

    .disclaimer-container {
      background-color: ${({ theme }) => theme.colors.inputField};
    }
  }
`
const gridColumns = {
  nonce: '0.5fr',
  type: '3fr',
  info: '3fr',
  time: '2.5fr',
  votes: '1.5fr',
  actions: '1fr',
  status: '2.5fr',
}

const willBeReplaced = css`
  .will-be-replaced * {
    color: gray !important;
    text-decoration: line-through !important;
    filter: grayscale(1) opacity(0.8) !important;
  }
`

const failedTransaction = css`
  &.failed-transaction {
    div[class^='tx-']:not(.tx-status):not(.tx-nonce) {
      opacity: 0.5;
    }
  }
`

const onChainRejection = css`
  &.on-chain-rejection {
    background-color: ${({ theme }) => theme.colors.errorTooltip};
    border-left: 4px solid ${({ theme }) => theme.colors.error};
    border-radius: 4px;
    padding-left: 7px;
    height: 22px;
    max-width: 165px;

    > div {
      height: 17px;
      align-items: center;
      padding-top: 3px;
    }

    p {
      font-size: 11px;
      line-height: 16px;
      letter-spacing: 1px;
      font-weight: bold;
      text-transform: uppercase;
      margin-left: -2px;
    }
  }
`

export const StyledTransaction = styled.div`
  ${willBeReplaced};
  ${failedTransaction};

  display: grid;
  grid-template-columns: ${Object.values(gridColumns).join(' ')};
  width: 100%;

  & > div {
    align-self: center;
  }

  .tx-type {
    ${onChainRejection};
  }

  .tx-votes {
    justify-self: center;
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
    .tx-actions {
      visibility: visible;

      &.will-be-replaced {
        visibility: hidden;
      }
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
    margin-left: 30px;
    position: relative;
    width: 30%;

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
        height: 22px;
        position: absolute;
        top: 8px;
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
  background-color: ${({ theme }) => theme.colors.inputField} !important;
  border-radius: 4px;
  margin: 12px 8px 0 12px;
  padding: 8px 12px;
  width: calc(100% - 48px);

  .nonce {
    grid-column-start: 1;
  }

  .disclaimer {
    grid-column-start: 2;
    grid-column-end: span 6;
  }
`

export const TxDetailsContainer = styled.div`
  ${willBeReplaced};

  background-color: ${({ theme }) => theme.colors.separator} !important;
  column-gap: 2px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: minmax(min-content, max-content);
  grid-template-rows: [tx-summary] minmax(min-content, max-content) [tx-details] minmax(min-content, 1fr);
  row-gap: 2px;
  width: 100%;

  & > div {
    background-color: ${({ theme }) => theme.colors.white};
    line-break: anywhere;
    overflow: hidden;
    padding: 20px 24px;
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
    padding: 24px;
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
  margin: 0;
  padding-left: 6px;

  .legend {
    left: 15px;
    padding-bottom: 0.86em;
    position: relative;
    top: -3px;

    .owner-info {
      margin: 5px;
    }

    span {
      color: #008c73;
      font-weight: bold;
    }
  }

  ul {
    margin-top: 0;
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
    border-left: 2px ${({ theme }) => theme.colors.icon} solid;
    border-radius: 1px;
    content: '';
    height: calc(100% - 16px);
    top: 16px;
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
export const Centered = styled.div<{ padding?: number }>`
  width: 100%;
  height: 100%;
  display: flex;
  padding: ${({ padding }) => `${padding}px`};
  justify-content: center;
  align-items: center;
`

export const HorizontallyCentered = styled(Centered)<{ isVisible: boolean }>`
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
  height: 100px;
`

export const StyledAccordionSummary = styled(AccordionSummary)`
  height: 52px;
  .tx-nonce {
    margin: 0 16px 0 8px;
  }
`
export const AlignItemsWithMargin = styled.div`
  display: flex;
  align-items: center;

  span:first-child {
    margin-right: 6px;
  }
`
export const NoTransactions = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 60px;
`
