import { motion } from 'framer-motion'
import { X, ZoomIn, ZoomOut } from 'lucide-react'
import { useState } from 'react'
import './Lightbox.css'

const Lightbox = ({ image, onClose }) => {
  const [scale, setScale] = useState(1)

  return (
    <motion.div
      className="lightbox-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="lightbox-controls">
        <button onClick={() => setScale(Math.min(scale + 0.25, 3))}>
          <ZoomIn size={24} />
        </button>
        <button onClick={() => setScale(Math.max(scale - 0.25, 0.5))}>
          <ZoomOut size={24} />
        </button>
        <button onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      <motion.img
        src={image}
        alt="Full size"
        className="lightbox-image"
        initial={{ scale: 0.8 }}
        animate={{ scale }}
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  )
}

export default Lightbox
