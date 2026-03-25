export type Attachment = {
  type: string
  name: string
  size: string
}

export type MessageSender = {
  name: string
  role: string
  avatar: string
}

export type ChatMessage = {
  id: string | number
  type: 'system' | 'text' | 'file'
  content: string
  timestamp: string
  sender?: MessageSender
  isMe?: boolean
  attachment?: Attachment
}

export type Member = {
  id: number
  name: string
  role: string
  status: 'online' | 'offline'
  avatar: string
  isSpeaking: boolean
}

export type GroupInfo = {
  id: string
  name: string
  subtitle: string
  membersOnline: number
  streak: string
}
