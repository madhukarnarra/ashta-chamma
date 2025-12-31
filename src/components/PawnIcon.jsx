import React from 'react';

const PawnIcon = ({ playerIndex, className = "" }) => {
    // Liquid Gold Crystal Pieces
    const crystalColors = [
        { main: "#ff4444", glow: "rgba(255, 68, 68, 0.5)" }, // Red
        { main: "#00ff88", glow: "rgba(0, 255, 136, 0.5)" }, // Green
        { main: "#ffff44", glow: "rgba(255, 255, 68, 0.5)" }, // Gold/Yellow
        { main: "#4488ff", glow: "rgba(68, 136, 255, 0.5)" }  // Blue
    ];

    const theme = crystalColors[playerIndex] || crystalColors[0];

    return (
        <svg viewBox="0 0 100 100" className={className} style={{ filter: `drop-shadow(0 0 8px ${theme.glow})` }}>
            <defs>
                <radialGradient id={`liquid-gold-grad-${playerIndex}`} cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.9" />
                    <stop offset="40%" stopColor={theme.main} />
                    <stop offset="100%" stopColor="#000" />
                </radialGradient>
            </defs>
            <g>
                {/* Physical Base (Brass/Gold Tinted) */}
                <ellipse cx="50" cy="90" rx="35" ry="6" fill="rgba(0,0,0,0.4)" />
                <path d="M25,85 Q50,78 75,85 L75,90 Q50,95 25,90 Z" fill="#B8860B" />

                {/* Crystal Stem with Gold Leaf Inlay */}
                <path d="M40,85 Q50,20 60,85" fill={`url(#liquid-gold-grad-${playerIndex})`} stroke="rgba(255, 215, 0, 0.2)" strokeWidth="1" />

                {/* Head (Polished Glass) */}
                <circle cx="50" cy="35" r="18" fill={`url(#liquid-gold-grad-${playerIndex})`} stroke="rgba(255, 215, 0, 0.3)" strokeWidth="0.5" />

                {/* Inner Flicker (Gold Core) */}
                <circle cx="50" cy="35" r="4" fill="white" opacity="0.6" />
                <path d="M48,32 L52,38 M52,32 L48,38" stroke="white" strokeWidth="1" opacity="0.3" />
            </g>
        </svg>
    );
};

export default PawnIcon;
