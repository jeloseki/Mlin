// src/components/InfoScreens.jsx
// Izdvojeni čitajući (read-only) izbornici: Rangovi, Ljestvica, Bodovanje, Postavke
import { RANK_STEPS } from '../constants/appConstants';
import { getStoredBoards } from '../boardsData';

const SettingsPanel = ({ t, lang, setLang, soundEnabled, setSoundEnabled, bgmEnabled, setBgmEnabled, showLegalMoves, setShowLegalMoves, themeId, setThemeId, tutorialDone, setTutorialDone, isFullscreen, onToggleFullscreen, aiDifficulty, onSetAiDifficulty, profile, onSelectBoard }) => {
  const catalog = getStoredBoards();
  const unlocked = Array.isArray(profile?.unlockedBoards) ? profile.unlockedBoards.map(id => String(id)) : [];
  const active = profile?.activeBoard;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* JEZIK */}
      <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: 12, padding: '12px 14px', border: '1px solid #334155' }}>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 8, fontWeight: 'bold', letterSpacing: 1 }}>{t.settingLanguage}</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {['hr', 'en'].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid ' + (lang === l ? '#16a34a' : '#334155'),
              background: lang === l ? '#16a34a' : 'rgba(30, 41, 59, 0.6)',
              color: lang === l ? '#fff' : '#cbd5e1', fontWeight: 'bold', cursor: 'pointer'
            }}>
              {l === 'hr' ? '🇭🇷 Hrvatski' : '🇬🇧 English'}
            </button>
          ))}
        </div>
      </div>

      {/* ZVUK */}
      <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: 12, padding: '12px 14px', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'bold', letterSpacing: 1 }}>{t.settingSound}</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>{soundEnabled ? `🔊 ${t.on}` : `🔇 ${t.off}`}</div>
        </div>
        <button onClick={() => setSoundEnabled(!soundEnabled)} aria-label="toggle-sound" style={{ width: 52, height: 28, borderRadius: 14, border: '1px solid #334155', background: soundEnabled ? '#16a34a' : '#334155', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
          <span style={{ position: 'absolute', top: 2, left: soundEnabled ? 26 : 2, width: 22, height: 22, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', display: 'block' }} />
        </button>
      </div>

      {/* GLAZBA (BGM) */}
      <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: 12, padding: '12px 14px', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'bold', letterSpacing: 1 }}>{t.settingBgm}</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>{bgmEnabled ? `🎵 ${t.on}` : `🎶 ${t.off}`}</div>
        </div>
        <button onClick={() => setBgmEnabled(!bgmEnabled)} aria-label="toggle-bgm" style={{ width: 52, height: 28, borderRadius: 14, border: '1px solid #334155', background: bgmEnabled ? '#16a34a' : '#334155', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
          <span style={{ position: 'absolute', top: 2, left: bgmEnabled ? 26 : 2, width: 22, height: 22, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', display: 'block' }} />
        </button>
      </div>

      {/* PRIKAZ MOGUĆIH POTEZA */}
      <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: 12, padding: '12px 14px', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'bold', letterSpacing: 1 }}>{t.settingLegal}</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>{showLegalMoves ? t.on : t.off}</div>
        </div>
        <button onClick={() => setShowLegalMoves(!showLegalMoves)} aria-label="toggle-legal-moves" style={{ width: 52, height: 28, borderRadius: 14, border: '1px solid #334155', background: showLegalMoves ? '#16a34a' : '#334155', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
          <span style={{ position: 'absolute', top: 2, left: showLegalMoves ? 26 : 2, width: 22, height: 22, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', display: 'block' }} />
        </button>
      </div>

      {/* TEMA PLOČE */}
      <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: 12, padding: '12px 14px', border: '1px solid #334155' }}>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'bold', letterSpacing: 1, marginBottom: 4 }}>{t.settingTheme}</div>
        <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: 10 }}>{t.settingThemeHint}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {catalog.map((b) => {
            const isUnlocked = unlocked.includes(String(b.id)) || b.price === 0 || b.isDefault;
            const selected = String(themeId) === String(b.id);
            return (
              <button
                key={b.id}
                type="button"
                title={b.name}
                aria-label={'theme-' + b.id}
                disabled={!isUnlocked}
                onClick={() => setThemeId(b.id)}
                style={{
                  width: 40, height: 40, borderRadius: 8,
                  border: '2px solid ' + (selected ? '#d4af37' : 'rgba(51, 65, 85, 0.7)'),
                  background: b.boardBackground || '#0f172a',
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  opacity: isUnlocked ? 1 : 0.35,
                  boxShadow: selected ? '0 0 10px rgba(212, 175, 55, 0.55)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <span style={{ width: 20, height: 3, borderRadius: 2, background: b.linesColor || '#d4af37', display: 'block' }} />
              </button>
            );
          })}
        </div>
      </div>

      {/* VODIĆ + PUNI EKRAN */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setTutorialDone(!tutorialDone)}
          style={{ flex: 1, minWidth: 160, padding: '12px 14px', borderRadius: 8, border: '1px solid #334155', background: 'rgba(30, 41, 59, 0.6)', color: '#cbd5e1', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer' }}
        >
          {tutorialDone ? '✅ ' + t.tutorialDone : '📖 ' + t.tutorialReplay}
        </button>
        <button
          type="button"
          onClick={onToggleFullscreen}
          style={{ flex: 1, minWidth: 160, padding: '12px 14px', borderRadius: 8, border: '1px solid #334155', background: isFullscreen ? '#2563eb' : 'rgba(30, 41, 59, 0.6)', color: '#fff', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer' }}
        >
          {isFullscreen ? '⛶ ' + t.exitFullscreen : '⛶ ' + t.fullscreen}
        </button>
      </div>

      {/* TEŽINA AI */}
      <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: 12, padding: '12px 14px', border: '1px solid #334155' }}>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 8, fontWeight: 'bold', letterSpacing: 1 }}>{t.settingAiTitle}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            ['EASY', t.easy, '#22c55e'],
            ['MEDIUM', t.medium, '#eab308'],
            ['HARD', t.hard, '#ef4444']
          ].map(([val, label, color]) => (
            <button key={val} onClick={() => onSetAiDifficulty(val)} style={{
              flex: 1, padding: '10px 4px', borderRadius: 8, border: '1px solid ' + (aiDifficulty === val ? color : '#334155'),
              background: aiDifficulty === val ? color + '33' : 'rgba(30, 41, 59, 0.6)',
              color: aiDifficulty === val ? color : '#cbd5e1', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer'
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* PLOČE */}
      <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: 12, padding: '12px 14px', border: '1px solid #334155' }}>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 8, fontWeight: 'bold', letterSpacing: 1 }}>{t.settingBoardTitle}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 10 }}>
          {catalog.map(b => {
            const isUnlocked = unlocked.includes(String(b.id)) || b.price === 0 || b.isDefault;
            const isActive = active === b.id;
            const miniBg = [
              `radial-gradient(circle 5px at 10% 10%, ${b.linesColor} 95%, transparent)`,
              `radial-gradient(circle 5px at 90% 10%, ${b.linesColor} 95%, transparent)`,
              `radial-gradient(circle 5px at 10% 90%, ${b.linesColor} 95%, transparent)`,
              `radial-gradient(circle 5px at 90% 90%, ${b.linesColor} 95%, transparent)`,
              `radial-gradient(circle 4px at 50% 30%, ${b.linesColor} 95%, transparent)`,
              `radial-gradient(circle 4px at 50% 70%, ${b.linesColor} 95%, transparent)`
            ].join(',');
            return (
              <button key={b.id} onClick={() => onSelectBoard(b.id)} style={{
                position: 'relative', borderRadius: 10, overflow: 'hidden', border: '2px solid ' + (isActive ? '#d4af37' : isUnlocked ? '#334155' : '#1f2937'),
                background: b.background || '#1e293b', cursor: isUnlocked ? 'pointer' : 'not-allowed', opacity: isUnlocked ? 1 : 0.55,
                padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6
              }}>
                <div style={{ width: '100%', aspectRatio: '1 / 1', background: miniBg, backgroundSize: '100% 100%' }} />
                <div style={{ fontSize: '0.72rem', color: '#e2e8f0', fontWeight: 'bold', padding: '4px 8px 8px', textAlign: 'center', minWidth: '100%' }}>{b.name || b.id}</div>
                {isActive && <span style={{ position: 'absolute', top: 6, left: 6, background: '#16a34a', color: '#fff', fontSize: '0.62rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: 8 }}>{t.boardActive}</span>}
                {!isUnlocked && <span style={{ position: 'absolute', top: 6, right: 6, background: '#334155', color: '#cbd5e1', fontSize: '0.62rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: 8 }}>🔒 {t.boardLocked}</span>}
              </button>
            );
          })}
        </div>
        <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 8 }}>{t.boardHint}</div>
      </div>
    </div>
  );
};

const InfoScreens = ({
  currentScreen,
  t,
  lang,
  profile,
  leaderboard,
  activeScoringRules,
  soundEnabled,
  setSoundEnabled,
  setCurrentScreen,
  setLang,
  aiDifficulty,
  onSetAiDifficulty,
  onSelectBoard,
  bgmEnabled,
  setBgmEnabled,
  showLegalMoves,
  setShowLegalMoves,
  themeId,
  setThemeId,
  tutorialDone,
  setTutorialDone,
  isFullscreen,
  onToggleFullscreen
}) => {
  if (currentScreen === 'RANKING') {
    return (
      <div className="menu-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="menu-title">{t.rankingTitle}</h2>
        <div className="info-box" style={{ maxHeight: '260px', overflowY: 'auto' }}>
          {RANK_STEPS.map((r, i) => (
            <div key={i} className="info-item">
              <span>{lang === 'hr' ? r.hr : r.en}</span>
              <span>{r.min}+ {t.ptsRequired}</span>
            </div>
          ))}
        </div>
        <button className="btn-menu btn-back" onClick={() => setCurrentScreen('MAIN_MENU')}>{t.back}</button>
      </div>
    );
  }

  if (currentScreen === 'LEADERBOARD') {
    return (
      <div className="menu-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="menu-title">{t.leaderboard}</h2>
        <table className="leaderboard-table">
          <thead>
            <tr><th>#</th><th>Player</th><th>Points</th></tr>
          </thead>
          <tbody>
            {leaderboard.length === 0 ? (
              <tr><td colSpan="3" style={{ textAlign: 'center', padding: '12px', color: '#94a3b8' }}>Loading leaderboard...</td></tr>
            ) : (
              leaderboard.map((entry, idx) => {
                const isCurrent = entry.name === profile.name;
                return (
                  <tr key={entry.name || idx} className={isCurrent ? 'highlight-row' : ''}>
                    <td>{idx + 1}</td>
                    <td>{entry.name}{isCurrent ? ' (You)' : ''}</td>
                    <td>{entry.rankPoints || 0}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <button className="btn-menu btn-back" onClick={() => setCurrentScreen('MAIN_MENU')}>{t.back}</button>
      </div>
    );
  }

  if (currentScreen === 'SCORING') {
    return (
      <div className="menu-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="menu-title">{t.scoringTitle}</h2>
        <div className="info-box" style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '360px', overflowY: 'auto' }}>
          {activeScoringRules.map((rule) => (
            <div key={rule.id} className="info-item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.1rem' }}>{rule.icon}</span>
              <span style={{ fontWeight: 'bold' }}>{rule.title}:</span>
              <span style={{ color: '#94a3b8' }}>{rule.value}</span>
            </div>
          ))}
        </div>
        <button className="btn-menu btn-back" onClick={() => setCurrentScreen('MAIN_MENU')}>{t.back}</button>
      </div>
    );
  }

  if (currentScreen === 'SETTINGS') {
    return (
      <div className="menu-card" onClick={(e) => e.stopPropagation()} style={{ width: '95%', maxWidth: '620px' }}>
        <h2 className="menu-title">{t.settings}</h2>
        <SettingsPanel t={t} lang={lang} setLang={setLang} soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} bgmEnabled={bgmEnabled} setBgmEnabled={setBgmEnabled} showLegalMoves={showLegalMoves} setShowLegalMoves={setShowLegalMoves} themeId={themeId} setThemeId={setThemeId} tutorialDone={tutorialDone} setTutorialDone={setTutorialDone} isFullscreen={isFullscreen} onToggleFullscreen={onToggleFullscreen} aiDifficulty={aiDifficulty} onSetAiDifficulty={onSetAiDifficulty} profile={profile} onSelectBoard={onSelectBoard} />
        <button className="btn-menu btn-back" onClick={() => setCurrentScreen('MAIN_MENU')}>{t.back}</button>
      </div>
    );
  }

  return null;
};

export default InfoScreens;
