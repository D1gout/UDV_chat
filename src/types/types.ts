export interface Message {
  id: string
  user: string
  text: string
  timestamp: number
  media?: { content: string; type: string }
  quote?: Message
}
