// @flow
import styled from 'styled-components'

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 245px auto;
  grid-template-rows: 500px;
  min-height: 525px;

  .background {
    box-shadow: 1px 2px 10px 0 rgba(212, 212, 211, 0.59);
    background-color: white;
  }
`
// export const Nav = styled.div`
//   grid-column: 1/3;
//   grid-row: 1;
//   margin: 8px 0;
//   padding: 16px 0;
//   box-sizing: border-box;
//   display: flex;
//   justify-content: flex-end;
// `

export const Menu = styled.div.attrs(() => ({ className: 'background' }))`
  grid-column: 1;
  border-right: solid 2px #e8e7e6;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  background-color: white;
`

export const Content = styled.div.attrs(() => ({ className: 'background' }))`
  grid-column: 2;
  border-top-right-radius: 8px;
  background-color: white;
`

export const Footer = styled.div.attrs(() => ({ className: 'background' }))`
  grid-column: 2;
  grid-row: 2;
  border-bottom-right-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
`
