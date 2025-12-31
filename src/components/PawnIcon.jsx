import React from 'react';

const PawnIcon = ({ playerIndex, className = "" }) => {
    // 0: Red (Pyramid/Triangle)
    // 1: Green (Cylinder/Circle)
    // 2: Yellow (Cube/Square)
    // 3: Blue (Cone/Teardrop)

    const colors = [
        { main: "#ef4444", dark: "#991b1b", light: "#f87171" }, // Red
        { main: "#22c55e", dark: "#15803d", light: "#4ade80" }, // Green
        { main: "#eab308", dark: "#a16207", light: "#facc15" }, // Yellow
        { main: "#3b82f6", dark: "#1e40af", light: "#60a5fa" }, // Blue
    ];

    const color = colors[playerIndex] || colors[0];

    const renderShape = () => {
        switch (playerIndex) {
            case 0: // Red Pyramid (Top view: Triangle with facets)
                return (
                    <svg viewBox="0 0 100 100" className={className} style={{ filter: 'drop-shadow(0px 4px 2px rgba(0,0,0,0.5))' }}>
                        <path d="M50 10 L90 80 L10 80 Z" fill={color.dark} />
                        <path d="M50 10 L50 60 L90 80 Z" fill={color.main} />
                        <path d="M50 10 L10 80 L50 60 Z" fill={color.light} />
                        {/* Gold Accent */}
                        <circle cx="50" cy="15" r="5" fill="#fbbf24" />
                    </svg>
                );
            case 1: // Green Cylinder (Top view: Concentric circles)
                return (
                    <svg viewBox="0 0 100 100" className={className} style={{ filter: 'drop-shadow(0px 4px 2px rgba(0,0,0,0.5))' }}>
                        <circle cx="50" cy="50" r="40" fill={color.dark} />
                        <circle cx="50" cy="48" r="40" fill={color.main} />
                        <circle cx="50" cy="48" r="25" fill={color.light} opacity="0.3" />
                        <circle cx="50" cy="48" r="15" fill={color.dark} opacity="0.5" />
                        {/* Silver Accent */}
                        <circle cx="50" cy="48" r="8" fill="#e5e7eb" />
                    </svg>
                );
            case 2: // Yellow Cube (Top view: Square with bevel)
                return (
                    <svg viewBox="0 0 100 100" className={className} style={{ filter: 'drop-shadow(0px 4px 2px rgba(0,0,0,0.5))' }}>
                        <rect x="15" y="15" width="70" height="70" rx="4" fill={color.dark} />
                        <rect x="15" y="12" width="70" height="70" rx="4" fill={color.main} />
                        <rect x="25" y="22" width="50" height="50" rx="2" fill={color.light} opacity="0.4" />
                        {/* Gem Accent */}
                        <path d="M35 32 L65 32 L65 62 L35 62 Z" fill="#fff" opacity="0.2" />
                    </svg>
                );
            case 3: // Blue Teardrop/Cone
                return (
                    <svg viewBox="0 0 100 100" className={className} style={{ filter: 'drop-shadow(0px 4px 2px rgba(0,0,0,0.5))' }}>
                        <path d="M50 10 C50 10 90 60 90 75 A40 40 0 1 1 10 75 C10 60 50 10 50 10 Z" fill={color.dark} />
                        <path d="M50 10 C50 10 80 60 80 70 A30 30 0 1 1 20 70 C20 60 50 10 50 10 Z" fill={color.main} transform="translate(0, -2)" />
                        {/* Highlight */}
                        <ellipse cx="65" cy="40" rx="5" ry="15" transform="rotate(20 65 40)" fill="white" opacity="0.3" />
                    </svg>
                );
            default:
                return <div className="w-full h-full rounded-full bg-gray-500" />;
        }
    };

    return renderShape();
};

export default PawnIcon;
