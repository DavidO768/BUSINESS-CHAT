import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, User, Image, Key, UserPlus } from 'lucide-react'
import './Auth.css'

const SignUp = () => {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    profilePicture: '',
    adminPasscode: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAdminField, setShowAdminField] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Show admin passcode field when username is "admin"
    if (name === 'username') {
      setShowAdminField(value.toLowerCase() === 'admin')
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profilePicture: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signUp(
      formData.email,
      formData.password,
      formData.username,
      formData.profilePicture,
      showAdminField,
      formData.adminPasscode
    )

    if (result.success) {
      navigate('/signin')
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card glass-effect"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <h1>Gabstep Business Chat</h1>
          <p>Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <User className="input-icon" size={20} />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group file-input">
            <Image className="input-icon" size={20} />
            <label htmlFor="profile-picture" className="file-label">
              {formData.profilePicture ? 'Profile Picture Selected' : 'Upload Profile Picture'}
            </label>
            <input
              id="profile-picture"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>

          {formData.profilePicture && (
            <div className="profile-preview">
              <img src={formData.profilePicture} alt="Profile Preview" />
            </div>
          )}

          <motion.div
            initial={false}
            animate={{
              height: showAdminField ? 'auto' : 0,
              opacity: showAdminField ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            {showAdminField && (
              <div className="input-group">
                <Key className="input-icon" size={20} />
                <input
                  type="password"
                  name="adminPasscode"
                  placeholder="Admin Passcode"
                  value={formData.adminPasscode}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
          </motion.div>

          {error && <div className="error-message">{error}</div>}

          <motion.button
            type="submit"
            className="auth-button"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <UserPlus size={20} />
            {loading ? 'Creating Account...' : 'Sign Up'}
          </motion.button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/signin" className="auth-link">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default SignUp
