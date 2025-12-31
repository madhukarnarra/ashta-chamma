import React from 'react';
import { motion } from 'framer-motion';

// Procedural Cowrie Shell Component
const CowrieShell = ({ isFaceUp }) => {
    return (
        <div style={{
            width: '100%', height: '100%',
            borderRadius: '45%',
            backgroundColor: isFaceUp ? '#fdf5e6' : '#d2b48c', // Old Lace (Up) vs Tan (Down)
            background: isFaceUp
                ? 'radial-gradient(circle at 30% 30%, #fff 0%, #f0e6d2 60%, #cbaa7b 100%)' // Shiny face up
                : 'linear-gradient(45deg, #8b4513 0%, #a0522d 50%, #8b4513 100%)', // Dark textured back
            position: 'relative',
            boxShadow: 'inset -2px -2px 6px rgba(0,0,0,0.2), 2px 4px 5px rgba(0,0,0,0.3)',
            border: '1px solid rgba(0,0,0,0.1)',
            overflow: 'hidden'
        }}>
            {/* Detail for Face Up: The slit */}
            {isFaceUp && (
                <div style={{
                    position: 'absolute',
                    top: '15%', left: '42%',
                    width: '16%', height: '70%',
                    background: '#3e2723',
                    borderRadius: '10px',
                    boxShadow: 'inset 1px 1px 4px rgba(0,0,0,0.8)'
                }}>
                    {/* Teeth */}
                    <div style={{ position: 'absolute', left: '-2px', top: '10%', width: '4px', height: '80%', borderRight: '2px dashed #fff', opacity: 0.6 }}></div>
                    <div style={{ position: 'absolute', right: '-2px', top: '10%', width: '4px', height: '80%', borderLeft: '2px dashed #fff', opacity: 0.6 }}></div>
                </div>
            )}

            {/* Detail for Face Down: Texture ridge */}
            {!isFaceUp && (
                <div style={{
                    position: 'absolute',
                    top: '0', left: '45%',
                    width: '10%', height: '100%',
                    background: 'rgba(255,255,255,0.1)',
                    filter: 'blur(1px)'
                }} />
            )}
        </div>
    );
};

const DiceControl = ({ onRoll, disabled, diceValue, rawDiceState }) => {
    const displayState = rawDiceState || [false, false, false, false];

    return (
        <div className="dice-control" style={{ textAlign: 'center', margin: '1rem' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                marginBottom: '1rem',
                perspective: '500px'
            }}>
                {displayState.map((isFaceUp, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            rotateX: disabled ? 0 : [0, 360, 720, isFaceUp ? 0 : 180],
                            y: disabled ? 0 : [0, -30, 0]
                        }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                        style={{
                            width: '50px',
                            height: '70px', // Elongated for cowrie shape
                            cursor: disabled ? 'default' : 'pointer',
                        }}
                        onClick={!disabled ? () => onRoll() : undefined}
                    >
                        <CowrieShell isFaceUp={isFaceUp} />
                    </motion.div>
                ))}
            </div>

            <button
                onClick={() => onRoll()}
                disabled={disabled}
                style={{ fontSize: '1.2rem', padding: '0.8rem 2rem', fontFamily: 'var(--font-ancient)' }}
            >
                {disabled ? (diceValue ? `Rolled: ${diceValue}` : "Wait...") : "ROLL COWRIES"}
            </button>

            {dispatchText(diceValue)}
        </div>
    );
};

const dispatchText = (val) => {
    if (val === null) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={val}
            style={{ marginTop: '0.5rem', fontSize: '1.5rem', color: 'var(--gold-accent)', fontWeight: 'bold' }}
        >
            {val === 4 ? "CHAMMA! (4)" :
                val === 8 ? "ASHTA! (8)" :
                    val}
        </motion.div>
    )
}

export default DiceControl;
