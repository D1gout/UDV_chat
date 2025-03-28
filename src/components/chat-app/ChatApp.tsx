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
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const [isMessagesLoaded, setIsMessagesLoaded] = useState(false)
  const [highlightedMessageId, setHighlightedMessageId] = useState<
    string | null
  >(null)

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleBackgroundChange = (base64: string | null) => {
    setBackgroundImage(base64)
    sessionStorage.setItem('chat_background', base64 || '')
  }

  const handleQuoteClick = (msg: Message) => {
    const messageElement = document.getElementById(msg.id)
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setHighlightedMessageId(msg.id)
    }
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    const hours = date.getHours().toString()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setMessage(prev => prev + emojiObject.emoji)
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

  useEffect(() => {
    if (room) {
      const storedMessages = localStorage.getItem(`chat_messages_${room}`)
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages))
      }
      setIsMessagesLoaded(true)
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === `chat_messages_${room}` && event.newValue) {
        setMessages(JSON.parse(event.newValue))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [room])

  useEffect(() => {
    if (isMessagesLoaded) {
      localStorage.setItem(`chat_messages_${room}`, JSON.stringify(messages))
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [messages, isMessagesLoaded])

  useEffect(() => {
    const savedBackgroundImage = sessionStorage.getItem('chat_background')
    if (savedBackgroundImage) {
      setBackgroundImage(savedBackgroundImage)
    }
  }, [])

  useEffect(() => {
    if (highlightedMessageId) {
      const timeout = setTimeout(() => {
        setHighlightedMessageId(null)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [highlightedMessageId])

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
        messagesEndRef={messagesEndRef}
        highlightedMessageId={highlightedMessageId}
        selectedQuote={selectedQuote}
        setSelectedQuote={setSelectedQuote}
        onformatTimestamp={formatTimestamp}
        onQuoteClick={handleQuoteClick}
      />

      <ChatInput
        message={message}
        setMessage={setMessage}
        fileInputRef={fileInputRef}
        file={file}
        onKeyDown={handleKeyDown}
        onFileChange={handleFileChange}
      />

      <ChatButtons
        onEmojiClick={handleEmojiClick}
        onSendMessage={handleSendMessage}
      />

      <ChatBackground onBackgroundImageChange={handleBackgroundChange} />

      <div className='chat-close-button' onClick={handleExit}>
        <MdClose />
      </div>
    </div>
  )
}

export default ChatApp
