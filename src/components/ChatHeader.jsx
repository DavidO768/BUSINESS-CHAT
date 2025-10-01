import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { Menu, User, Moon, Sun, LogOut } from 'lucide-react'
import './ChatHeader.css'

const ChatHeader = ({ onMenuClick }) => {
  const { user, signOut } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/signin')
  }

  return (
    <header className="chat-header glass-effect">
      <button className="menu-button" onClick={onMenuClick}>
        <Menu size={24} />
      </button>

      <h1 className="chat-title">Gabstep Business Chat</h1>

      <div className="profile-section">
        <button
          className="profile-button"
          onClick={() => setShowMenu(!showMenu)}
        >
          {user?.profile_picture ? (
            <img src={user.profile_picture} alt={user.username} />
          ) : (
            <User size={24} />
          )}
        </button>

        <AnimatePresence>
          {showMenu && (
            <>
              <motion.div
                className="menu-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMenu(false)}
              />
              <motion.div
                className="profile-menu glass-effect"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  className="menu-item"
                  onClick={() => {
                    setShowMenu(false)
                    navigate('/profile')
                  }}
                >
                  <User size={18} />
                  Profile
                </button>
                <button className="menu-item" onClick={toggleTheme}>
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>
                <button className="menu-item logout" onClick={handleLogout}>
                  <LogOut size={18} />
                  Logout
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export default ChatHeader
