import { useEffect } from 'react'
import { motion } from 'framer-motion'
import './PreLoader.css'

const PreLoader = ({ onLoadComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoadComplete()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onLoadComplete])

  // Chat bubbles with varied sizes and positions
  const chatBubbles = [
    { id: 1, x: 15, y: 20, size: 'small', delay: 0, sent: true },
    { id: 2, x: 75, y: 25, size: 'medium', delay: 0.2, sent: false },
    { id: 3, x: 20, y: 55, size: 'medium', delay: 0.4, sent: true },
    { id: 4, x: 70, y: 60, size: 'small', delay: 0.6, sent: false },
    { id: 5, x: 25, y: 80, size: 'small', delay: 0.8, sent: true },
    { id: 6, x: 80, y: 85, size: 'medium', delay: 1, sent: false },
  ]

  return (
    <div className="preloader">
      {/* Animated background gradient */}
      <div className="preloader-background">
        <div className="gradient-orb gradient-orb-1"></div>
        <div className="gradient-orb gradient-orb-2"></div>
        <div className="gradient-orb gradient-orb-3"></div>
      </div>

      {/* Floating chat bubbles */}
      <div className="chat-bubbles-container">
        {chatBubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className={`chat-bubble chat-bubble-${bubble.size} ${bubble.sent ? 'bubble-sent' : 'bubble-received'}`}
            style={{
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
            }}
            initial={{ opacity: 0, scale: 0, y: 50 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0.8],
              y: [50, 0, 0, -20]
            }}
            transition={{
              duration: 3,
              delay: bubble.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="bubble-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <motion.div
        className="preloader-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Logo with liquid glass effect */}
        <motion.div
          className="logo-container glass-effect"
          animate={{
            boxShadow: [
              '0 8px 32px rgba(4, 120, 87, 0.3)',
              '0 12px 48px rgba(4, 120, 87, 0.5)',
              '0 8px 32px rgba(4, 120, 87, 0.3)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.div
            className="logo-icon"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            💬
          </motion.div>
          <h1 className="app-name">Gabstep</h1>
          <p className="app-subtitle">Business Chat</p>
        </motion.div>

        {/* Loading spinner */}
        <div className="loading-container">
          <motion.div
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </motion.div>
          <p className="loading-text">Connecting to your team...</p>
        </div>

        {/* Progress bar */}
        <div className="progress-bar-container">
          <motion.div
            className="progress-bar"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 3, ease: 'easeOut' }}
          />
        </div>
      </motion.div>
    </div>
  )
}

export default PreLoader
