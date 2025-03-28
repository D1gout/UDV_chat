import { FaPaperclip } from 'react-icons/fa6'
import { ChatBackgroundProps } from '../../../types/types'

const ChatBackground: React.FC<ChatBackgroundProps> = ({
  onBackgroundImageChange,
}) => {
  return (
    <div className='change-background-button'>
      <label htmlFor='background-upload'>
        <FaPaperclip />
      </label>
      <input
        type='file'
        id='background-upload'
        accept='image/*'
        onChange={onBackgroundImageChange}
        style={{ display: 'none' }}
      />
    </div>
  )
}

export default ChatBackground
