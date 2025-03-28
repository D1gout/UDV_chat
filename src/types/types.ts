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
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  highlightedMessageId: string | null
  selectedQuote: Message | null
  setSelectedQuote: (msg: Message | null) => void
  onformatTimestamp: (timestamp: number) => string
  onQuoteClick: (msg: Message) => void
}

export interface ChatInputProps {
  message: string
  setMessage: React.Dispatch<React.SetStateAction<string>>
  fileInputRef: React.RefObject<HTMLInputElement | null>
  file: File | null
  onKeyDown: (e: React.KeyboardEvent) => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export interface ChatBackgroundProps {
  onBackgroundImageChange: (base64: string | null) => void
}

export interface ChatButtonsProps {
  onEmojiClick: (emojiObject: { emoji: string }) => void
  onSendMessage: () => void
}
