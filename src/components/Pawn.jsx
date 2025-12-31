import React from 'react';
import { motion } from 'framer-motion';
import PawnIcon from './PawnIcon';

const Pawn = ({ playerIdx, onClick, isCurrentTurn, index, countInCell }) => {
    // Glassy clustering
    const offset = countInCell > 1 ? {
        x: (index % 2) * 25 - 12,
        y: Math.floor(index / 2) * 25 - 12
    } : { x: 0, y: 0 };

    return (
        <motion.div
            layout
            className={`pawn ${isCurrentTurn ? 'active' : ''}`}
            onClick={onClick}
            whileHover={isCurrentTurn ? { scale: 1.1, y: -4 } : {}}
            whileTap={isCurrentTurn ? { scale: 0.95 } : {}}
            initial={false}
            animate={{
                x: offset.x,
                y: offset.y,
                scale: 1
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
                width: '50%',
                height: '50%',
                position: 'absolute',
                zIndex: (isCurrentTurn ? 100 : 10) + index,
                cursor: isCurrentTurn ? 'pointer' : 'default',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <PawnIcon playerIndex={playerIdx} className="w-full h-full" />

            {isCurrentTurn && (
                <motion.div
                    layoutId="active-indicator"
                    style={{
                        position: 'absolute',
                        width: '140%',
                        height: '140%',
                        borderRadius: '50%',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                        pointerEvents: 'none',
                        zIndex: -1
                    }}
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            )}
        </motion.div>
    );
};

export default Pawn;
