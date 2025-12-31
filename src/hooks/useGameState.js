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
    const [rankings, setRankings] = useState([]); // Array of player IDs in finish order
    const [gameLog, setGameLog] = useState(['Welcome! Roll cowries to begin.']);

    const log = (msg) => setGameLog(prev => [msg, ...prev].slice(0, 5));

    const rollDice = useCallback(() => {
        if (rankings.length >= activePlayerIds.length - 1 && activePlayerIds.length > 1) return;
        if (waitingForMove) return;

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
    }, [currentPlayerId, players, waitingForMove, consecutiveSpecialRolls, rankings, activePlayerIds]);

    const calculateTarget = (pIdx, currentPos, steps) => {
        if (currentPos === START_POSITION) return PATHS[pIdx][0];
        const path = PATHS[pIdx];
        const currentPathIdx = path.indexOf(currentPos);
        return path[currentPathIdx + steps];
    };

    const nextUnfinishedTurn = (currentIndex) => {
        let next = (currentIndex + 1) % activePlayerIds.length;
        for (let i = 0; i < activePlayerIds.length; i++) {
            const nextId = activePlayerIds[next];
            if (!rankings.includes(nextId)) {
                return next;
            }
            next = (next + 1) % activePlayerIds.length;
        }
        return next;
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
            setCurrentTurnIndex((prev) => nextUnfinishedTurn(prev));
        }
    };

    const canMove = (playerIdx, pawnIdx, steps) => {
        const player = players[playerIdx];
        if (rankings.includes(playerIdx)) return false;

        const currentPosIsIndex = player.pawns[pawnIdx];
        if (currentPosIsIndex === HOME_POSITION) return false;
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

        const isSpecialByValue = diceValue === 4 || diceValue === 8;

        if (targetBoardIndex === HOME_POSITION) {
            const allHome = player.pawns.every(p => p === HOME_POSITION);
            if (allHome) {
                const newRankings = [...rankings, currentPlayerId];
                setRankings(newRankings);
                soundManager.playWin();
                log(`${player.name} finished at Rank ${newRankings.length}!`);

                if (newRankings.length >= activePlayerIds.length - 1 && activePlayerIds.length > 1) {
                    log("Game Finished!");
                } else {
                    setCurrentTurnIndex((prev) => nextUnfinishedTurn(prev));
                }
                return;
            }
        }

        if (isSpecialByValue) setBoardShake(true);

        if (isSpecialByValue || extraTurnFromKill) {
            setDiceValue(null);
            setTimeout(() => setBoardShake(false), 500);
        } else {
            endTurn(0);
        }
    }, [waitingForMove, diceValue, currentPlayerId, players, activePlayerIds, rankings]);

    useEffect(() => {
        if (rankings.length >= activePlayerIds.length - 1 && activePlayerIds.length > 1) return;
        if (!aiPlayerIds.includes(currentPlayerId)) return;
        if (rankings.includes(currentPlayerId)) return;

        if (!diceValue && !waitingForMove) {
            const timer = setTimeout(rollDice, 1500);
            return () => clearTimeout(timer);
        }

        if (waitingForMove && diceValue) {
            const timer = setTimeout(() => {
                const moves = Object.keys(validMoves).map(Number);
                if (moves.length === 0) return;

                let chosenPawn = moves[0];

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
                    const homeMove = moves.find(idx => validMoves[idx] === HOME_POSITION);
                    if (homeMove !== undefined) chosenPawn = homeMove;
                    else {
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
    }, [currentPlayerId, diceValue, waitingForMove, aiPlayerIds, validMoves, rankings, rollDice, movePawn, players, activePlayerIds]);

    const winner = rankings.length > 0 ? players[rankings[0]] : null;

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
        rankings,
        waitingForMove
    };
}
