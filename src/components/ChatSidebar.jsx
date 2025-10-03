import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useChat } from '../context/ChatContext'
import { X, MessageCircle, UserX, Volume2, VolumeX } from 'lucide-react'
import './ChatSidebar.css'

const ChatSidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth()
  const { users, muteUser, blockUser, isChatMuted, toggleChatMute } = useChat()
  const [selectedUser, setSelectedUser] = useState(null)
  const navigate = useNavigate()

  const handleUserAction = async (targetUser, action) => {
    if (action === 'mute' && user?.is_admin) {
      await muteUser(targetUser.id, !targetUser.is_muted)
    } else if (action === 'block' && user?.is_admin) {
      await blockUser(targetUser.id, true)
    } else if (action === 'dm') {
      // Navigate to direct message page
      navigate(`/dm/${targetUser.id}`)
      onClose()
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
          <div
            className="sidebar-overlay"
            onClick={onClose}
          />
          <div className="chat-sidebar glass-effect">
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
                    onClick={() => {
                      // Allow click if: user is admin OR clicking on admin
                      if (user?.is_admin || u.is_admin) {
                        setSelectedUser(u)
                      }
                    }}
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
                    {selectedUser?.id === u.id && (
                      <>
                        <div
                          className="action-overlay"
                          onClick={() => setSelectedUser(null)}
                        />
                        <div className="action-menu glass-effect">
                          {/* Show Send DM button for everyone when applicable */}
                          {(user?.is_admin || u.is_admin) && (
                            <button
                              className="action-item"
                              onClick={() => handleUserAction(u, 'dm')}
                            >
                              <MessageCircle size={16} />
                              Send DM
                            </button>
                          )}
                          
                          {/* Admin-only actions */}
                          {user?.is_admin && (
                            <>
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
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ChatSidebar
