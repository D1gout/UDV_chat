import { storageService } from '../../../services/storageService'

import { ChatMessagesProps } from '../../../types/types'

import { MdClose } from 'react-icons/md'

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  messagesEndRef,
  highlightedMessageId,
  selectedQuote,
  setSelectedQuote,
  onformatTimestamp,
  onQuoteClick,
}) => {
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
                  {onformatTimestamp(msg.timestamp)}
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
                  onClick={() => onQuoteClick(msg.quote || msg)}
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
