import React, { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import GameBoard from './components/GameBoard';
import DiceControl from './components/DiceControl';
import PlayerPanel from './components/PlayerPanel';
import GameRules from './components/GameRules';
import { soundManager } from './utils/soundManager';

function GameRunner({ playerCount, isVsAI, onBack, onShowRules, isMuted, toggleMute }) {
  const activeIds = playerCount === 2 ? [0, 2] : [0, 1, 2, 3];
  const aiIds = isVsAI ? [2] : [];

  const {
    players, currentPlayerIndex, diceValue, rawDiceState, rollDice,
    movePawn, gameLog, winner, rankings, waitingForMove, validMoves, boardShake
  } = useGameState(activeIds, aiIds);

  const isSystemTurn = aiIds.includes(currentPlayerIndex);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
    }}>

      {/* Header */}
      <div style={{
        width: '100%',
        height: '50px',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 100,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,215,0,0.1)'
      }}>
        <button onClick={onBack} style={{ padding: '4px 10px', fontSize: '0.7rem', marginRight: '15px' }}>Menu</button>
        <span style={{ fontSize: '1.1rem', fontWeight: '100', color: '#fff', letterSpacing: '4px', textTransform: 'uppercase' }}>అష్టా చమ్మా</span>
        <button onClick={toggleMute} style={{ marginLeft: '15px', background: 'transparent', border: 'none', boxShadow: 'none', fontSize: '1.2rem', padding: 0 }}>
          {isMuted ? "🔇" : "🔊"}
        </button>
        <button onClick={() => onShowRules(true)} style={{
          marginLeft: '15px', padding: '6px 15px', fontSize: '0.75rem',
          background: 'rgba(255, 215, 0, 0.1)', border: '1px solid var(--liquid-gold)',
          borderRadius: '2px', color: 'var(--liquid-gold)', cursor: 'pointer', fontWeight: 'bold'
        }}>
          RULES
        </button>
      </div>

      {/* Game Area */}
      <div style={{
        position: 'relative',
        flex: 1,
        width: '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        overflow: 'hidden'
      }}>

        {/* HUDs */}
        {activeIds.includes(3) && (
          <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 20 }}>
            <PlayerPanel player={players[3]} playerIdx={3} isActive={currentPlayerIndex === 3} movePawn={movePawn} waitingForMove={waitingForMove} />
          </div>
        )}
        {activeIds.includes(2) && (
          <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 20 }}>
            <PlayerPanel player={players[2]} playerIdx={2} isActive={currentPlayerIndex === 2} movePawn={movePawn} waitingForMove={waitingForMove} />
          </div>
        )}
        {activeIds.includes(0) && (
          <div style={{ position: 'absolute', bottom: '110px', left: '20px', zIndex: 20 }}>
            <PlayerPanel player={players[0]} playerIdx={0} isActive={currentPlayerIndex === 0} movePawn={movePawn} waitingForMove={waitingForMove} />
          </div>
        )}
        {activeIds.includes(1) && (
          <div style={{ position: 'absolute', bottom: '110px', right: '20px', zIndex: 20 }}>
            <PlayerPanel player={players[1]} playerIdx={1} isActive={currentPlayerIndex === 1} movePawn={movePawn} waitingForMove={waitingForMove} />
          </div>
        )}

        {/* Board - Centered with proper padding */}
        <div style={{ width: 'min(92vw, 55vh)', aspectRatio: '1/1', zIndex: 10 }}>
          <GameBoard
            players={players}
            currentPlayerIndex={currentPlayerIndex}
            waitingForMove={waitingForMove}
            movePawn={movePawn}
            validMoves={validMoves}
            boardShake={boardShake}
          />
        </div>

        {/* Dice Control - Floating at bottom, non-blocking */}
        <div style={{
          position: 'absolute', bottom: '15px', left: '0', right: '0',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          height: '110px', pointerEvents: 'none', zIndex: 50
        }}>
          <div style={{ pointerEvents: isSystemTurn ? 'none' : 'auto' }}>
            <DiceControl onRoll={rollDice} disabled={waitingForMove || !!winner || isSystemTurn} diceValue={diceValue} rawDiceState={rawDiceState} />
          </div>
        </div>

      </div>

      {(rankings.length >= activeIds.length - 1 && activeIds.length > 1) && (
        <div className="winner-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.95)', zIndex: 500,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          backdropFilter: 'blur(20px)'
        }}>
          <h1 style={{ fontSize: '3rem', color: 'var(--liquid-gold)', fontWeight: '100', letterSpacing: '8px', marginBottom: '3rem' }}>RESULTS</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '320px' }}>
            {rankings.map((pid, idx) => (
              <div key={pid} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'rgba(255,255,255,0.03)',
                padding: '1.2rem 2rem', borderRadius: '4px',
                border: idx === 0 ? '1px solid var(--liquid-gold)' : '1px solid rgba(255,255,255,0.1)'
              }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--liquid-gold)' }}>#{idx + 1}</span>
                <span style={{ fontSize: '1.1rem', color: players[pid].color, fontWeight: 'bold' }}>{players[pid].name}</span>
              </div>
            ))}
          </div>
          <button onClick={onBack} style={{
            fontSize: '1rem', marginTop: '4rem', padding: '15px 60px',
            backgroundColor: 'transparent', color: 'var(--liquid-gold)', border: '1px solid var(--liquid-gold)', borderRadius: '2px', fontWeight: 'bold'
          }}>RETURN TO MENU</button>
        </div>
      )}
    </div>
  );
}

function App() {
  const [gameMode, setGameMode] = useState(null);
  const [isVsAI, setIsVsAI] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.muted);

  const toggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const startLevel = (count, vsAI = false) => {
    setIsVsAI(vsAI);
    setGameMode(count);
  };

  return (
    <div className="marble-surface" style={{ width: '100%', height: '100%', position: 'relative' }}>
      {!gameMode ? (
        <div className="menu fade-in" style={{
          display: 'flex', flexDirection: 'column', gap: '1.5rem',
          height: '100%', justifyContent: 'center', alignItems: 'center',
          position: 'relative'
        }}>
          <button
            onClick={toggleMute}
            style={{
              position: 'absolute', top: '20px', right: '20px',
              background: 'rgba(255,215,0,0.1)', border: '1px solid var(--liquid-gold)',
              borderRadius: '50%', width: '45px', height: '45px',
              fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{
              fontSize: 'min(12vw, 4.5rem)', margin: 0,
              color: 'var(--liquid-gold)',
              fontWeight: '100',
              letterSpacing: '10px',
              textShadow: '0 0 30px rgba(255, 215, 0, 0.2)'
            }}>
              అష్టా చమ్మా
            </h1>
            <h2 style={{ fontSize: 'min(4vw, 1rem)', margin: 0, color: 'rgba(255,255,255,0.4)', letterSpacing: '6px', marginTop: '10px' }}>ASHTA CHAMMA</h2>
          </div>

          <button onClick={() => startLevel(2, true)} style={{ fontSize: '0.9rem', padding: '1.2rem', width: '280px', letterSpacing: '2px' }}>
            SINGLE PLAYER
          </button>
          <button onClick={() => startLevel(2, false)} style={{ fontSize: '0.9rem', padding: '1.2rem', width: '280px', letterSpacing: '2px' }}>
            LOCAL 2 PLAYERS
          </button>
          <button onClick={() => startLevel(4, false)} style={{ fontSize: '0.9rem', padding: '1.2rem', width: '280px', letterSpacing: '2px' }}>
            LOCAL 4 PLAYERS
          </button>

          <button
            onClick={() => setShowRules(true)}
            style={{
              fontSize: '0.75rem', padding: '0.8rem', width: '200px',
              background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', marginTop: '20px'
            }}
          >
            GUIDE
          </button>
        </div>
      ) : (
        <GameRunner
          key={`${gameMode}-${isVsAI}`}
          playerCount={gameMode}
          isVsAI={isVsAI}
          onBack={() => setGameMode(null)}
          onShowRules={() => setShowRules(true)}
          isMuted={isMuted}
          toggleMute={toggleMute}
        />
      )}

      <GameRules isOpen={showRules} onClose={() => setShowRules(false)} />
    </div>
  );
}

export default App;
