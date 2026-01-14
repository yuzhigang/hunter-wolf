import { motion } from 'framer-motion';

interface PieceProps {
  type: 'hunter' | 'wolf';
  isSelected?: boolean;
  isValidTarget?: boolean;
  isSnipeTarget?: boolean;
  onClick?: () => void;
}

export default function Piece({
  type,
  isSelected = false,
  isValidTarget = false,
  isSnipeTarget = false,
  onClick,
}: PieceProps) {
  const variants = {
    initial: {
      scale: 0,
      opacity: 0,
    },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 20,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 17,
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        type: 'spring' as const,
        stiffness: 600,
        damping: 15,
      },
    },
    selected: {
      scale: 1.1,
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)',
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 15,
      },
    },
  };

  const baseClasses = 'w-4/5 h-4/5 rounded-full relative';

  const hunterClasses = type === 'hunter'
    ? 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg'
    : 'bg-gradient-to-br from-gray-600 to-gray-800 shadow-lg';

  return (
    <motion.div
      className={`${baseClasses} ${hunterClasses}`}
      variants={variants}
      initial="initial"
      animate={isSelected ? 'selected' : 'animate'}
      whileHover={onClick ? 'hover' : undefined}
      whileTap={onClick ? 'tap' : undefined}
      onClick={onClick}
      style={{
        boxShadow: isSelected
          ? '0 0 25px rgba(59, 130, 246, 0.8), 0 8px 16px rgba(0, 0, 0, 0.3)'
          : isSnipeTarget
            ? '0 0 20px rgba(239, 68, 68, 0.6), 0 6px 12px rgba(0, 0, 0, 0.25)'
            : isValidTarget
              ? '0 0 15px rgba(34, 197, 94, 0.5), 0 4px 8px rgba(0, 0, 0, 0.2)'
              : '0 4px 6px rgba(0, 0, 0, 0.2)',
      }}
    >
      {type === 'hunter' && (
        <>
          <div className="absolute inset-0 rounded-full bg-white opacity-20" />
          <div className="absolute inset-1 rounded-full bg-blue-300 opacity-30" />
          <motion.div
            className="absolute inset-0 rounded-full bg-white opacity-10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </>
      )}

      {type === 'wolf' && (
        <>
          <div className="absolute inset-0 rounded-full bg-gray-500 opacity-20" />
          <div className="absolute inset-1 rounded-full bg-gray-600 opacity-30" />
        </>
      )}
    </motion.div>
  );
}
