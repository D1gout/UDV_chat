import React, { useState, useEffect, useRef, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

import Picker from 'emoji-picker-react'

import './chatApp.css'

import { Message } from '../../types/types'

import { FaPaperclip } from 'react-icons/fa6'
import { MdClose } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const ChatApp: React.FC = () => {
  const [username, setUsername] = useState('')
  const [room, setRoom] = useState('')

  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [selectedQuote, setSelectedQuote] = useState<Message | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    const savedBackgroundImage = sessionStorage.getItem('chat_background')
    if (savedBackgroundImage) {
      setBackgroundImage(savedBackgroundImage)
    }
  }, [])

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
    if (room) {
      localStorage.setItem(`chat_messages_${room}`, JSON.stringify(messages))
      messagesEndRef.current?.scrollIntoView()
    }
  }, [messages])

  const handleSendMessage = useCallback(() => {
    if (!message.trim() && !file) return
    const newMessage: Message = {
      id: uuidv4(),
      user: username,
      text: message,
      timestamp: Date.now(),
      quote: selectedQuote || undefined,
      media: file
        ? { content: URL.createObjectURL(file), type: file.type }
        : undefined,
    }
    setMessages(prev => {
      localStorage.setItem(`chat_messages_${room}`, JSON.stringify(messages))
      return [...prev, newMessage]
    })
    setMessage('')
    setSelectedQuote(null)
    setFile(null)
    fileInputRef.current && (fileInputRef.current.value = '')
  }, [message, file, selectedQuote, username])

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setMessage(prev => prev + emojiObject.emoji)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onloadend = () => {
        const imageUrl = reader.result as string
        setBackgroundImage(imageUrl)
        sessionStorage.setItem('chat_background', imageUrl)
      }

      reader.readAsDataURL(file)
    }
  }

  const handleExit = () => {
    sessionStorage.removeItem('chat_username')
    sessionStorage.removeItem('chat_room')

    navigate('/')
  }

  return (
    <div
      className='chat-container'
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
      }}
    >
      <h1 className='chat-title'>Чат комнаты {room}</h1>
      <div className='chat-messages'>
        {messages.map(msg => (
          <div
            key={msg.id}
            className='chat-message'
            onClick={() => setSelectedQuote(msg)}
          >
            <strong>{msg.user}:</strong> {msg.text}
            {msg.media &&
              (msg.media.type.endsWith('mp4') ? (
                <video controls className='chat-media'>
                  <source src={msg.media.content} type='video/mp4' />
                </video>
              ) : (
                <img
                  src={msg.media.content}
                  alt='media'
                  className='chat-media'
                />
              ))}
            {msg.quote && (
              <div className='chat-quote'>
                <strong>{msg.quote.user}:</strong>{' '}
                {msg.quote.text || (
                  <>
                    {msg.quote.media?.type.endsWith('mp4') ? (
                      <video controls className='chat-media'>
                        <source
                          src={msg.quote.media.content}
                          type='video/mp4'
                        />
                      </video>
                    ) : (
                      <img
                        src={msg.quote.media?.content}
                        alt='media'
                        className='chat-media'
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {selectedQuote && (
        <div className='chat-selected-quote'>
          Цитата: <strong>{selectedQuote.user}</strong> {selectedQuote.text}
          <button
            className='chat-selected-quote-close'
            onClick={() => setSelectedQuote(null)}
          >
            <MdClose />
          </button>
        </div>
      )}
      <textarea
        className='chat-textarea'
        placeholder='Сообщение'
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className='chat-input-container'>
        <button
          className='chat-file-button'
          onClick={() => fileInputRef.current?.click()}
        >
          <FaPaperclip />
        </button>
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*,video/*'
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {file && (
          <div className='chat-file-preview'>
            {file.type.startsWith('image') ? (
              <img
                src={URL.createObjectURL(file)}
                alt='file-preview'
                className='chat-file-image'
              />
            ) : file.type.startsWith('video') ? (
              <video controls className='chat-file-video'>
                <source src={URL.createObjectURL(file)} type={file.type} />
                Ваш браузер не поддерживает видео.
              </video>
            ) : null}
          </div>
        )}
      </div>
      <button
        className='chat-button'
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
      >
        😊
      </button>
      {showEmojiPicker && (
        <Picker
          onEmojiClick={handleEmojiClick}
          style={{ marginTop: '8px', width: 'auto' }}
        />
      )}
      <button className='chat-button' onClick={handleSendMessage}>
        Отправить
      </button>

      <div className='change-background-button'>
        <label htmlFor='background-upload'>
          <FaPaperclip />
        </label>
        <input
          type='file'
          id='background-upload'
          accept='image/*'
          onChange={handleBackgroundChange}
          style={{ display: 'none' }}
        />
      </div>
      <div className='chat-close-button' onClick={handleExit}>
        <MdClose />
      </div>
    </div>
  )
}

export default ChatApp
