import React from 'react';
import { motion } from 'framer-motion';

const CowrieShell = ({ isFaceUp }) => {
    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <svg viewBox="0 0 100 150" style={{ width: '100%', height: '100%' }}>
                <defs>
                    <radialGradient id="gilded-shell-grad" cx="40%" cy="40%" r="60%">
                        <stop offset="0%" stopColor="#fff" />
                        <stop offset="70%" stopColor="#f5f5f5" />
                        <stop offset="100%" stopColor="#B8860B" />
                    </radialGradient>
                </defs>

                {/* Gilded Edge Shell */}
                <ellipse cx="50" cy="75" rx="36" ry="61" fill="var(--liquid-gold)" opacity="0.2" />
                <ellipse cx="50" cy="75" rx="34" ry="59" fill="url(#gilded-shell-grad)" />

                {/* Shell Opening (Ventral Side) */}
                {!isFaceUp && (
                    <g>
                        <path d="M50,40 Q62,75 50,110 Q38,75 50,40" fill="#1a1a1a" />
                        <path d="M50,45 Q58,75 50,105" stroke="rgba(255,215,0,0.3)" strokeWidth="0.5" fill="none" />
                    </g>
                )}

                {/* High-Gloss Highlight */}
                <ellipse cx="42" cy="55" rx="10" ry="20" fill="white" opacity="0.4" />
            </svg>
        </div>
    );
};

const DiceControl = ({ onRoll, disabled, diceValue, rawDiceState }) => {
    const displayState = rawDiceState || [false, false, false, false];

    return (
        <div className="dice-control" style={{ textAlign: 'center', padding: '1rem', position: 'relative' }}>
            {/* Free Floating Shells in Organic Cluster */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '12px',
                height: '100px',
                marginBottom: '1rem',
            }}>
                {displayState.map((isFaceUp, i) => (
                    <motion.div
                        key={i}
                        animate={disabled ? {
                            rotate: isFaceUp ? 0 : [0, 180],
                            scale: 1,
                            y: 0,
                            x: 0
                        } : {
                            rotate: [0, 90, 180, 270, 360],
                            y: [0, -30, 0],
                            x: [0, (i - 1.5) * 10, 0],
                            scale: [1, 1.25, 1]
                        }}
                        transition={{
                            duration: 0.6,
                            delay: i * 0.05,
                            ease: "backOut"
                        }}
                        style={{
                            width: '45px',
                            height: '65px',
                            cursor: disabled ? 'default' : 'pointer',
                            filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.5))'
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
                    boxShadow: '0 0 20px rgba(255,215,0,0.1)'
                }}
            >
                {disabled ? (diceValue || "...") : "ROLL COWRIES"}
            </button>

            {diceValue !== null && (
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={diceValue}
                    style={{
                        marginTop: '15px',
                        fontSize: '2.5rem',
                        color: 'var(--liquid-gold)',
                        fontWeight: '900',
                        textShadow: '0 0 20px var(--gold-glow)'
                    }}
                >
                    {diceValue === 4 ? "CHAMMA!" : diceValue === 8 ? "ASHTA!" : diceValue}
                </motion.div>
            )}
        </div>
    );
};

export default DiceControl;
