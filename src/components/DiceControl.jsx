import React from 'react';
import { motion } from 'framer-motion';

const CowrieShell = ({ isFaceUp }) => {
    return (
        <div style={{
            width: '100%', height: '100%',
            borderRadius: '45%',
            backgroundColor: isFaceUp ? '#fffdf0' : '#d2b48c',
            border: '2px solid rgba(255,255,255,0.3)',
            filter: 'url(#chalk-filter)',
            position: 'relative'
        }}>
            {isFaceUp && (
                <div style={{
                    position: 'absolute', top: '20%', left: '46%',
                    width: '8%', height: '60%',
                    background: 'rgba(0,0,0,0.5)',
                    borderRadius: '10px'
                }} />
            )}
        </div>
    );
};

const DiceControl = ({ onRoll, disabled, diceValue, rawDiceState }) => {
    const displayState = rawDiceState || [false, false, false, false];

    return (
        <div className="dice-control" style={{ textAlign: 'center', margin: '1rem', filter: 'url(#chalk-filter)' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '15px',
                marginBottom: '1rem',
            }}>
                {displayState.map((isFaceUp, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            rotate: disabled ? (isFaceUp ? 0 : 180) : [0, 90, 180, 270, 360],
                            scale: disabled ? 1 : [1, 1.2, 1]
                        }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
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
            >
                {disabled ? (diceValue ? `Rolled: ${diceValue}` : "Wait...") : "Roll Cowries"}
            </button>

            {diceValue !== null && (
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    key={diceValue}
                    style={{ marginTop: '10px', fontSize: '2rem', color: 'white', fontWeight: '900' }}
                >
                    {diceValue === 4 ? "CHAMMA!" : diceValue === 8 ? "ASHTA!" : diceValue}
                </motion.div>
            )}
        </div>
    );
};

export default DiceControl;
