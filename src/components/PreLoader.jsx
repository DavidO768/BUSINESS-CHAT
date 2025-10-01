import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import './PreLoader.css'

const PreLoader = ({ onLoadComplete }) => {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
    }))
    setParticles(newParticles)

    // Complete after 3 seconds
    const timer = setTimeout(() => {
      onLoadComplete()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onLoadComplete])

  return (
    <motion.div
      className="preloader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Particle effects */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="particle"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: [particle.x + '%', (particle.x + 20) % 100 + '%'],
            y: [particle.y + '%', (particle.y - 30) % 100 + '%'],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Logo with pulsating animation */}
      <motion.div
        className="logo-container"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: [0.8, 1.1, 1],
          opacity: 1,
        }}
        transition={{
          duration: 1,
          ease: 'easeOut',
        }}
      >
        <motion.div
          className="logo-circle"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <motion.svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Abstract Gabstep Logo */}
            <motion.path
              d="M60 20 L100 40 L100 80 L60 100 L20 80 L20 40 Z"
              stroke="rgba(255, 255, 255, 0.9)"
              strokeWidth="3"
              fill="rgba(16, 185, 129, 0.3)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
            />
            <motion.circle
              cx="60"
              cy="60"
              r="25"
              stroke="rgba(255, 255, 255, 0.9)"
              strokeWidth="3"
              fill="rgba(16, 185, 129, 0.5)"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            <motion.text
              x="60"
              y="68"
              textAnchor="middle"
              fill="white"
              fontSize="24"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              G
            </motion.text>
          </motion.svg>
        </motion.div>
        <motion.h1
          className="logo-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Gabstep
        </motion.h1>
        <motion.p
          className="logo-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Business Chat
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

export default PreLoader
