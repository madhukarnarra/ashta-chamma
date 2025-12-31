import React from 'react';
import { motion } from 'framer-motion';
import PawnIcon from './PawnIcon';

const Pawn = ({ playerIdx, onClick, isCurrentTurn, index, countInCell }) => {
    const offset = countInCell > 1 ? {
        x: (index % 2) * 14 - 7, // Wider spread
        y: Math.floor(index / 2) * 14 - 7
    } : { x: 0, y: 0 };

    return (
        <motion.div
            layout
            className={`pawn ${isCurrentTurn ? 'active' : ''}`}
            onClick={onClick}
            initial={false}
            animate={{
                x: offset.x,
                y: offset.y,
                scale: isCurrentTurn ? 1.3 : 1
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
                width: '75%', // Slightly larger for better detail visibility
                height: '75%',
                position: 'absolute',
                zIndex: 10 + index,
                cursor: isCurrentTurn ? 'pointer' : 'default',
            }}
        >
            <PawnIcon playerIndex={playerIdx} className="w-full h-full" />

            {isCurrentTurn && (
                <motion.div
                    animate={{ opacity: [0, 1, 0], scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    style={{
                        position: 'absolute', top: -5, left: -5, right: -5, bottom: -5,
                        border: '3px solid white',
                        borderRadius: '50%',
                        pointerEvents: 'none'
                    }}
                />
            )}
        </motion.div>
    );
};

export default Pawn;
