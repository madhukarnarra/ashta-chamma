import React from 'react';

const PawnIcon = ({ playerIndex, className = "" }) => {
    const colors = [
        ["#ff5e62", "#ff9966"], // Red Gradient
        ["#00b09b", "#96c93d"], // Green Gradient
        ["#f7ff00", "#dbcc24"], // Yellow Gradient
        ["#00c6ff", "#0072ff"]  // Blue Gradient
    ];

    const pawnColorPair = colors[playerIndex] || colors[0];

    return (
        <svg viewBox="0 0 100 100" className={className} style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>
            <defs>
                <radialGradient id={`goti-grad-${playerIndex}`} cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor={pawnColorPair[0]} />
                    <stop offset="100%" stopColor={pawnColorPair[1]} />
                </radialGradient>
                <filter id="pawn-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Base Shadow */}
            <circle cx="50" cy="55" r="40" fill="rgba(0,0,0,0.2)" />

            {/* The Body - Stylized 3D Goti */}
            <circle cx="50" cy="50" r="40" fill={`url(#goti-grad-${playerIndex})`} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

            {/* Glossy Top Highlight */}
            <ellipse cx="40" cy="35" rx="15" ry="10" fill="rgba(255,255,255,0.4)" />

            {/* Inner Ring Detail */}
            <circle cx="50" cy="50" r="28" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="4,4" />

            {/* Center Core */}
            <circle cx="50" cy="50" r="8" fill="rgba(255,255,255,0.3)" />
        </svg>
    );
};

export default PawnIcon;
