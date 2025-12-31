import React, { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import GameBoard from './components/GameBoard';
import DiceControl from './components/DiceControl';
import PlayerPanel from './components/PlayerPanel';
import GameRules from './components/GameRules';
import { soundManager } from './utils/soundManager';

function GameRunner({ playerCount, onBack, onShowRules }) {
  const activeIds = playerCount === 2 ? [0, 2] : [0, 1, 2, 3];
  const { players, currentPlayerIndex, diceValue, rawDiceState, rollDice, movePawn, gameLog, winner, waitingForMove, validMoves, boardShake } = useGameState(activeIds);
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start', // Start from top
      alignItems: 'center',
      background: 'linear-gradient(to bottom, #2c3e50, #000000)'
    }}>

      {/* Header - Flow Layout (Not Absolute) for Safety */}
      <div style={{
        width: '100%',
        height: '50px',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 50,
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(5px)'
      }}>
        <button onClick={onBack} style={{ padding: '4px 10px', fontSize: '0.7rem', marginRight: '15px' }}>Menu</button>
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f4e1d2', textTransform: 'uppercase' }}>అష్టా చమ్మా</span>
        <button onClick={toggleMute} style={{ marginLeft: '15px', background: 'transparent', border: 'none', boxShadow: 'none', fontSize: '1.2rem', padding: 0 }}>
          {isMuted ? "🔇" : "🔊"}
        </button>
        <button
          onClick={() => onShowRules(true)}
          style={{
            marginLeft: '15px',
            padding: '6px 12px',
            fontSize: '0.85rem',
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '20px',
            color: '#f4e1d2',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}
          className="hover:bg-white/20 transition-all font-semibold"
        >
          <span>?</span> Rules
        </button>
      </div>

      {/* Game Area - Fills rest of screen */}
      <div style={{
        position: 'relative',
        flex: 1,
        width: '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        overflow: 'hidden'
      }}>

        {/* HUDs - Absolute within Game Area. Safe from Header now. */}
        {/* Top Left */ activeIds.includes(3) && (
          <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 20 }}>
            <PlayerPanel player={players[3]} playerIdx={3} isActive={currentPlayerIndex === 3} movePawn={movePawn} waitingForMove={waitingForMove} />
          </div>
        )}
        {/* Top Right */ activeIds.includes(2) && (
          <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 20 }}>
            <PlayerPanel player={players[2]} playerIdx={2} isActive={currentPlayerIndex === 2} movePawn={movePawn} waitingForMove={waitingForMove} />
          </div>
        )}
        {/* Bottom Left */ activeIds.includes(0) && (
          <div style={{ position: 'absolute', bottom: '100px', left: '10px', zIndex: 20 }}>
            <PlayerPanel player={players[0]} playerIdx={0} isActive={currentPlayerIndex === 0} movePawn={movePawn} waitingForMove={waitingForMove} />
          </div>
        )}
        {/* Bottom Right */ activeIds.includes(1) && (
          <div style={{ position: 'absolute', bottom: '100px', right: '10px', zIndex: 20 }}>
            <PlayerPanel player={players[1]} playerIdx={1} isActive={currentPlayerIndex === 1} movePawn={movePawn} waitingForMove={waitingForMove} />
          </div>
        )}

        {/* Board - Centered */}
        <div style={{
          width: 'min(90vw, 55vh)', /* Slightly smaller to ensure fit with HUDs */
          aspectRatio: '1/1',
          marginBottom: '60px' /* Push up slightly for Dice */
        }}>
          <GameBoard
            players={players}
            currentPlayerIndex={currentPlayerIndex}
            waitingForMove={waitingForMove}
            movePawn={movePawn}
            validMoves={validMoves}
            boardShake={boardShake}
          />
        </div>

        {/* Dice Control - Absolute Bottom Center */}
        <div style={{
          position: 'absolute', bottom: '10px', left: '0', right: '0',
          display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
          height: '90px', pointerEvents: 'none' /* Passthrough for clicks outside buttons */
        }}>
          <div style={{ pointerEvents: 'auto', transform: 'scale(0.8)' }}>
            <DiceControl onRoll={rollDice} disabled={waitingForMove || !!winner} diceValue={diceValue} rawDiceState={rawDiceState} />
          </div>
        </div>

      </div>

      {winner && (
        <div className="winner-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.95)', zIndex: 100,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center'
        }}>
          <h1 style={{ fontSize: '3rem', color: winner.color }}>{winner.name} WINS!</h1>
          <button onClick={onBack} style={{ fontSize: '1.5rem', marginTop: '20px' }}>Back to Menu</button>
        </div>
      )}
    </div>
  );
}

function App() {
  const [gameMode, setGameMode] = useState(null);
  const [showRules, setShowRules] = useState(false);

  const handleShowRules = () => {
    console.log('SHOW RULES CLICKED');
    setShowRules(true);
  };

  const handleCloseRules = () => {
    console.log('CLOSE RULES CLICKED');
    setShowRules(false);
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {!gameMode ? (
        <div className="menu fade-in" style={{
          display: 'flex', flexDirection: 'column', gap: '2rem',
          height: '100%', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{
              fontSize: 'min(12vw, 4rem)', margin: 0,
              color: '#f4c430',
              textShadow: '0 4px 10px rgba(0,0,0,0.8)'
            }}>
              అష్టా చమ్మా
            </h1>
            <h2 style={{
              fontSize: 'min(5vw, 1.2rem)', margin: '10px 0 0 0',
              color: '#a0a0a0',
              textTransform: 'uppercase', letterSpacing: '4px'
            }}>
              Ashta Chamma
            </h2>
          </div>

          <button onClick={() => setGameMode(2)} style={{ fontSize: '1.1rem', padding: '1rem 3rem', width: '75%', maxWidth: '300px' }}>
            2 Players
          </button>
          <button onClick={() => setGameMode(4)} style={{ fontSize: '1.1rem', padding: '1rem 3rem', width: '75%', maxWidth: '300px' }}>
            4 Players
          </button>
          <button
            onClick={handleShowRules}
            style={{
              fontSize: '1rem', padding: '0.8rem 2rem', width: '75%', maxWidth: '250px',
              background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#ccc'
            }}
            className="hover:bg-white/10 transition-all font-semibold"
          >
            How To Play
          </button>
        </div>
      ) : (
        <GameRunner key={gameMode} playerCount={gameMode} onBack={() => setGameMode(null)} onShowRules={handleShowRules} />
      )}

      <GameRules isOpen={showRules} onClose={handleCloseRules} />
    </div>
  );
}

export default App;
