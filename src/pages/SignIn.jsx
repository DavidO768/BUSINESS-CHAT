import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, LogIn, MessageCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

const SignIn = () => {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { success, error } = await signIn(formData.email, formData.password)

    if (success) {
      navigate('/chat')
    } else {
      setError(error || 'Failed to sign in. Please check your credentials.')
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
          <p className="brand-tagline">Connect with your team instantly</p>
        </div>

        {/* Sign in form */}
        <div className="auth-card glass-effect">
          <div className="auth-card-header">
            <h2>Welcome Back</h2>
            <p>Sign in to continue to your workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="auth-error">
                <span>{error}</span>
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
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
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

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? (
                <span className="button-loading">
                  <span className="spinner"></span>
                  Signing in...
                </span>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="auth-link">
                Create one now
              </Link>
            </p>
          </div>
        </div>

        {/* Additional info */}
        <div className="auth-info">
          <p>
            <strong>Admin Access:</strong> Use username "admin" and passcode "Gabstep@768" during signup
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignIn
