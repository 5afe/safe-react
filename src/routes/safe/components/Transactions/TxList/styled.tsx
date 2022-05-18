import { Text, Accordion, AccordionDetails, AccordionSummary, EthHashInfo } from '@gnosis.pm/safe-react-components'

import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { grey400, lg, md, primary200, primary300, sm } from 'src/theme/variables'
import styled, { css } from 'styled-components'
import { isDeeplinkedTx } from './utils'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
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

export const NoPaddingAccordion = styled(Accordion).attrs((props) =>
  isDeeplinkedTx() ? { expanded: true, ...props } : props,
)`
  &.MuiAccordion-root .MuiAccordionDetails-root {
    padding: 0;
  }
`

export const ActionAccordion = styled(Accordion)`
  &.MuiAccordion-root {
    &:first-child {
      border-top: none;
    }

    &:last-child {
      border-bottom: none;
    }

    &.Mui-expanded {
      &:last-child {
        border-bottom: none;
      }
    }

    .MuiAccordionDetails-root {
      padding: ${lg};
    }
  }
`

export const StyledTransactionsGroup = styled.div`
  box-sizing: border-box;
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 16px 0px;
  width: 100%;
  padding: 0px 8px;
  box-sizing: border-box;
`

export const H2 = styled.h2`
  text-transform: uppercase;
  font-size: smaller;
`

export const SubTitle = styled(Text)`
  margin-bottom: 8px;
  margin-left: 2px;
  font-size: 0.76em;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.placeHolder};
  text-transform: uppercase;
`

export const StyledTransactions = styled.div`
  overflow: hidden;
  width: 100%;

  display: flex;
  flex-direction: column;
  row-gap: 6px;

  & .MuiAccordion-root.highlight .MuiAccordionSummary-root {
    background-color: ${primary200};
  }

  & > .MuiAccordion-root {
    border: 2px solid ${grey400};
    border-radius: 8px;

    &:first-child {
      border: 2px solid ${grey400};
    }

    & .MuiAccordionSummary-root.Mui-expanded,
    & .MuiAccordionSummary-root:hover {
      background-color: ${primary200};
    }

    &.Mui-expanded {
      border: 2px solid ${primary300};
    }
  }
`

export const GroupedTransactionsCard = styled(StyledTransactions)<{ expanded?: boolean }>`
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  background-color: ${({ theme }) => theme.colors.white};

  border: 2px solid ${({ expanded }) => (expanded ? `${primary300}` : `${grey400}`)};
  box-sizing: border-box;
  border-radius: 8px;

  .MuiAccordion-root,
  .MuiAccordionSummary-root,
  .MuiAccordionDetails-root {
    background-color: transparent;

    &:hover,
    &.Mui-expanded {
      background-color: transparent;
    }
  }

  .disclaimer-container {
    background-color: ${({ theme, expanded }) => (expanded ? `${primary200}` : theme.colors.inputField)};
  }

  &:hover {
    background-color: ${primary200};

    .tx-data > div,
    .tx-data ~ div > div {
      background-color: ${primary200};
    }

    .disclaimer-container {
      background-color: transparent;
    }
  }
`
const gridColumns = {
  nonce: '1fr',
  type: '3fr',
  info: '3fr',
  time: '2.5fr',
  votes: '1.5fr',
  actions: '1fr',
  status: '2.5fr',
}

const willBeReplaced = css`
  .will-be-replaced {
    pointer-events: none;
  }

  .will-be-replaced.tx-details-actions button,
  .will-be-replaced img {
    filter: grayscale(1) opacity(0.8) !important;
  }

  .will-be-replaced * {
    pointer-events: none;
    color: gray !important;
    text-decoration: line-through !important;
  }
`

const failedTransaction = css`
  &.failed-transaction {
    div[class^='tx-']:not(.tx-status):not(.tx-nonce) {
      opacity: 0.5;
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
  background-color: ${({ theme }) => theme.colors.inputField};
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
  display: grid;
  gap: 2px;
  grid-template-columns: 2fr 1fr;
  width: 100%;

  & > div {
    display: grid;
    grid-auto-rows: minmax(min-content, max-content);
    grid-template-rows: [tx-summary] minmax(min-content, max-content) [tx-details] minmax(min-content, 1fr);
    line-break: anywhere;
    overflow: hidden;
    word-break: break-all;

    & > div {
      padding: 20px 24px;
      background-color: ${({ theme }) => theme.colors.white};
    }
  }

  .tx-summary {
    background-color: ${({ theme }) => theme.colors.white};
    // grows to the height of tx-owner column
    flex-grow: 1;
    position: relative;

    &.no-data {
      row-span: 2;
    }
  }

  .tx-creation {
    // to occupy the unexistant "owners" column
    grid-column: span 2;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .tx-share {
    position: absolute;
    top: 20px;
    right: 24px;
  }

  .tx-data {
    display: flex;
    flex-direction: column;
    gap: 2px;
    height: 100%;

    & > div:last-of-type {
      flex: 1;
    }

    &.no-owners {
      grid-column: span 2;
    }

    &.no-data {
      gap: 0;
    }
  }

  .tx-details {
    position: relative;

    &.not-executed {
      grid-row-end: span 2;
    }

    &.no-padding {
      padding: 0;
    }
  }

  .tx-owners {
    padding: 24px;
    grid-row-end: span 2;
  }

  .tx-details-actions {
    align-items: flex-end;
    padding-bottom: 24px;
    display: flex;
    gap: 8px;
    justify-content: center;

    button {
      color: ${({ theme }) => theme.colors.white};

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

export const InlineEthHashInfo = styled(EthHashInfo)`
  display: inline-flex;

  span {
    font-weight: bold;
  }
`

export const InlinePrefixedEthHashInfo = styled(PrefixedEthHashInfo)`
  display: inline-flex;

  span {
    font-weight: bold;
  }
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
  height: calc(100vh - 218px);
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
  display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
  height: 100px;
`

export const StyledAccordionSummary = styled(AccordionSummary).attrs((props) =>
  isDeeplinkedTx() ? { expandIcon: null, ...props } : props,
)`
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
export const StyledGridRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2.5fr;
  gap: ${md};
  justify-content: flex-start;
  max-width: 900px;

  & > * {
    flex-shrink: 0;
  }
`

export const StyledTxInfoDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sm};
  margin-bottom: ${md};

  &:last-of-type {
    margin-bottom: 0;
  }
`

export const StyledDetailsTitle = styled(Text)<{ uppercase?: boolean }>`
  text-transform: ${({ uppercase }) => (uppercase ? 'uppercase' : null)};
  letter-spacing: ${({ uppercase }) => (uppercase ? '1px' : null)};
`
