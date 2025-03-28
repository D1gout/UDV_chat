import { FaPaperclip } from 'react-icons/fa6'
import { ChatInputProps } from '../../../types/types'

const ChatInput: React.FC<ChatInputProps> = ({
  message,
  setMessage,
  fileInputRef,
  file,
  onKeyDown,
  onFileChange,
}) => {
  return (
    <>
      <textarea
        className='chat-textarea'
        placeholder='Сообщение'
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={onKeyDown}
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
          onChange={onFileChange}
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
    </>
  )
}

export default ChatInput
