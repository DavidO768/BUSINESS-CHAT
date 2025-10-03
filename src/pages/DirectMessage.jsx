import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Send, Paperclip, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import './DirectMessage.css'

const DirectMessage = () => {
  const { user } = useAuth()
  const { userId } = useParams()
  const navigate = useNavigate()
  const [recipient, setRecipient] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!user) return

    const fetchRecipient = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (error) throw error
        setRecipient(data)
      } catch (error) {
        console.error('Error fetching recipient:', error)
      }
    }

    fetchRecipient()
  }, [userId, user])

  useEffect(() => {
    if (!user || !userId) return

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('direct_messages')
          .select(`
            *,
            sender:profiles!direct_messages_sender_id_fkey(id, username, profile_picture),
            recipient:profiles!direct_messages_recipient_id_fkey(id, username, profile_picture)
          `)
          .or(`and(sender_id.eq.${user.id},recipient_id.eq.${userId}),and(sender_id.eq.${userId},recipient_id.eq.${user.id})`)
          .order('created_at', { ascending: true })

        if (error) throw error
        setMessages(data || [])
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()

    // Subscribe to new messages
    const channel = supabase
      .channel('direct_messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'direct_messages',
          filter: `sender_id=eq.${userId},recipient_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            fetchMessages()
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, userId])

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFile({
          name: selectedFile.name,
          type: selectedFile.type,
          data: reader.result
        })
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSend = async () => {
    if ((!newMessage.trim() && !file) || !user || !userId) return

    try {
      const messageData = {
        sender_id: user.id,
        recipient_id: userId,
        content: newMessage.trim() || null,
        file_url: file?.data || null,
        file_type: file?.type || null,
        read: false
      }

      const { error } = await supabase
        .from('direct_messages')
        .insert([messageData])

      if (error) throw error

      setNewMessage('')
      setFile(null)
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message: ' + error.message)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (loading) {
    return <div className="dm-loading">Loading conversation...</div>
  }

  if (!recipient) {
    return <div className="dm-error">User not found</div>
  }

  // Check if user is allowed to message this person
  const canMessage = user.is_admin || recipient.is_admin

  if (!canMessage) {
    return (
      <div className="dm-error">
        <h2>Access Denied</h2>
        <p>You can only send direct messages to administrators.</p>
        <button onClick={() => navigate('/chat')}>Back to Chat</button>
      </div>
    )
  }

  return (
    <div className="dm-container">
      <div className="dm-header">
        <button className="dm-back-btn" onClick={() => navigate('/chat')}>
          <ArrowLeft size={24} />
        </button>
        <div className="dm-header-info">
          {recipient.profile_picture && (
            <img src={recipient.profile_picture} alt={recipient.username} className="dm-avatar" />
          )}
          <div>
            <h2>{recipient.username}</h2>
            <span className="dm-subtitle">
              {recipient.is_admin ? 'Administrator' : 'User'}
            </span>
          </div>
        </div>
      </div>

      <div className="dm-messages">
        {messages.length === 0 ? (
          <div className="dm-empty">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`dm-message ${message.sender_id === user.id ? 'dm-message-sent' : 'dm-message-received'}`}
            >
              <div className="dm-message-content">
                {message.content && <p>{message.content}</p>}
                {message.file_url && (
                  <div className="dm-message-file">
                    {message.file_type?.startsWith('image/') ? (
                      <img src={message.file_url} alt="Attachment" />
                    ) : (
                      <a href={message.file_url} download className="dm-file-link">
                        <Paperclip size={16} />
                        <span>Download File</span>
                      </a>
                    )}
                  </div>
                )}
                <span className="dm-message-time">
                  {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="dm-input-area">
        {file && (
          <div className="dm-file-preview">
            <span>{file.name}</span>
            <button onClick={() => setFile(null)}>
              <X size={16} />
            </button>
          </div>
        )}
        <div className="dm-input-box">
          <button
            className="dm-file-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Attach file"
          >
            <Paperclip size={20} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            accept="image/*,application/pdf,.doc,.docx"
          />
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${recipient.username}...`}
            rows="1"
          />
          <button
            className="dm-send-btn"
            onClick={handleSend}
            disabled={!newMessage.trim() && !file}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default DirectMessage
