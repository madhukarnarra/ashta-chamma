import { useState, useCallback, useEffect } from 'react';
import { PATHS, SAFE_ZONES, PLAYER_CONFIG } from '../constants';
import { soundManager } from '../utils/soundManager';

const START_POSITION = -1;
const HOME_POSITION = 12; // Center index
const ROLL_VALUES = { 0: 8, 1: 1, 2: 2, 3: 3, 4: 4 };

export function useGameState(activePlayerIds = [0, 1, 2, 3], aiPlayerIds = []) {

    const [players, setPlayers] = useState(
        PLAYER_CONFIG.map((cfg) => ({
            ...cfg,
            pawns: [START_POSITION, START_POSITION, START_POSITION, START_POSITION],
            hasKilled: false,
        }))
    );

    const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
    const currentPlayerId = activePlayerIds[currentTurnIndex];

    const [diceValue, setDiceValue] = useState(null);
    const [rawDiceState, setRawDiceState] = useState(null);
    const [waitingForMove, setWaitingForMove] = useState(false);
    const [validMoves, setValidMoves] = useState({}); // { pawnIndex: targetBoardIndex }
    const [boardShake, setBoardShake] = useState(false);

    const [consecutiveSpecialRolls, setConsecutiveSpecialRolls] = useState(0);
    const [gameLog, setGameLog] = useState(['Welcome! Roll cowries to begin.']);
    const [winner, setWinner] = useState(null);

    const log = (msg) => setGameLog(prev => [msg, ...prev].slice(0, 5));

    // BIASED ROLL: Increase probability of ASHTA (8)
    // 0 up = 8. If we lower the probability of being face up, 0 up becomes more likely.
    const rollDice = useCallback(() => {
        if (winner || waitingForMove) return;

        // BIAS: 35% chance to be UP, 65% chance to be DOWN.
        // p(8) = 0.65^4 = ~18% (3x increase from baseline 6.25%)
        const rolls = Array(4).fill(0).map(() => Math.random() < 0.35);
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
                log("Three consecutive special rolls! Turn forfeited.");
                setTimeout(() => endTurn(moveValue), 1000);
                return;
            }
        } else {
            setConsecutiveSpecialRolls(0);
            log(`Rolled ${moveValue}.`);
        }

        const currentPlayer = players[currentPlayerId];
        const moves = {};
        let hasPossibleMove = false;

        currentPlayer.pawns.forEach((pos, idx) => {
            const can = canMove(currentPlayerId, idx, moveValue);
            if (can) {
                hasPossibleMove = true;
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

        if (lastRollValue === 4 || lastRollValue === 8) {
            log("Roll again!");
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

        if (currentPathIndex <= 15 && targetPathIndex > 15 && !player.hasKilled) {
            return false;
        }

        return true;
    };

    const movePawn = useCallback((pawnIndex) => {
        if (!waitingForMove || !diceValue) return;
        if (!canMove(currentPlayerId, pawnIndex, diceValue)) {
            log("Invalid move!");
            return;
        }

        let extraTurnFromKill = false;
        const newPlayers = JSON.parse(JSON.stringify(players));
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

        if (!SAFE_ZONES.includes(targetBoardIndex)) {
            newPlayers.forEach((p, pIdx) => {
                if (pIdx !== currentPlayerId && activePlayerIds.includes(pIdx)) {
                    p.pawns.forEach((pos, idx) => {
                        if (pos === targetBoardIndex) {
                            p.pawns[idx] = START_POSITION;
                            player.hasKilled = true;
                            extraTurnFromKill = true;
                            setBoardShake(true);
                            log(`Captured ${p.name}'s pawn! Extra Turn!`);
                        }
                    });
                }
            });
        }

        player.pawns[pawnIndex] = targetBoardIndex;
        setPlayers(newPlayers);
        setWaitingForMove(false);
        setValidMoves({});
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
        if (isSpecial) setBoardShake(true);

        if (isSpecial || extraTurnFromKill) {
            setDiceValue(null);
            setTimeout(() => setBoardShake(false), 500);
        } else {
            endTurn(0);
        }
    }, [waitingForMove, diceValue, currentPlayerId, players, activePlayerIds]);

    // AI LOGIC AUTO-PLAYER
    useEffect(() => {
        if (winner) return;
        if (!aiPlayerIds.includes(currentPlayerId)) return;

        if (!diceValue && !waitingForMove) {
            // AI ROLLED
            const timer = setTimeout(rollDice, 1500);
            return () => clearTimeout(timer);
        }

        if (waitingForMove && diceValue) {
            // AI MOVING
            const timer = setTimeout(() => {
                const moves = Object.keys(validMoves).map(Number);
                if (moves.length === 0) return;

                // Priority Logic:
                // 1. Kill
                // 2. Go to HOME
                // 3. Move pawn already on board (nearest to home)
                // 4. Move from START

                let chosenPawn = moves[0];

                // Check for kills
                const killMove = moves.find(idx => {
                    const target = validMoves[idx];
                    if (SAFE_ZONES.includes(target)) return false;
                    return players.some((p, pIdx) =>
                        pIdx !== currentPlayerId &&
                        activePlayerIds.includes(pIdx) &&
                        p.pawns.some(pos => pos === target)
                    );
                });
                if (killMove !== undefined) chosenPawn = killMove;
                else {
                    // Check for home
                    const homeMove = moves.find(idx => validMoves[idx] === HOME_POSITION);
                    if (homeMove !== undefined) chosenPawn = homeMove;
                    else {
                        // Move furthest along path
                        const path = PATHS[currentPlayerId];
                        let maxPathIdx = -1;
                        moves.forEach(idx => {
                            const pos = players[currentPlayerId].pawns[idx];
                            const pIdx = path.indexOf(pos);
                            if (pIdx > maxPathIdx) {
                                maxPathIdx = pIdx;
                                chosenPawn = idx;
                            }
                        });
                    }
                }

                movePawn(chosenPawn);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [currentPlayerId, diceValue, waitingForMove, aiPlayerIds, validMoves, winner, rollDice, movePawn, players, activePlayerIds]);

    return {
        players,
        currentPlayer: players[currentPlayerId],
        currentPlayerIndex: currentPlayerId,
        diceValue,
        rawDiceState,
        validMoves,
        boardShake,
        rollDice,
        movePawn,
        gameLog,
        winner,
        waitingForMove
    };
}
