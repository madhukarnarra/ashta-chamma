// 5x5 Grid (0-24)
// 0  1  2  3  4
// 5  6  7  8  9
// 10 11 12 13 14
// 15 16 17 18 19
// 20 21 22 23 24

export const SAFE_ZONES = [2, 10, 12, 14, 22, 6, 8, 16, 18]; // Mid-sides, corners, and center
// Note: User description said "middle square of each of the four outer sides" + center.
// Top: 2, Left: 10, Right: 14, Bottom: 22, Center: 12.

export const PLAYER_CONFIG = [
    { id: 0, name: 'Red', color: '#ff4444', startNode: 22, entryMove: 1 }, // Bottom Player
    { id: 1, name: 'Green', color: '#44ff44', startNode: 14, entryMove: 1 }, // Right Player
    { id: 2, name: 'Yellow', color: '#eebb00', startNode: 2, entryMove: 1 }, // Top Player
    { id: 3, name: 'Blue', color: '#4444ff', startNode: 10, entryMove: 1 }, // Left Player
];

// Spiral Paths for each player
// They enter at their specific start node (after rolling 4/8), traverse outer, then inner, then center.
// Outer Ring: 22->23->24->19->14->9->4->3->2->1->0->5->10->15->20->21->(Into Inner)
// Inner Ring: 22->17->12 (Center) -- EXAMPLE, need accurate spiral.

// Accurate Ashta Chamma Spiral Paths (Counter-Clockwise Outer -> Clockwise Inner -> Home)
// Based on traditional 5x5 board movement.

// Player 0 (Bottom, starts 22)
export const PATH_0 = [
    // Outer Ring (Counter-Clockwise)
    22, 23, 24, 19, 14, 9, 4, 3, 2, 1, 0, 5, 10, 15, 20, 21,
    // Inner Ring (Clockwise)
    16, 11, 6, 7, 8, 13, 18, 17,
    // Home
    12
];

// Player 1 (Right, starts 14)
export const PATH_1 = [
    14, 9, 4, 3, 2, 1, 0, 5, 10, 15, 20, 21, 22, 23, 24, 19,
    18, 17, 16, 11, 6, 7, 8, 13,
    12
];

// Player 2 (Top, starts 2)
export const PATH_2 = [
    2, 1, 0, 5, 10, 15, 20, 21, 22, 23, 24, 19, 14, 9, 4, 3,
    8, 13, 18, 17, 16, 11, 6, 7,
    12
];

// Player 3 (Left, starts 10)
export const PATH_3 = [
    10, 15, 20, 21, 22, 23, 24, 19, 14, 9, 4, 3, 2, 1, 0, 5,
    6, 7, 8, 13, 18, 17, 16, 11,
    12
];

export const PATHS = [PATH_0, PATH_1, PATH_2, PATH_3];
