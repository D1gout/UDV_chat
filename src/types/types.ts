export interface Message {
  id: string
  user: string
  text: string
  timestamp: number
  media?: { content: string; type: string }
  quote?: Message
}

export interface ChatMessagesProps {
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  room: string
  selectedQuote: Message | null
  setSelectedQuote: (msg: Message | null) => void
}

export interface ChatInputProps {
  message: string
  setMessage: React.Dispatch<React.SetStateAction<string>>
  handleSendMessage: () => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  file: File | null
  setFile: React.Dispatch<React.SetStateAction<File | null>>
}

export interface ChatBackgroundProps {
  setBackgroundImage: React.Dispatch<React.SetStateAction<string | null>>
}

export interface ChatButtonsProps {
  setMessage: React.Dispatch<React.SetStateAction<string>>
  handleSendMessage: () => void
}
