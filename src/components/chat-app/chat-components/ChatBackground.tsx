import { FaPaperclip } from 'react-icons/fa6'
import { ChatBackgroundProps } from '../../../types/types'

const ChatBackground: React.FC<ChatBackgroundProps> = ({
  onBackgroundImageChange,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onloadend = () => {
        onBackgroundImageChange(reader.result as string)
      }

      reader.readAsDataURL(file)
    }
  }

  return (
    <div className='change-background-button'>
      <label htmlFor='background-upload'>
        <FaPaperclip />
      </label>
      <input
        type='file'
        id='background-upload'
        accept='image/*'
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  )
}

export default ChatBackground
