import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, UserPlus, Shield, Image, MessageCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

const SignUp = () => {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePicture: '',
    adminPasscode: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState(null)

  const isAdmin = formData.username.toLowerCase() === 'admin'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: reader.result })
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (isAdmin && formData.adminPasscode !== 'Gabstep@768') {
      setError('Invalid admin passcode')
      return
    }

    setLoading(true)

    const { success, error } = await signUp(
      formData.email,
      formData.password,
      formData.username,
      formData.profilePicture,
      isAdmin,
      formData.adminPasscode
    )

    if (success) {
      navigate('/chat')
    } else {
      setError(error || 'Failed to create account. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div className="auth-container">
      {/* Background elements */}
      <div className="auth-background">
        <div className="auth-gradient-orb auth-orb-1"></div>
        <div className="auth-gradient-orb auth-orb-2"></div>
        <div className="auth-gradient-orb auth-orb-3"></div>
      </div>

      {/* Floating chat bubbles decoration */}
      <div className="auth-decoration">
        <div className="floating-bubble bubble-1">
          <MessageCircle size={20} />
        </div>
        <div className="floating-bubble bubble-2">
          <MessageCircle size={16} />
        </div>
        <div className="floating-bubble bubble-3">
          <MessageCircle size={24} />
        </div>
      </div>

      <div className="auth-content">
        {/* Brand section */}
        <div className="auth-brand">
          <div className="brand-icon">💬</div>
          <h1 className="brand-name">Gabstep</h1>
          <p className="brand-tagline">Create your account and start collaborating</p>
        </div>

        {/* Sign up form */}
        <div className="auth-card glass-effect">
          <div className="auth-card-header">
            <h2>Create Account</h2>
            <p>Join your team's workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="auth-error">
                <span>{error}</span>
              </div>
            )}

            {/* Profile Picture Upload */}
            <div className="form-group">
              <label>Profile Picture</label>
              <div className="profile-upload">
                <div className="profile-preview">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" />
                  ) : (
                    <Image size={40} />
                  )}
                </div>
                <label htmlFor="profile-pic" className="upload-button">
                  Choose Image
                </label>
                <input
                  type="file"
                  id="profile-pic"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <User className="input-icon" size={20} />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                  autoComplete="username"
                />
              </div>
              {isAdmin && (
                <p className="input-hint">
                  <Shield size={14} /> Admin account detected
                </p>
              )}
            </div>

            {isAdmin && (
              <div className="form-group admin-field">
                <label htmlFor="adminPasscode">Admin Passcode</label>
                <div className="input-wrapper">
                  <Shield className="input-icon" size={20} />
                  <input
                    type="password"
                    id="adminPasscode"
                    name="adminPasscode"
                    value={formData.adminPasscode}
                    onChange={handleChange}
                    placeholder="Enter admin passcode"
                    required
                    autoComplete="off"
                  />
                </div>
                <p className="input-hint warning">
                  Required for admin privileges
                </p>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@company.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex="-1"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? (
                <span className="button-loading">
                  <span className="spinner"></span>
                  Creating account...
                </span>
              ) : (
                <>
                  <UserPlus size={20} />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/signin" className="auth-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Additional info */}
        <div className="auth-info">
          <p>
            <strong>Note:</strong> For admin access, use username "admin" and passcode "Gabstep@768"
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp
