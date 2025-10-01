import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useChat } from '../context/ChatContext'
import { X, MessageCircle, UserX, Volume2, VolumeX } from 'lucide-react'
import './ChatSidebar.css'

const ChatSidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth()
  const { users, muteUser, blockUser, isChatMuted, toggleChatMute } = useChat()
  const [selectedUser, setSelectedUser] = useState(null)

  const handleUserAction = async (targetUser, action) => {
    if (!user?.is_admin) return

    if (action === 'mute') {
      await muteUser(targetUser.id, !targetUser.is_muted)
    } else if (action === 'block') {
      await blockUser(targetUser.id, true)
    } else if (action === 'dm') {
      // Direct message logic would go here
      alert(`Direct message to ${targetUser.username}`)
    }
    setSelectedUser(null)
  }

  const handleToggleChatMute = async () => {
    await toggleChatMute(!isChatMuted)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="chat-sidebar glass-effect"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="sidebar-header">
              <h2>Active Users</h2>
              <button className="close-button" onClick={onClose}>
                <X size={24} />
              </button>
            </div>

            {user?.is_admin && (
              <div className="admin-controls">
                <button
                  className={`admin-button ${isChatMuted ? 'active' : ''}`}
                  onClick={handleToggleChatMute}
                >
                  {isChatMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  {isChatMuted ? 'Unmute Chat' : 'Mute Chat'}
                </button>
              </div>
            )}

            <div className="users-list">
              {users.map((u) => (
                <div key={u.id} className="user-item">
                  <button
                    className="user-button"
                    onClick={() => user?.is_admin && setSelectedUser(u)}
                  >
                    {u.profile_picture ? (
                      <img src={u.profile_picture} alt={u.username} />
                    ) : (
                      <div className="user-avatar">{u.username[0].toUpperCase()}</div>
                    )}
                    <div className="user-info">
                      <span className="user-name">{u.username}</span>
                      {u.is_admin && <span className="admin-badge">Admin</span>}
                      {u.is_muted && <span className="muted-badge">Muted</span>}
                    </div>
                  </button>

                  <AnimatePresence>
                    {selectedUser?.id === u.id && user?.is_admin && (
                      <>
                        <motion.div
                          className="action-overlay"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setSelectedUser(null)}
                        />
                        <motion.div
                          className="action-menu glass-effect"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                        >
                          <button
                            className="action-item"
                            onClick={() => handleUserAction(u, 'mute')}
                          >
                            <VolumeX size={16} />
                            {u.is_muted ? 'Unmute' : 'Mute'}
                          </button>
                          <button
                            className="action-item danger"
                            onClick={() => handleUserAction(u, 'block')}
                          >
                            <UserX size={16} />
                            Block
                          </button>
                          <button
                            className="action-item"
                            onClick={() => handleUserAction(u, 'dm')}
                          >
                            <MessageCircle size={16} />
                            Send DM
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ChatSidebar
