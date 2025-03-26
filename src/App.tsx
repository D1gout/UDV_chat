import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './styles/common.css'
import './styles/reset.css'

import ChatApp from './components/chat-app/ChatApp'
import AuthModal from './components/auth-modal/AuthModal'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<AuthModal />} />
        <Route path='/chat' element={<ChatApp />} />
      </Routes>
    </Router>
  )
}

export default App
