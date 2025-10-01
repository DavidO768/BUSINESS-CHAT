import { useState, useRef } from 'react'
import { useChat } from '../context/ChatContext'
import { Send, Paperclip, X, Image as ImageIcon } from 'lucide-react'
import './MessageInput.css'

const MessageInput = ({ replyTo, onCancelReply }) => {
  const { sendMessage, uploadFile, sendTypingIndicator } = useChat()
  const [message, setMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  const handleTyping = (value) => {
    setMessage(value)

    sendTypingIndicator(true)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendTypingIndicator(false)
    }, 1000)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleSend = async () => {
    if (!message.trim() && !selectedFile) return

    setUploading(true)
    let fileUrl = null
    let fileType = null

    if (selectedFile) {
      const result = await uploadFile(selectedFile)
      if (result.success) {
        fileUrl = result.url
        fileType = selectedFile.type
      }
    }

    await sendMessage(
      message.trim(),
      fileUrl,
      fileType,
      replyTo?.id || null,
      null
    )

    setMessage('')
    setSelectedFile(null)
    setUploading(false)
    sendTypingIndicator(false)
    if (onCancelReply) onCancelReply()
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="message-input-container">
      {replyTo && (
        <div className="reply-preview">
          <span>Replying to {replyTo.sender?.username}</span>
          <button onClick={onCancelReply}>
            <X size={16} />
          </button>
        </div>
      )}

      {selectedFile && (
        <div className="file-preview">
          <span>{selectedFile.name}</span>
          <button onClick={() => setSelectedFile(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className="message-input glass-effect">
        <button
          className="attach-button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Paperclip size={20} />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={uploading}
        />

        <button
          className="send-button"
          onClick={handleSend}
          disabled={uploading || (!message.trim() && !selectedFile)}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  )
}

export default MessageInput
