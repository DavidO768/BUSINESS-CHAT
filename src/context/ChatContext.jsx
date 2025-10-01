import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const ChatContext = createContext({})

export const useChat = () => useContext(ChatContext)

export const ChatProvider = ({ children }) => {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [typingUsers, setTypingUsers] = useState([])
  const [isChatMuted, setIsChatMuted] = useState(false)

  useEffect(() => {
    if (!user) return

    // Fetch initial messages
    fetchMessages()

    // Fetch users
    fetchUsers()

    // Subscribe to new messages
    const messageSubscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            fetchMessages()
          } else if (payload.eventType === 'UPDATE') {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === payload.new.id ? payload.new : msg
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setMessages((prev) =>
              prev.filter((msg) => msg.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    // Subscribe to typing indicators
    const typingSubscription = supabase
      .channel('typing')
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        setTypingUsers((prev) => {
          const filtered = prev.filter((u) => u.id !== payload.userId)
          if (payload.isTyping) {
            return [...filtered, { id: payload.userId, username: payload.username }]
          }
          return filtered
        })
      })
      .subscribe()

    // Subscribe to user changes
    const userSubscription = supabase
      .channel('profiles')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => {
          fetchUsers()
        }
      )
      .subscribe()

    // Subscribe to chat settings
    const settingsSubscription = supabase
      .channel('chat_settings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_settings' },
        (payload) => {
          if (payload.new?.is_chat_muted !== undefined) {
            setIsChatMuted(payload.new.is_chat_muted)
          }
        }
      )
      .subscribe()

    // Fetch initial chat settings
    fetchChatSettings()

    return () => {
      messageSubscription.unsubscribe()
      typingSubscription.unsubscribe()
      userSubscription.unsubscribe()
      settingsSubscription.unsubscribe()
    }
  }, [user])

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, username, profile_picture),
          reply_to:messages!messages_reply_to_fkey(id, content, sender:profiles!messages_sender_id_fkey(username))
        `)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_blocked', false)

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchChatSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_settings')
        .select('is_chat_muted')
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setIsChatMuted(data?.is_chat_muted || false)
    } catch (error) {
      console.error('Error fetching chat settings:', error)
    }
  }

  const sendMessage = async (content, fileUrl = null, fileType = null, replyTo = null, recipientId = null) => {
    try {
      const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        content,
        file_url: fileUrl,
        file_type: fileType,
        reply_to: replyTo,
        recipient_id: recipientId,
      })

      if (error) throw error
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const updateMessage = async (messageId, content) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ content, edited: true })
        .eq('id', messageId)

      if (error) throw error
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const deleteMessage = async (messageId) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)

      if (error) throw error
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const sendTypingIndicator = (isTyping) => {
    supabase.channel('typing').send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId: user.id, username: user.username, isTyping },
    })
  }

  const toggleChatMute = async (muted) => {
    if (!user?.is_admin) return { success: false, error: 'Admin only' }

    try {
      const { error } = await supabase
        .from('chat_settings')
        .upsert({ id: 1, is_chat_muted: muted })

      if (error) throw error
      setIsChatMuted(muted)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const muteUser = async (userId, muted) => {
    if (!user?.is_admin) return { success: false, error: 'Admin only' }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_muted: muted })
        .eq('id', userId)

      if (error) throw error
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const blockUser = async (userId, blocked) => {
    if (!user?.is_admin) return { success: false, error: 'Admin only' }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_blocked: blocked })
        .eq('id', userId)

      if (error) throw error
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const uploadFile = async (file) => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('chat-files')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('chat-files')
        .getPublicUrl(filePath)

      return { success: true, url: data.publicUrl }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const value = {
    messages,
    users,
    typingUsers,
    isChatMuted,
    sendMessage,
    updateMessage,
    deleteMessage,
    sendTypingIndicator,
    toggleChatMute,
    muteUser,
    blockUser,
    uploadFile,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
