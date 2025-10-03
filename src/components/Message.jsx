import { useState } from 'react'
import { motion, AnimatePresence, useMotionValue } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useChat } from '../context/ChatContext'
import { Edit2, Trash2, Reply, FileText } from 'lucide-react'
import './Message.css'

const Message = ({ message, onImageClick, onReply }) => {
  const { user } = useAuth()
  const { updateMessage, deleteMessage } = useChat()
  const [showActions, setShowActions] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)
  const x = useMotionValue(0)
  const isOwnMessage = message.sender_id === user?.id

  const handleEdit = async () => {
    if (editContent.trim() && editContent !== message.content) {
      await updateMessage(message.id, editContent)
    }
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (confirm('Delete this message?')) {
      await deleteMessage(message.id)
    }
  }

  const handleDragEnd = (event, info) => {
    if (info.offset.x < -50) {
      onReply(message)
    }
    x.set(0)
  }

  return (
    <motion.div
      className={`message ${isOwnMessage ? 'own' : 'other'}`}
      drag="x"
      dragConstraints={{ left: -100, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      style={{ x }}
      onClick={() => isOwnMessage && setShowActions(!showActions)}
    >
      <div className="message-avatar">
        {message.sender?.profile_picture ? (
          <img src={message.sender.profile_picture} alt={message.sender.username} />
        ) : (
          <div className="avatar-placeholder">{message.sender?.username[0]?.toUpperCase()}</div>
        )}
      </div>

      <div className="message-content-wrapper">
        <div className="message-header">
          <span className="message-sender">{message.sender?.username}</span>
          <span className="message-time">
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {message.reply_to && (
          <div className="message-reply-to">
            <Reply size={14} />
            <span>{message.reply_to.sender?.username}: {message.reply_to.content?.substring(0, 50)}</span>
          </div>
        )}

        {isEditing ? (
          <div className="message-edit">
            <input
              type="text"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
              autoFocus
            />
            <button onClick={handleEdit}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        ) : (
          <div className="message-bubble glass-effect">
            <p>{message.content}</p>
            {message.edited && <span className="edited-badge">edited</span>}

            {message.file_url && (
              message.file_type?.startsWith('image') ? (
                <img
                  src={message.file_url}
                  alt="Uploaded"
                  className="message-image"
                  onClick={() => onImageClick(message.file_url)}
                />
              ) : (
                <a href={message.file_url} download className="message-file">
                  <FileText size={20} />
                  <span>Download File</span>
                </a>
              )
            )}
          </div>
        )}

        <AnimatePresence>
          {showActions && isOwnMessage && !isEditing && (
            <motion.div
              className="message-actions"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <button onClick={() => setIsEditing(true)}>
                <Edit2 size={16} /> Edit
              </button>
              <button onClick={handleDelete} className="danger">
                <Trash2 size={16} /> Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default Message
