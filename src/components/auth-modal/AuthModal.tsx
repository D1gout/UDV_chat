import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import './authModal.css'

const AuthModal: React.FC = () => {
  const [username, setUsername] = useState<string>('')
  const [room, setRoom] = useState<string>('')

  const navigate = useNavigate()

  const handleLogin = () => {
    if (username.trim() && room.trim()) {
      sessionStorage.setItem('chat_username', username)
      sessionStorage.setItem('chat_room', room)
      sessionStorage.setItem('auth', 'true')

      if (!localStorage.getItem(`chat_messages_${room}`)) {
        localStorage.setItem(`chat_messages_${room}`, JSON.stringify([]))
      }

      navigate('/chat')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleLogin()
    }
  }

  useEffect(() => {
    const savedUsername = sessionStorage.getItem('chat_username')
    const savedRoom = sessionStorage.getItem('chat_room')

    if (savedUsername && savedRoom) {
      navigate('/chat')
    }
  }, [navigate])

  return (
    <div className='auth-container'>
      <h1 className='auth-title'>Вход в чат</h1>
      <input
        className='auth-input'
        placeholder='Введите имя'
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        className='auth-input'
        placeholder='Введите номер комнаты'
        value={room}
        onChange={e => setRoom(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className='auth-button' onClick={handleLogin}>
        Войти
      </button>
    </div>
  )
}

export default AuthModal
