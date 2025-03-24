import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './styles/common.css'
import './styles/reset.css'

import ChatApp from './components/chat-app/ChatApp'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<ChatApp />} />
      </Routes>
    </Router>
  )
}

export default App
