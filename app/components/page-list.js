import React from 'react'

import { Button, Text, IconAdd, theme } from '@aragon/ui'
import { IconWrapper } from './ui-components'
import styled from 'styled-components'

const PageList = ({ pages, selectedPage = 'Main', create, change }) => (
  <Main>
    <h1>
      <Text color={theme.textSecondary} smallcaps>
        Outline
      </Text>
      <Button onClick={create} mode="text">
        <IconWrapper>
          <IconAdd />
        </IconWrapper>
        <span className="action-label">Create page</span>
      </Button>
    </h1>
    <ul>
      {Object.keys(pages).map(page => (
        <li key={page}>
          <Button mode="text" onClick={e => change(page)}>
            {selectedPage === page ? <strong>{page}</strong> : page}
          </Button>
        </li>
      ))}
    </ul>
  </Main>
)

const Main = styled.aside`
  flex-shrink: 0;
  flex-grow: 0;
  width: 260px;
  margin-left: 30px;
  min-height: 100%;
  h1 {
    margin-bottom: 15px;
    color: ${theme.textSecondary};
    text-transform: lowercase;
    line-height: 30px;
    font-variant: small-caps;
    font-weight: 600;
    font-size: 16px;
    border-bottom: 1px solid ${theme.contentBorder};
    button {
      margin-top: -5px;
      float: right;
      span {
        display: inline;
      }
      .action-label {
        vertical-align: 5px;
      }
    }
  }
`

export default PageList