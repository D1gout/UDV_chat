import { FaPaperclip } from 'react-icons/fa6'
import { ChatBackgroundProps } from '../../../types/types'
import { useEffect } from 'react'

const ChatBackground: React.FC<ChatBackgroundProps> = ({
  setBackgroundImage,
}) => {
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

  useEffect(() => {
    const savedBackgroundImage = sessionStorage.getItem('chat_background')
    if (savedBackgroundImage) {
      setBackgroundImage(savedBackgroundImage)
    }
  }, [])

  return (
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
  )
}

export default ChatBackground
