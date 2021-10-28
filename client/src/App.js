import React from 'react'
import './App.css'
import { Row, Typography } from 'antd'
import MainContainer from './components/MainContainer'

const { Title } = Typography

function App() {
  return (
    <MainContainer path="admin/config">
      <Row>
        <Title>Quản lý các chuỗi</Title>
      </Row>
      Lorem ipsum
    </MainContainer>
  )
}

export default App
