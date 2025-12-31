import React from 'react';
import { motion } from 'framer-motion';
import PawnIcon from './PawnIcon';

const Pawn = ({ playerIdx, onClick, isCurrentTurn, index, countInCell }) => {
    // Better distribution for smaller pawns
    // If multiple pawns, arrange them in a small grid within the cell
    const offset = countInCell > 1 ? {
        x: (index % 2) * 20 - 10,
        y: Math.floor(index / 2) * 20 - 10
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
                scale: isCurrentTurn ? 1.2 : 1
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
                width: '45%', // Smaller size as requested
                height: '45%',
                position: 'absolute',
                zIndex: (isCurrentTurn ? 100 : 10) + index,
                cursor: isCurrentTurn ? 'pointer' : 'default',
            }}
        >
            <PawnIcon playerIndex={playerIdx} className="w-full h-full" />

            {isCurrentTurn && (
                <motion.div
                    animate={{ opacity: [0, 0.6, 0], scale: [1, 1.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    style={{
                        position: 'absolute', top: -4, left: -4, right: -4, bottom: -4,
                        border: '2px solid white',
                        borderRadius: '50%',
                        pointerEvents: 'none',
                        filter: 'url(#chalk-filter)'
                    }}
                />
            )}
        </motion.div>
    );
};

export default Pawn;
