import { useState, useEffect, useCallback } from 'react';

// ── SHARED PLAYER SETTINGS (per-user, localStorage) ───────────────────────
const SETTINGS_KEY = 'mlin_settings';

const DEFAULT_SETTINGS = {
  soundEnabled: true,      // UI sound effects
  bgmEnabled: true,        // Background music (unique per board)
  showLegalMoves: false,   // Dots on all legal targets
  tutorialDone: false      // Tutorial shown at least once
};

const readStoredSettings = () => {
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) { /* localStorage unavailable / corrupted — use default */ }
  return { ...DEFAULT_SETTINGS };
};

// API that App expects: flat values + individual setters (all are auto-saved to localStorage)
export const useSettings = () => {
  const [settings, setSettings] = useState(readStoredSettings);

  const setSetting = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) { /* ignore */ }
  }, [settings]);

  return {
    soundEnabled: settings.soundEnabled !== false,
    setSoundEnabled: (v) => setSetting('soundEnabled', Boolean(v)),
    bgmEnabled: settings.bgmEnabled !== false,
    setBgmEnabled: (v) => setSetting('bgmEnabled', Boolean(v)),
    showLegalMoves: settings.showLegalMoves === true,
    setShowLegalMoves: (v) => setSetting('showLegalMoves', Boolean(v)),
    themeId: settings.themeId || null,
    setThemeId: (v) => setSetting('themeId', v || null),
    tutorialDone: settings.tutorialDone === true,
    setTutorialDone: (v) => setSetting('tutorialDone', Boolean(v))
  };
};