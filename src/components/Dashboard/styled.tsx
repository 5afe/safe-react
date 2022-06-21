import { ReactElement } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import { xs, lg, black500, extraLargeFontSize, largeFontSize } from 'src/theme/variables'

export const WidgetContainer = styled.section`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export const DashboardTitle = styled.h1`
  color: ${black500};
  font-size: ${extraLargeFontSize};
  width: 100%;
  margin: 12px 12px -33px;
`

export const WidgetTitle = styled.h2`
  color: ${black500};
  font-size: ${largeFontSize};
  margin-top: 0;
`

export const WidgetBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
`

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${lg};
  border-radius: 8px;
  flex-grow: 1;
  position: relative;
  box-sizing: border-box;
  height: 100%;

  & h2 {
    margin-top: 0;
  }
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: ${xs};
  margin-bottom: 10px;
  padding-right: 26px;
`

export const ViewAllLink = ({ url, text }: { url: string; text?: string }): ReactElement => (
  <StyledLink to={url}>
    {text || 'View All'}
    <ChevronRightIcon />
  </StyledLink>
)
