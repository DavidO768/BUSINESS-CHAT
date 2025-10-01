import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useChat } from '../context/ChatContext'
import { useTheme } from '../context/ThemeContext'
import ChatHeader from '../components/ChatHeader'
import ChatSidebar from '../components/ChatSidebar'
import MessageList from '../components/MessageList'
import MessageInput from '../components/MessageInput'
import Lightbox from '../components/Lightbox'
import './Chat.css'

const Chat = () => {
  const { user } = useAuth()
  const { messages, typingUsers, isChatMuted } = useChat()
  const { isDark } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [replyTo, setReplyTo] = useState(null)

  const canSendMessage = user && !user.is_blocked && (!isChatMuted || user.is_admin) && !user.is_muted

  return (
    <div className="chat-container">
      <ChatHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <ChatSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="chat-main">
        <MessageList
          messages={messages}
          onImageClick={setSelectedImage}
          onReply={setReplyTo}
        />

        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            {typingUsers.map((u) => u.username).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}

        {canSendMessage ? (
          <MessageInput replyTo={replyTo} onCancelReply={() => setReplyTo(null)} />
        ) : (
          <div className="chat-disabled-message">
            {user?.is_blocked
              ? 'You have been blocked from this chat'
              : user?.is_muted
              ? 'You have been muted'
              : 'Chat is currently muted by admin'}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Chat
