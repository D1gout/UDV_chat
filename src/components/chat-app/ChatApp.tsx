import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Picker from 'emoji-picker-react'

import './chatApp.css'
import { Message } from '../../types/types'

import { FaPaperclip } from 'react-icons/fa6'
import { MdClose } from 'react-icons/md'

const ChatApp: React.FC = () => {
  const [username, setUsername] = useState('')
  const [room, setRoom] = useState('')

  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState('')

  const [selectedQuote, setSelectedQuote] = useState<Message | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)

  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    const savedBackgroundImage = localStorage.getItem('chat_background')
    if (savedBackgroundImage) {
      setBackgroundImage(savedBackgroundImage)
    }
  }, [])

  useEffect(() => {
    const storedSessionId = sessionStorage.getItem('chat_session_id')
    const newSessionId = storedSessionId || uuidv4()
    setSessionId(newSessionId)
    sessionStorage.setItem('chat_session_id', newSessionId)

    if (storedSessionId) {
      const savedUsername = sessionStorage.getItem('chat_username')
      const savedRoom = sessionStorage.getItem('chat_room')

      if (savedUsername && savedRoom) {
        setUsername(savedUsername)
        setRoom(savedRoom)
        setIsAuthenticated(true)
      }
    }
  }, [])

  useEffect(() => {
    if (room) {
      const storedMessages = localStorage.getItem(`chat_messages_${room}`)
      if (storedMessages) setMessages(JSON.parse(storedMessages))
    }
  }, [room])

  useEffect(() => {
    if (room) {
      localStorage.setItem(`chat_messages_${room}`, JSON.stringify(messages))
    }
  }, [messages])

  const handleLogin = () => {
    if (username.trim() && room.trim()) {
      setIsAuthenticated(true)

      sessionStorage.setItem('chat_username', username)
      sessionStorage.setItem('chat_room', room)

      localStorage.setItem(`chat_messages_${room}`, JSON.stringify(messages))
    }
  }

  const handleSendMessage = () => {
    if (!message.trim() && !file) return
    const newMessage: Message = {
      id: uuidv4(),
      user: `${username} (${sessionId.slice(0, 5)})`,
      text: message,
      timestamp: Date.now(),
      quote: selectedQuote || undefined,
      media: file
        ? {
            content: URL.createObjectURL(file),
            type: file.type,
          }
        : undefined,
    }
    setMessages([...messages, newMessage])
    setMessage('')
    setSelectedQuote(null)
    setFile(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setMessage(prev => prev + emojiObject.emoji)
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
        localStorage.setItem('chat_background', imageUrl)
      }

      reader.readAsDataURL(file)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className='chat-container'>
        <h1 className='chat-title'>Вход в чат</h1>
        <input
          className='chat-input'
          placeholder='Введите имя'
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          className='chat-input'
          placeholder='Введите номер комнаты'
          value={room}
          onChange={e => setRoom(e.target.value)}
        />
        <button className='chat-button' onClick={handleLogin}>
          Войти
        </button>
      </div>
    )
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
    </div>
  )
}

export default ChatApp
