import { useState } from 'react'

import Picker from 'emoji-picker-react'

import { ChatButtonsProps } from '../../../types/types'

const ChatButtons: React.FC<ChatButtonsProps> = ({
  setMessage,
  handleSendMessage,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setMessage(prev => prev + emojiObject.emoji)
  }

  return (
    <>
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
    </>
  )
}

export default ChatButtons
