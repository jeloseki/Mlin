import { useState } from 'react';
import { DEFAULT_SCORING_RULES, S } from './adminConstants';
import { TRANSLATIONS } from '../constants/appConstants';

const getStoredLang = () => {
  try {
    const stored = localStorage.getItem('mlin_lang');
    if (stored === 'hr' || stored === 'en') return stored;
  } catch (e) { /* ignore */ }
  return 'hr';
};

/**
 * Samostalni ekran upravljanja sustavom bodovanja (Admin panel).
 * Pravila se dijele preko localStorage ključa 'mlin_scoring_rules'
 * s App.jsx (sinkronizacija kroz storage event).
 */
export default function ScoringRulesAdmin() {
  const t = TRANSLATIONS[getStoredLang()];
  const [scoringRules, setScoringRules] = useState(() => {
    const saved = localStorage.getItem('mlin_scoring_rules');
    try {
      return saved ? JSON.parse(saved) : DEFAULT_SCORING_RULES;
    } catch (e) {
      console.warn('Greška pri učitavanju pravila bodovanja:', e);
      return DEFAULT_SCORING_RULES;
    }
  });
  const [newRule, setNewRule] = useState({ icon: '⭐', title: '', value: '' });
  const [editingRule, setEditingRule] = useState(null);

  const saveRulesToStorage = (rules) => {
    setScoringRules(rules);
    localStorage.setItem('mlin_scoring_rules', JSON.stringify(rules));
  };

  const handleAddRule = (e) => {
    e.preventDefault();
    if (!newRule.title.trim() || !newRule.value.trim()) return;
    const ruleToAdd = {
      id: 'rule-' + Date.now(),
      icon: newRule.icon || '⭐',
      title: newRule.title.trim(),
      value: newRule.value.trim()
    };
    saveRulesToStorage([...scoringRules, ruleToAdd]);
    setNewRule({ icon: '⭐', title: '', value: '' });
  };

  const handleDeleteRule = (id) => saveRulesToStorage(scoringRules.filter(r => r.id !== id));

  const handleSaveEditRule = () => {
    if (!editingRule) return;
    saveRulesToStorage(scoringRules.map(r => r.id === editingRule.id ? editingRule : r));
    setEditingRule(null);
  };

  return (
    <div style={S.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ color: '#fbbf24', margin: 0 }}>{t.scoringAdminTitle}</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            {t.scoringSubtitle}
          </p>
        </div>
        <button type="button" onClick={() => saveRulesToStorage(DEFAULT_SCORING_RULES)} style={S.btn('#334155', '#cbd5e1')}>
          {t.scoringReset}
        </button>
      </div>

      <form onSubmit={handleAddRule} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder={t.scoringIconPh}
          value={newRule.icon}
          onChange={(e) => setNewRule({ ...newRule, icon: e.target.value })}
          style={{ ...S.input, width: '65px', backgroundColor: '#1e293b', textAlign: 'center' }}
        />
        <input
          type="text"
          placeholder={t.scoringTitlePh}
          value={newRule.title}
          onChange={(e) => setNewRule({ ...newRule, title: e.target.value })}
          style={{ ...S.input, flex: 2, minWidth: '180px', backgroundColor: '#1e293b' }}
        />
        <input
          type="text"
          placeholder={t.scoringValuePh}
          value={newRule.value}
          onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
          style={{ ...S.input, flex: 2, minWidth: '180px', backgroundColor: '#1e293b' }}
        />
        <button type="submit" style={S.btn('#10b981')}>
          {t.scoringAdd}
        </button>
      </form>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {scoringRules.map((rule) => {
          const isEditing = editingRule?.id === rule.id;
          return (
            <div
              key={rule.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: '#1e293b',
                borderRadius: '8px',
                border: isEditing ? '1px solid #fbbf24' : '1px solid #334155',
                gap: '10px'
              }}
            >
              {isEditing ? (
                <div style={{ display: 'flex', gap: '8px', width: '100%', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={editingRule.icon}
                    onChange={(e) => setEditingRule({ ...editingRule, icon: e.target.value })}
                    style={{ ...S.input, width: '55px', textAlign: 'center', border: '1px solid #fbbf24' }}
                  />
                  <input
                    type="text"
                    value={editingRule.title}
                    onChange={(e) => setEditingRule({ ...editingRule, title: e.target.value })}
                    style={{ ...S.input, flex: 1, border: '1px solid #fbbf24' }}
                  />
                  <input
                    type="text"
                    value={editingRule.value}
                    onChange={(e) => setEditingRule({ ...editingRule, value: e.target.value })}
                    style={{ ...S.input, flex: 1.5, border: '1px solid #fbbf24' }}
                  />
                  <button type="button" onClick={handleSaveEditRule} style={S.btn('#10b981')}>💾</button>
                  <button type="button" onClick={() => setEditingRule(null)} style={S.btn('#64748b')}>✕</button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f8fafc' }}>
                    <span style={{ fontSize: '1.25rem' }}>{rule.icon}</span>
                    <span style={{ fontWeight: 'bold' }}>{rule.title}:</span>
                    <span style={{ color: '#94a3b8' }}>{rule.value}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button type="button" onClick={() => setEditingRule({ ...rule })} style={S.btn('#f59e0b')}>✏️</button>
                    <button type="button" onClick={() => handleDeleteRule(rule.id)} style={S.btn('#ef4444')}>✕</button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}