import React, { useState, useEffect, useRef, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

import './chatApp.css'

import { Message } from '../../types/types'

import { MdClose } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { storageService } from '../../services/storageService'

import ChatMessages from './chat-components/ChatMessages'
import ChatInput from './chat-components/ChatInput'
import ChatBackground from './chat-components/ChatBackground'
import ChatButtons from './chat-components/ChatButtons'

const ChatApp: React.FC = () => {
  const [username, setUsername] = useState('')
  const [room, setRoom] = useState('')

  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState('')

  const [selectedQuote, setSelectedQuote] = useState<Message | null>(null)

  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)

  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const navigate = useNavigate()

  const handleSendMessage = useCallback(() => {
    if (!message.trim() && !file) return

    const newMessage: Message = {
      id: uuidv4(),
      user: username,
      text: message,
      timestamp: Date.now(),
      quote: selectedQuote || undefined,
    }

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        const mediaKey = `media_${uuidv4()}`
        storageService.setItem(mediaKey, base64)

        newMessage.media = { content: mediaKey, type: file.type }

        setMessages(prev => [...prev, newMessage])
        storageService.setItem(
          `chat_messages_${room}`,
          JSON.stringify([...messages, newMessage])
        )
      }
      reader.readAsDataURL(file)
    } else {
      setMessages(prev => [...prev, newMessage])
      storageService.setItem(
        `chat_messages_${room}`,
        JSON.stringify([...messages, newMessage])
      )
    }

    setMessage('')
    setSelectedQuote(null)
    setFile(null)
    fileInputRef.current && (fileInputRef.current.value = '')
  }, [message, file, selectedQuote, username, room])

  const handleExit = () => {
    sessionStorage.removeItem('chat_username')
    sessionStorage.removeItem('chat_room')

    navigate('/')
  }

  useEffect(() => {
    const storedSessionId = sessionStorage.getItem('chat_session_id')
    const savedUsername = sessionStorage.getItem('chat_username')
    const savedRoom = sessionStorage.getItem('chat_room')

    const newSessionId = storedSessionId || uuidv4()
    sessionStorage.setItem('chat_session_id', newSessionId)

    if (storedSessionId && savedUsername && savedRoom) {
      setUsername(savedUsername)
      setRoom(savedRoom)
    } else {
      navigate('/')
    }
  }, [])

  return (
    <div
      className='chat-container'
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
      }}
    >
      <h1 className='chat-title'>Чат комнаты {room}</h1>

      <ChatMessages
        messages={messages}
        setMessages={setMessages}
        room={room}
        selectedQuote={selectedQuote}
        setSelectedQuote={setSelectedQuote}
      />

      <ChatInput
        message={message}
        setMessage={setMessage}
        handleSendMessage={handleSendMessage}
        fileInputRef={fileInputRef}
        file={file}
        setFile={setFile}
      />

      <ChatButtons
        setMessage={setMessage}
        handleSendMessage={handleSendMessage}
      />

      <ChatBackground setBackgroundImage={setBackgroundImage} />

      <div className='chat-close-button' onClick={handleExit}>
        <MdClose />
      </div>
    </div>
  )
}

export default ChatApp
