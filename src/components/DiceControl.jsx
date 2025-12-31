import React from 'react';
import { motion } from 'framer-motion';

const CowrieShell = ({ isFaceUp }) => {
    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <svg viewBox="0 0 100 150" style={{ width: '100%', height: '100%' }}>
                <defs>
                    <radialGradient id="obsidian-shell-grad" cx="40%" cy="40%" r="60%">
                        <stop offset="0%" stopColor="#fff" />
                        <stop offset="60%" stopColor="#f0f0f0" />
                        <stop offset="100%" stopColor="#888" />
                    </radialGradient>
                </defs>
                <ellipse cx="50" cy="75" rx="35" ry="60" fill="url(#obsidian-shell-grad)" opacity="0.95" />
                {!isFaceUp && (
                    <path d="M50,40 Q62,75 50,110 Q38,75 50,40" fill="#111" />
                )}
                <ellipse cx="42" cy="55" rx="8" ry="18" fill="white" opacity="0.3" />
            </svg>
        </div>
    );
};

const DiceControl = ({ onRoll, disabled, diceValue, rawDiceState }) => {
    const displayState = rawDiceState || [false, false, false, false];

    return (
        <div className="dice-control" style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {/* Minimal Background for Dice */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '12px',
                height: '80px',
                marginBottom: '10px',
            }}>
                {displayState.map((isFaceUp, i) => (
                    <motion.div
                        key={i}
                        animate={disabled ? {
                            rotate: isFaceUp ? 0 : 180,
                            scale: 1,
                            y: 0
                        } : {
                            rotate: [0, 90, 180, 270, 360],
                            y: [0, -25, 0],
                            scale: [1, 1.25, 1]
                        }}
                        transition={{
                            duration: 0.6,
                            delay: i * 0.05,
                            ease: "easeInOut"
                        }}
                        style={{
                            width: '40px',
                            height: '55px',
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
                style={{
                    backgroundColor: 'rgba(255,215,0,0.1)',
                    border: '1px solid var(--liquid-gold)',
                    padding: '8px 20px',
                    fontSize: '0.85rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
                }}
            >
                {disabled ? (diceValue || "...") : "ROLL"}
            </button>

            {diceValue !== null && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={diceValue}
                    style={{
                        position: 'absolute',
                        top: '-40px',
                        fontSize: '2rem',
                        color: 'var(--liquid-gold)',
                        fontWeight: '100',
                        letterSpacing: '5px'
                    }}
                >
                    {diceValue}
                </motion.div>
            )}
        </div>
    );
};

export default DiceControl;
