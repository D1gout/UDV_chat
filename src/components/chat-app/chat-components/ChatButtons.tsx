import { useState } from 'react'

import Picker from 'emoji-picker-react'

import { ChatButtonsProps } from '../../../types/types'

const ChatButtons: React.FC<ChatButtonsProps> = ({
  onEmojiClick,
  onSendMessage,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

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
          onEmojiClick={onEmojiClick}
          style={{ marginTop: '8px', width: 'auto' }}
        />
      )}
      <button className='chat-button' onClick={onSendMessage}>
        Отправить
      </button>
    </>
  )
}

export default ChatButtons
