import { useState, useCallback, useEffect } from 'react';
import { PATHS, SAFE_ZONES, PLAYER_CONFIG } from '../constants';
import { soundManager } from '../utils/soundManager';

const START_POSITION = -1;
const HOME_POSITION = 12; // Center index
const ROLL_VALUES = { 0: 8, 1: 1, 2: 2, 3: 3, 4: 4 };

export function useGameState(activePlayerIds = [0, 1, 2, 3]) {

    // Initialize only active players? Or all but skip? 
    // Let's Init ALL, but logic only cycles through activeIds.
    const [players, setPlayers] = useState(
        PLAYER_CONFIG.map((cfg) => ({
            ...cfg,
            pawns: [START_POSITION, START_POSITION, START_POSITION, START_POSITION],
            hasKilled: false,
        }))
    );

    // currentTurnIndex refers to the INDEX in activePlayerIds array, NOT player ID directly
    const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
    const currentPlayerId = activePlayerIds[currentTurnIndex];

    const [diceValue, setDiceValue] = useState(null);
    const [rawDiceState, setRawDiceState] = useState(null);
    const [waitingForMove, setWaitingForMove] = useState(false);
    const [validMoves, setValidMoves] = useState({}); // { pawnIndex: targetBoardIndex }
    const [boardShake, setBoardShake] = useState(false); // Trigger for shake animation

    const [consecutiveSpecialRolls, setConsecutiveSpecialRolls] = useState(0);
    const [gameLog, setGameLog] = useState(['Welcome! Roll cowries to begin.']);
    const [winner, setWinner] = useState(null);

    const log = (msg) => setGameLog(prev => [msg, ...prev].slice(0, 5));

    const rollDice = useCallback(() => {
        if (winner || waitingForMove) return;

        const rolls = Array(4).fill(0).map(() => Math.random() < 0.5);
        const faceUpCount = rolls.filter(Boolean).length;
        const moveValue = ROLL_VALUES[faceUpCount];

        setRawDiceState(rolls);
        setDiceValue(moveValue);

        const isSpecial = moveValue === 4 || moveValue === 8;

        soundManager.playDiceShake();
        setTimeout(() => soundManager.playDiceLand(), 300);

        if (isSpecial) {
            const newConsecutive = consecutiveSpecialRolls + 1;
            setConsecutiveSpecialRolls(newConsecutive);
            log(`Rolled ${moveValue}! (Extra Turn)`);

            if (newConsecutive >= 3) {
                log("Three consecutive Ashtas/Chammas! Turn forfeited.");
                setTimeout(() => endTurn(moveValue), 1000);
                return;
            }
        } else {
            setConsecutiveSpecialRolls(0);
            log(`Rolled ${moveValue}.`);
        }

        const currentPlayer = players[currentPlayerId];
        // Calculate Valid Moves
        const moves = {};
        let hasPossibleMove = false;

        currentPlayer.pawns.forEach((pos, idx) => {
            const can = canMove(currentPlayerId, idx, moveValue);
            if (can) {
                hasPossibleMove = true;
                // Calculate target for highlight
                moves[idx] = calculateTarget(currentPlayerId, pos, moveValue);
            }
        });

        if (hasPossibleMove) {
            setValidMoves(moves);
            setWaitingForMove(true);
        } else {
            setValidMoves({});
            log("No valid moves. Skipping turn...");
            setTimeout(() => endTurn(moveValue), 1500);
        }
    }, [currentPlayerId, players, waitingForMove, consecutiveSpecialRolls, winner]);

    // Helper to get target index without side effects
    const calculateTarget = (pIdx, currentPos, steps) => {
        if (currentPos === START_POSITION) return PATHS[pIdx][0];
        const path = PATHS[pIdx];
        const currentPathIdx = path.indexOf(currentPos);
        return path[currentPathIdx + steps];
    };

    const endTurn = (lastRollValue) => {
        setDiceValue(null);
        setWaitingForMove(false);
        setValidMoves({});
        setBoardShake(false);

        // Logic: If special roll, keep turn (unless forfeited, handled above)
        // But if we are here via "No valid moves", checking special roll is tricky on "loss of turn".
        // Standard rule: If you roll 4/8, you get another turn. Even if you couldn't move the 4/8?
        // Let's say yes, you roll again.
        if (lastRollValue === 4 || lastRollValue === 8) {
            log("Roll again!");
            // Don't switch
        } else {
            setConsecutiveSpecialRolls(0);
            setCurrentTurnIndex((prev) => (prev + 1) % activePlayerIds.length);
        }
    };

    const canMove = (playerIdx, pawnIdx, steps) => {
        const player = players[playerIdx];
        const currentPosIsIndex = player.pawns[pawnIdx];
        if (currentPosIsIndex === START_POSITION) return steps === 4 || steps === 8;

        const path = PATHS[playerIdx];
        const currentPathIndex = path.indexOf(currentPosIsIndex);
        if (currentPathIndex === -1) return false;

        const targetPathIndex = currentPathIndex + steps;
        if (targetPathIndex >= path.length) return false;

        const targetBoardIndex = path[targetPathIndex];

        // Inner Circle Constraint
        if (currentPathIndex <= 15 && targetPathIndex > 15 && !player.hasKilled) {
            return false;
        }

        const isSafe = SAFE_ZONES.includes(targetBoardIndex);
        if (isSafe) return true; // Safe zones always open

        // Capture logic? Always allowed to capture if opponents present.
        // Self-block? Typically allowed.
        return true;
    };

    const movePawn = (pawnIndex) => {
        if (!waitingForMove || !diceValue) return;
        if (!canMove(currentPlayerId, pawnIndex, diceValue)) {
            log("Invalid move!");
            return;
        }

        let extraTurnFromKill = false;
        const newPlayers = [...players];
        const player = newPlayers[currentPlayerId];
        const currentPos = player.pawns[pawnIndex];
        let targetBoardIndex;

        if (currentPos === START_POSITION) {
            targetBoardIndex = PATHS[currentPlayerId][0];
        } else {
            const path = PATHS[currentPlayerId];
            const currentPathIdx = path.indexOf(currentPos);
            targetBoardIndex = path[currentPathIdx + diceValue];
        }

        // Capture Check
        if (!SAFE_ZONES.includes(targetBoardIndex)) {
            newPlayers.forEach((p, pIdx) => {
                if (pIdx !== currentPlayerId && activePlayerIds.includes(pIdx)) { // Only capture active players?
                    p.pawns.forEach((pos, idx) => {
                        if (pos === targetBoardIndex) {
                            p.pawns[idx] = START_POSITION;
                            player.hasKilled = true;
                            extraTurnFromKill = true;
                            setBoardShake(true); // SHAKE ON KILL!
                            log(`Captured ${p.name}'s pawn! Extra Turn!`);
                        }
                    });
                }
            });
        }

        player.pawns[pawnIndex] = targetBoardIndex;
        setPlayers(newPlayers);
        setWaitingForMove(false);
        setValidMoves({}); // Clear highlights
        soundManager.playMove();

        if (targetBoardIndex === HOME_POSITION) {
            const allHome = player.pawns.every(p => p === HOME_POSITION);
            if (allHome) {
                setWinner(player);
                soundManager.playWin();
                log(`${player.name} WINS!`);
                return;
            }
        }

        const isSpecial = diceValue === 4 || diceValue === 8;
        if (isSpecial) setBoardShake(true); // Shake on special

        if (isSpecial || extraTurnFromKill) {
            setDiceValue(null);
            // Don't clear shake immediately to allow anim
            setTimeout(() => setBoardShake(false), 500);
        } else {
            endTurn(0);
        }
    };

    return {
        players,
        currentPlayer: players[currentPlayerId],
        currentPlayerIndex: currentPlayerId, // Return actual ID
        diceValue,
        rawDiceState,
        validMoves, // Export this
        boardShake, // Export this
        rollDice,
        movePawn,
        gameLog,
        winner,
        waitingForMove
    };
}
