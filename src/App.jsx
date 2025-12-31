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
        zIndex: 50,
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(5px)'
      }}>
        <button onClick={onBack} style={{ padding: '4px 10px', fontSize: '0.7rem', marginRight: '15px' }}>Menu</button>
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f4e1d2', textTransform: 'uppercase' }}>అష్టా చమ్మా</span>
        <button onClick={toggleMute} style={{ marginLeft: '15px', background: 'transparent', border: 'none', boxShadow: 'none', fontSize: '1.2rem', padding: 0 }}>
          {isMuted ? "🔇" : "🔊"}
        </button>
        <button onClick={() => onShowRules(true)} style={{
          marginLeft: '15px', padding: '6px 12px', fontSize: '0.85rem',
          background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '20px', color: '#f4e1d2', cursor: 'pointer'
        }}>
          Rules
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
          <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {rankings.includes(3) && <div style={{ background: '#dbcc24', color: '#000', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '4px' }}>RANK {rankings.indexOf(3) + 1}</div>}
              <PlayerPanel player={players[3]} playerIdx={3} isActive={currentPlayerIndex === 3} movePawn={movePawn} waitingForMove={waitingForMove} />
            </div>
          </div>
        )}
        {activeIds.includes(2) && (
          <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {isVsAI && <span style={{ fontSize: '0.6rem', opacity: 0.6, color: '#ffff55' }}>SYSTEM AI</span>}
              {rankings.includes(2) && <div style={{ background: '#dbcc24', color: '#000', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '4px' }}>RANK {rankings.indexOf(2) + 1}</div>}
              <PlayerPanel player={players[2]} playerIdx={2} isActive={currentPlayerIndex === 2} movePawn={movePawn} waitingForMove={waitingForMove} />
            </div>
          </div>
        )}
        {activeIds.includes(0) && (
          <div style={{ position: 'absolute', bottom: '100px', left: '10px', zIndex: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {rankings.includes(0) && <div style={{ background: '#dbcc24', color: '#000', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '4px' }}>RANK {rankings.indexOf(0) + 1}</div>}
              <PlayerPanel player={players[0]} playerIdx={0} isActive={currentPlayerIndex === 0} movePawn={movePawn} waitingForMove={waitingForMove} />
            </div>
          </div>
        )}
        {activeIds.includes(1) && (
          <div style={{ position: 'absolute', bottom: '100px', right: '10px', zIndex: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {rankings.includes(1) && <div style={{ background: '#dbcc24', color: '#000', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '4px' }}>RANK {rankings.indexOf(1) + 1}</div>}
              <PlayerPanel player={players[1]} playerIdx={1} isActive={currentPlayerIndex === 1} movePawn={movePawn} waitingForMove={waitingForMove} />
            </div>
          </div>
        )}

        {/* Board */}
        <div style={{ width: 'min(90vw, 55vh)', aspectRatio: '1/1', marginBottom: '60px' }}>
          <GameBoard
            players={players}
            currentPlayerIndex={currentPlayerIndex}
            waitingForMove={waitingForMove}
            movePawn={movePawn}
            validMoves={validMoves}
            boardShake={boardShake}
          />
        </div>

        {/* Dice Control */}
        <div style={{
          position: 'absolute', bottom: '10px', left: '0', right: '0',
          display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
          height: '90px', pointerEvents: isSystemTurn ? 'none' : 'auto'
        }}>
          <div style={{ transform: 'scale(0.8)', opacity: isSystemTurn ? 0.5 : 1 }}>
            <DiceControl onRoll={rollDice} disabled={waitingForMove || !!winner || isSystemTurn} diceValue={diceValue} rawDiceState={rawDiceState} />
          </div>
        </div>

      </div>

      {(rankings.length >= activeIds.length - 1 && activeIds.length > 1) && (
        <div className="winner-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.9)', zIndex: 200,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          backdropFilter: 'blur(15px)'
        }}>
          <h1 style={{ fontSize: '3.5rem', color: 'var(--title-yellow)', textAlign: 'center', marginBottom: '2rem' }}>LEADERBOARD</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
            {rankings.map((pid, idx) => (
              <div key={pid} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: idx === 0 ? 'rgba(219, 204, 36, 0.2)' : 'rgba(255,255,255,0.05)',
                padding: '1rem 1.5rem', borderRadius: '12px',
                border: idx === 0 ? '1px solid #dbcc24' : '1px solid rgba(255,255,255,0.1)'
              }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{idx + 1}<sup>{idx === 0 ? 'st' : idx === 1 ? 'nd' : 'rd'}</sup></span>
                <span style={{ fontSize: '1.2rem', color: players[pid].color, fontWeight: 'bold' }}>{players[pid].name}</span>
              </div>
            ))}
          </div>
          <button onClick={onBack} style={{
            fontSize: '1.2rem', marginTop: '3rem', padding: '15px 50px',
            backgroundColor: 'var(--title-yellow)', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold'
          }}>New Game</button>
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
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="chalk-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
          </filter>
          <filter id="sharpen-filter">
            <feConvolveMatrix order="3" kernelMatrix="0 -1 0 -1 5 -1 0 -1 0" preserveAlpha="true" />
          </filter>
        </defs>
      </svg>

      {!gameMode ? (
        <div className="menu fade-in" style={{
          display: 'flex', flexDirection: 'column', gap: '1.5rem',
          height: '100%', justifyContent: 'center', alignItems: 'center',
          position: 'relative'
        }}>
          {/* Main Menu Mute Toggle */}
          <button
            onClick={toggleMute}
            style={{
              position: 'absolute', top: '20px', right: '20px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%', width: '50px', height: '50px',
              fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>

          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <h1 style={{
              fontSize: 'min(14vw, 5rem)', margin: 0,
              color: 'var(--title-yellow)',
              textShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              అష్టా చమ్మా
            </h1>
            <h2 style={{ fontSize: 'min(5vw, 1.2rem)', margin: 0, color: '#a0a0a0', letterSpacing: '4px' }}>Ashta Chamma</h2>
          </div>

          <button onClick={() => startLevel(2, true)} style={{ fontSize: '1.2rem', padding: '1.2rem', width: '300px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', borderRadius: '12px' }}>
            1 Player (vs System)
          </button>
          <button onClick={() => startLevel(2, false)} style={{ fontSize: '1.2rem', padding: '1.2rem', width: '300px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', borderRadius: '12px' }}>
            2 Players
          </button>
          <button onClick={() => startLevel(4, false)} style={{ fontSize: '1.2rem', padding: '1.2rem', width: '300px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', borderRadius: '12px' }}>
            4 Players
          </button>

          <button
            onClick={() => setShowRules(true)}
            style={{
              fontSize: '1rem', padding: '0.8rem', width: '220px',
              background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#aaa', borderRadius: '10px'
            }}
          >
            How To Play
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
