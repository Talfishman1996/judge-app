import { motion } from 'motion/react'
import type { ReactNode } from 'react'

type Variant = 'gold' | 'purple' | 'red' | 'ghost' | 'outline'

interface ButtonProps {
  variant?: Variant
  children: ReactNode
  fullWidth?: boolean
  className?: string
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

const variants: Record<Variant, string> = {
  gold: 'bg-judge-gold text-judge-black hover:bg-judge-gold/80 border-2 border-judge-gold',
  purple: 'bg-judge-purple text-white hover:bg-judge-purple/80 border-2 border-judge-purple',
  red: 'bg-judge-red text-white hover:bg-judge-red/80 border-2 border-judge-red',
  ghost: 'bg-transparent text-judge-white/60 hover:text-judge-white hover:bg-judge-white/5',
  outline: 'bg-transparent border-2 border-judge-white/30 text-judge-white hover:bg-judge-white/10'
}

export default function Button({
  variant = 'gold',
  children,
  fullWidth,
  className = '',
  disabled,
  onClick,
  type = 'button'
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`
        px-6 py-3 font-bold tracking-wider transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      disabled={disabled}
    >
      {children}
    </motion.button>
  )
}

// Outline variant with specific colors
interface OutlineButtonProps {
  color?: 'gold' | 'purple' | 'red' | 'white'
  children: ReactNode
  fullWidth?: boolean
  className?: string
  disabled?: boolean
  onClick?: () => void
}

const outlineColors = {
  gold: 'border-judge-gold text-judge-gold hover:bg-judge-gold hover:text-judge-black',
  purple: 'border-judge-purple text-judge-purple hover:bg-judge-purple hover:text-judge-black',
  red: 'border-judge-red text-judge-red hover:bg-judge-red hover:text-white',
  white: 'border-judge-white/30 text-judge-white hover:bg-judge-white/10'
}

export function OutlineButton({
  color = 'gold',
  children,
  fullWidth,
  className = '',
  disabled,
  onClick
}: OutlineButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`
        px-6 py-3 font-bold tracking-wider transition-all duration-200
        bg-transparent border-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${outlineColors[color]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      disabled={disabled}
    >
      {children}
    </motion.button>
  )
}
