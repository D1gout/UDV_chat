import { useEffect, useRef, useState } from 'react'
import { storageService } from '../../../services/storageService'

import { ChatMessagesProps, Message } from '../../../types/types'

import { MdClose } from 'react-icons/md'

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  setMessages,
  selectedQuote,
  room,
  setSelectedQuote,
}) => {
  const [isMessagesLoaded, setIsMessagesLoaded] = useState(false)

  const [highlightedMessageId, setHighlightedMessageId] = useState<
    string | null
  >(null)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

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

  useEffect(() => {
    if (highlightedMessageId) {
      const timeout = setTimeout(() => {
        setHighlightedMessageId(null)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [highlightedMessageId])

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

  return (
    <>
      <div className='chat-messages'>
        {messages.map(msg => {
          const mediaContent = msg.media?.content
            ? storageService.getItem(msg.media.content) || msg.media.content
            : null

          const mediaContentQuote = msg.quote?.media?.content
            ? storageService.getItem(msg.quote.media.content) ||
              msg.quote.media.content
            : undefined

          return (
            <div
              key={msg.id}
              id={msg.id}
              className={`chat-message ${
                msg.id === highlightedMessageId ? 'highlight' : ''
              }`}
              onDoubleClick={() => setSelectedQuote(msg)}
            >
              <div className='chat-message-header'>
                <strong>{msg.user}</strong>
                <span className='message-time'>
                  {formatTimestamp(msg.timestamp)}
                </span>
              </div>
              <span>{msg.text}</span>
              {msg.media &&
                mediaContent &&
                (msg.media.type.endsWith('mp4') ? (
                  <video controls className='chat-media'>
                    <source src={mediaContent} type='video/mp4' />
                  </video>
                ) : (
                  <img src={mediaContent} alt='media' className='chat-media' />
                ))}
              {msg.quote && (
                <div
                  className='chat-quote'
                  onClick={() => handleQuoteClick(msg.quote || msg)}
                >
                  <strong>{msg.quote.user}</strong>
                  {msg.quote.text ||
                    (mediaContentQuote && (
                      <>
                        {msg.quote.media?.type.endsWith('mp4') ? (
                          <video controls className='chat-media'>
                            <source src={mediaContentQuote} type='video/mp4' />
                          </video>
                        ) : (
                          <img
                            src={mediaContentQuote}
                            alt='media'
                            className='chat-media'
                          />
                        )}
                      </>
                    ))}
                </div>
              )}
            </div>
          )
        })}
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
    </>
  )
}

export default ChatMessages
