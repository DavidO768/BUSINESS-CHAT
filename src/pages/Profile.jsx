import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ArrowLeft, User, Lock, Image, Save } from 'lucide-react'
import './Profile.css'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: user?.username || '',
    profilePicture: user?.profile_picture || '',
    password: '',
  })
  const [message, setMessage] = useState('')

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
    const updates = {}
    
    if (formData.username !== user.username) {
      updates.username = formData.username
    }
    if (formData.profilePicture !== user.profile_picture) {
      updates.profile_picture = formData.profilePicture
    }

    const result = await updateProfile(updates)
    if (result.success) {
      setMessage('Profile updated successfully!')
      setTimeout(() => navigate('/chat'), 1500)
    } else {
      setMessage('Error updating profile')
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-card glass-effect">
        <button className="back-button" onClick={() => navigate('/chat')}>
          <ArrowLeft size={20} />
          Back to Chat
        </button>

        <h1>Profile Settings</h1>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-picture-section">
            {formData.profilePicture && (
              <img src={formData.profilePicture} alt="Profile" />
            )}
            <label htmlFor="profile-pic" className="upload-button">
              <Image size={20} />
              Change Picture
            </label>
            <input
              id="profile-pic"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          <div className="input-group">
            <User className="input-icon" size={20} />
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Username"
              required
            />
          </div>

          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="New Password (optional)"
            />
          </div>

          {message && <div className="message">{message}</div>}

          <button type="submit" className="save-button">
            <Save size={20} />
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile
