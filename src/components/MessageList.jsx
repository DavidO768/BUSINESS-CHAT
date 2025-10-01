import { useRef, useEffect } from 'react'
import Message from './Message'
import './MessageList.css'

const MessageList = ({ messages, onImageClick, onReply }) => {
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="message-list">
      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
          onImageClick={onImageClick}
          onReply={onReply}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList
