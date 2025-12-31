import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GameRules = ({ isOpen, onClose }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 999999,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px'
                }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        backgroundColor: '#1c1917',
                        borderRadius: '16px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        maxWidth: '672px',
                        width: '100%',
                        maxHeight: '90vh',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div style={{
                        flexShrink: 0,
                        padding: '24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#292524',
                        borderBottom: '1px solid #57534e',
                        borderTopLeftRadius: '16px',
                        borderTopRightRadius: '16px'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <h2 style={{
                                fontSize: '1.875rem',
                                fontWeight: 'bold',
                                color: '#f59e0b',
                                letterSpacing: '0.05em',
                                fontFamily: 'serif',
                                margin: 0
                            }}>
                                ఎలా ఆడాలి
                            </h2>
                            <span style={{ color: '#a8a29e', fontSize: '0.875rem' }}>How to Play</span>
                        </div>
                        <button
                            onClick={onClose}
                            style={{
                                backgroundColor: '#44403c',
                                color: 'white',
                                padding: '8px',
                                borderRadius: '9999px',
                                border: '1px solid #57534e',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            aria-label="Close Rules"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '32px', width: '32px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '24px',
                        color: 'white'
                    }}>

                        {/* Section 1 */}
                        <section style={{
                            backgroundColor: 'rgba(41, 37, 36, 0.5)',
                            padding: '24px',
                            borderRadius: '16px',
                            border: '1px solid #57534e',
                            marginBottom: '32px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                <div style={{
                                    backgroundColor: '#f59e0b',
                                    color: 'black',
                                    fontWeight: 'bold',
                                    height: '40px',
                                    width: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '9999px',
                                    fontSize: '1.25rem'
                                }}>1</div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fcd34d', margin: 0 }}>దాళం వేయండి & కదలండి</h3>
                                    <span style={{ color: '#a8a29e', fontSize: '0.75rem' }}>Roll & Move</span>
                                </div>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', fontSize: '1.125rem', lineHeight: '1.75' }}>
                                    <span style={{ color: '#4ade80', minWidth: '20px' }}>✓</span>
                                    <div>
                                        <span>4 లేదా 8 పడితే మీకు <strong style={{ color: '#fbbf24' }}>బోనస్ టర్న్</strong> వస్తుంది.</span>
                                        <div style={{ color: '#d6d3d1', fontSize: '0.875rem' }}>Roll 4 or 8 to get a Bonus Turn.</div>
                                    </div>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '1.125rem', lineHeight: '1.75' }}>
                                    <span style={{ color: '#4ade80', minWidth: '20px' }}>✓</span>
                                    <div>
                                        <span>కాయను బయటకు తీయడానికి <strong style={{ color: 'white' }}>4 లేదా 8</strong> పడాలి.</span>
                                        <div style={{ color: '#d6d3d1', fontSize: '0.875rem' }}>Need 4 or 8 to unlock a pawn from Base.</div>
                                    </div>
                                </li>
                            </ul>
                        </section>

                        {/* Section 2 */}
                        <section style={{
                            backgroundColor: 'rgba(41, 37, 36, 0.5)',
                            padding: '24px',
                            borderRadius: '16px',
                            border: '1px solid #57534e',
                            marginBottom: '32px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                <div style={{
                                    backgroundColor: '#ef4444',
                                    color: 'black',
                                    fontWeight: 'bold',
                                    height: '40px',
                                    width: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '9999px',
                                    fontSize: '1.25rem'
                                }}>2</div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fca5a5', margin: 0 }}>చంపడం & గెలవడం</h3>
                                    <span style={{ color: '#a8a29e', fontSize: '0.75rem' }}>Kill to Win</span>
                                </div>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', fontSize: '1.125rem', lineHeight: '1.75' }}>
                                    <span style={{ color: '#f87171', minWidth: '20px' }}>⚔️</span>
                                    <div>
                                        <span>ప్రత్యర్థి కాయపైకి వెళ్తే అది <strong style={{ color: '#f87171' }}>చనిపోతుంది</strong> (తిరిగి ఇంటికి చేరుతుంది).</span>
                                        <div style={{ color: '#d6d3d1', fontSize: '0.875rem' }}>Land on an opponent to KILL them.</div>
                                    </div>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', fontSize: '1.125rem', lineHeight: '1.75' }}>
                                    <span style={{ color: '#fbbf24', minWidth: '20px' }}>⚠</span>
                                    <div>
                                        <span>కనీసం ఒక కాయను చంపే వరకు మీరు <strong style={{ color: 'white' }}>లోపలి గదిలోకి</strong> వెళ్లలేరు!</span>
                                        <div style={{ color: '#d6d3d1', fontSize: '0.875rem' }}>Cannot enter inner circle (God House) without a kill.</div>
                                    </div>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '1.125rem', lineHeight: '1.75' }}>
                                    <span style={{ color: '#60a5fa', minWidth: '20px' }}>🛡</span>
                                    <div>
                                        <span><strong style={{ color: 'white' }}>Safe Zones (X)</strong> సురక్షితమైనవి. అక్కడ చంపడం సాధ్యం కాదు.</span>
                                        <div style={{ color: '#d6d3d1', fontSize: '0.875rem' }}>Safe Zones (X) are safe. No killing allowed.</div>
                                    </div>
                                </li>
                            </ul>
                        </section>

                        {/* Section 3 */}
                        <section style={{
                            backgroundColor: 'rgba(41, 37, 36, 0.5)',
                            padding: '24px',
                            borderRadius: '16px',
                            border: '1px solid #57534e'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                <div style={{
                                    backgroundColor: '#eab308',
                                    color: 'black',
                                    fontWeight: 'bold',
                                    height: '40px',
                                    width: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '9999px',
                                    fontSize: '1.25rem'
                                }}>3</div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fde047', margin: 0 }}>విజయం</h3>
                                    <span style={{ color: '#a8a29e', fontSize: '0.75rem' }}>Victory</span>
                                </div>
                            </div>
                            <div style={{ paddingLeft: '56px' }}>
                                <p style={{ fontSize: '1.125rem', lineHeight: '1.75', margin: 0 }}>అన్ని 4 కాయలను మధ్య గదిలోకి చేర్చాలి. మొదట చేర్చిన వారు విజేత!</p>
                                <p style={{ color: '#d6d3d1', fontSize: '0.875rem', margin: '4px 0 0 0' }}>Navigate all 4 pawns to center square. First to get all 4 in wins!</p>
                            </div>
                        </section>

                    </div>

                    {/* Footer CTA */}
                    <div style={{
                        flexShrink: 0,
                        padding: '24px',
                        backgroundColor: '#1c1917',
                        borderTop: '1px solid #292524',
                        borderBottomLeftRadius: '16px',
                        borderBottomRightRadius: '16px'
                    }}>
                        <button
                            onClick={onClose}
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: 'linear-gradient(to right, #d97706, #f59e0b)',
                                color: 'white',
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                borderRadius: '12px',
                                border: '2px solid rgba(251, 191, 36, 0.5)',
                                cursor: 'pointer',
                                transition: 'transform 0.2s'
                            }}
                        >
                            నేను సిద్ధంగా ఉన్నాను (I'M READY TO PLAY)
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default GameRules;
