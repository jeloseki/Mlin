// src/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quickMatch } from './services/multiplayer';
import {
  ACHIEVEMENT_TIERS,
  fetchAchievementsFromFirebase,
  saveAchievementToFirebase,
  deleteAchievementFromFirebase
} from './achievementsData';
import { db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ALL_COUNTRIES, CountryFlag } from './countriesData';

const AVATAR_OPTIONS = ['🦁', '🧙‍♂️', '⚡', '🌙', '🎨', '🕹️', '❄️', '🤫', '🚀', '🌟', '☕', '🐱', '🤖', '🦊', '🦉', '🎯'];

const DEFAULT_IVICA = {
  id: 'admin-ivica',
  name: 'Ivica',
  avatar: '🦁',
  country: 'HR',
  bio: 'Glavni developer i strateg igre',
  points: 0,
  wins: 0,
  losses: 0,
  matchHistory: [],
  achievements: []
};

const DEFAULT_SCORING_RULES = [
  { id: 'rule-win', icon: '🏆', title: 'Pobjeda', value: '+12 Bodova' },
  { id: 'rule-loss', icon: '❌', title: 'Poraz', value: '-6 Bodova' },
  { id: 'rule-mill', icon: '🎯', title: 'Mlin bonus', value: '+1 Bod po mlinu (Max +4 po meču)' },
  { id: 'rule-dom', icon: '👑', title: 'Dominantna pobjeda (6+ figura)', value: '+3 Boda' },
  { id: 'rule-streak', icon: '🔥', title: 'Niz pobjeda (3+ pobjede u nizu)', value: '+3 Boda' },
  { id: 'rule-prot', icon: '🛡️', title: 'Zaštita', value: 'Bodovi ne mogu pasti ispod 0' }
];

const MENU_GROUPS = [
  {
    id: 'profiles',
    label: '👥 Igrači i Profili',
    items: [
      { id: 'profiles_list', label: '📋 Dostupni profili' },
      { id: 'profiles_create', label: '➕ Kreiraj / Uredi profil' }
    ]
  },
  {
    id: 'achievements',
    label: '🏅 Postignuća (1:N)',
    items: [
      { id: 'ach_assign', label: '🎖️ Katalog i dodjela' },
      { id: 'ach_create', label: '✨ Stvori postignuće' }
    ]
  },
  {
    id: 'system',
    label: '⚙️ Sustav i Pravila',
    items: [
      { id: 'scoring', label: '⚖️ Sustav bodovanja' }
    ]
  }
];

const SIDEBAR_WIDTH = 'max(220px, calc((100vw - 1130px) / 2))';

const S = {
  card: {
    backgroundColor: '#0f172a',
    borderRadius: '14px',
    border: '1px solid #334155',
    padding: '28px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
  },
  subCard: {
    backgroundColor: '#1e293b',
    borderRadius: '10px',
    border: '1px solid #475569',
    padding: '18px'
  },
  input: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '6px',
    backgroundColor: '#0f172a',
    border: '1px solid #475569',
    color: '#fff',
    boxSizing: 'border-box',
    fontSize: '0.85rem'
  },
  label: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    display: 'block',
    marginBottom: '4px'
  },
  btn: (bg, color = '#fff') => ({
    padding: '8px 14px',
    backgroundColor: bg,
    color,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 'bold'
  })
};

export default function AdminPanel() {
  const navigate = useNavigate();

  // --- STANJA: NAVIGACIJA I SIDEBAR ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth > 900);
  const [activeAdminTab, setActiveAdminTab] = useState('profiles_list');
  const [openMenus, setOpenMenus] = useState({ profiles: true, achievements: true, system: true });
  const [isSearchingMatch, setIsSearchingMatch] = useState(false);

  const toggleMenuGroup = (group) => setOpenMenus(prev => ({ ...prev, [group]: !prev[group] }));

  // --- STANJA: BODOVANJE ---
  const [scoringRules, setScoringRules] = useState(() => {
    const saved = localStorage.getItem('mlin_scoring_rules');
    return saved ? JSON.parse(saved) : DEFAULT_SCORING_RULES;
  });
  const [newRule, setNewRule] = useState({ icon: '⭐', title: '', value: '' });
  const [editingRule, setEditingRule] = useState(null); // { id, icon, title, value }

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

  // --- STANJA: PROFILI IGRAČA ---
  const [profiles, setProfiles] = useState(() => {
    const saved = localStorage.getItem('mlin_admin_profiles');
    return saved ? JSON.parse(saved) : [DEFAULT_IVICA];
  });

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🧙‍♂️');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('HR');
  const [countrySearch, setCountrySearch] = useState('HR');
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState([]);

  // Sinkronizacija profila ako se promijene u localStorageu
  useEffect(() => {
    const syncProfiles = () => {
      const saved = localStorage.getItem('mlin_admin_profiles');
      if (saved) {
        try {
          setProfiles(JSON.parse(saved));
        } catch (err) {
          console.error('Greška pri sinkronizaciji profila:', err);
        }
      }
    };
    window.addEventListener('storage', syncProfiles);
    return () => window.removeEventListener('storage', syncProfiles);
  }, []);

  // --- STANJA: POSTIGNUĆA (1:N) ---
  const [achievementsList, setAchievementsList] = useState([]);
  const [achSearch, setAchSearch] = useState('');
  const [achTierFilter, setAchTierFilter] = useState('ALL');
  const [loadingAch, setLoadingAch] = useState(false);
  const [newAchData, setNewAchData] = useState({ title: '', desc: '', icon: '🏅', tier: 'BRONZE', points: 10 });
  const [selectedProfileId, setSelectedProfileId] = useState(() =>
    profiles.length > 0 ? (profiles[0].id || profiles[0].name) : ''
  );

  // Stanje za inline uređivanje postignuća u katalogu
  const [editingAchId, setEditingAchId] = useState(null);
  const [editAchData, setEditAchData] = useState({ title: '', desc: '', icon: '', tier: 'BRONZE', points: 10 });

  useEffect(() => {
    const loadAchs = async () => {
      setLoadingAch(true);
      try {
        const data = await fetchAchievementsFromFirebase();
        setAchievementsList(data);
      } catch (err) {
        console.error('Greška pri učitavanju postignuća:', err);
      } finally {
        setLoadingAch(false);
      }
    };
    loadAchs();
  }, []);

  const currentSelectedProfile = profiles.find(p => (p.id || p.name) === selectedProfileId) || profiles[0] || null;

  const handleAddNewAchievement = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newAchData.title.trim()) return;

    // Pronađi najveći postojeći broj iz ID-jeva (npr. ach_101 -> 101) da idući bude po redu
    const existingNumbers = achievementsList
      .map(a => {
        const match = a.id?.match(/ach_(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(n => !isNaN(n));

    const maxNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 100;
    const nextNumber = Math.max(maxNum + 1, 101);

    const item = {
      id: `ach_${nextNumber}`,
      title: newAchData.title.trim(),
      desc: newAchData.desc.trim(),
      icon: newAchData.icon || '🏅',
      tier: newAchData.tier || 'BRONZE',
      points: Number(newAchData.points) || 10
    };

    setAchievementsList(prev => [item, ...prev]);
    await saveAchievementToFirebase(item);
    setNewAchData({ title: '', desc: '', icon: '🏅', tier: 'BRONZE', points: 10 });
    setActiveAdminTab('ach_assign');
  };

  // 👈 UBACI OVE DVIJE FUNKCIJE ODMAH ISPOD:
  const handleStartEditAch = (ach) => {
    setEditingAchId(ach.id);
    setEditAchData({
      title: ach.title || '',
      desc: ach.desc || '',
      icon: ach.icon || '🏅',
      tier: ach.tier || 'BRONZE',
      points: ach.points || 10
    });
  };

  const handleSaveEditAch = async (achId) => {
    const updatedItem = {
      id: achId,
      ...editAchData,
      points: Number(editAchData.points) || 10
    };

    setAchievementsList(prev => prev.map(a => a.id === achId ? updatedItem : a));
    await saveAchievementToFirebase(updatedItem);
    setEditingAchId(null);
  };


  const handleDeleteAch = async (id) => {
    if (!window.confirm('Sigurno želiš trajno obrisati ovo postignuće s Firebasea?')) return;
    setAchievementsList(prev => prev.filter(a => a.id !== id));
    await deleteAchievementFromFirebase(id);
  };

  const handleToggleAchievementForUser = async (achId) => {
    if (!currentSelectedProfile) return;

    const currentProfileKey = currentSelectedProfile.id || currentSelectedProfile.name;
    const currentAchs = Array.isArray(currentSelectedProfile.achievements) ? currentSelectedProfile.achievements : [];
    const updatedAchs = currentAchs.includes(achId)
      ? currentAchs.filter(id => id !== achId)
      : [...currentAchs, achId];

    // Ažuriraj listu profila u adminu
    const updatedProfiles = profiles.map(p =>
      (p.id || p.name) === currentProfileKey ? { ...p, achievements: updatedAchs } : p
    );
    setProfiles(updatedProfiles);
    localStorage.setItem('mlin_admin_profiles', JSON.stringify(updatedProfiles));

    // Ažuriraj aktivni profil igrača (localStorage)
    const activeRaw = localStorage.getItem('mlin_user_profile');
    if (activeRaw) {
      try {
        const parsedActive = JSON.parse(activeRaw);
        if (parsedActive.id === currentSelectedProfile.id || parsedActive.name === currentSelectedProfile.name) {
          const updatedActive = { ...parsedActive, achievements: updatedAchs };
          localStorage.setItem('mlin_user_profile', JSON.stringify(updatedActive));
        }
      } catch (err) {
        console.warn('Greška pri ažuriranju mlin_user_profile:', err);
      }
    }

    // Obavezno osvježi storage event da cijela aplikacija / glavni izbornik povuče nove značke
    window.dispatchEvent(new Event('storage'));

    // Spremi na Firebase ako profil ima ID
    if (currentSelectedProfile.id && db) {
      try {
        await updateDoc(doc(db, 'profiles', currentSelectedProfile.id), { achievements: updatedAchs });
      } catch (err) { }
    }
  };

  // --- LOGIKA ZA PROFILE ---
  const filteredCountries = countrySearch.trim()
    ? ALL_COUNTRIES.filter(c =>
      c.code.toLowerCase().includes(countrySearch.trim().toLowerCase()) ||
      c.name.toLowerCase().includes(countrySearch.trim().toLowerCase())
    )
    : ALL_COUNTRIES;

  const matchingProfile = name.trim()
    ? profiles.find(p => p.name.toLowerCase().startsWith(name.toLowerCase()) && p.name.toLowerCase() !== name.toLowerCase())
    : null;

  const ghostSuffix = matchingProfile ? matchingProfile.name.slice(name.length) : '';

  const handleKeyDownName = (e) => {
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && matchingProfile) {
      if (e.key === 'Tab' || e.target.selectionStart === name.length) {
        e.preventDefault();
        setName(matchingProfile.name);
      }
    }
  };

  const handleSelectProfile = (player) => {
    if (isDeleteMode || editingId !== null) return;
    const freshPlayer = profiles.find(p => (p.id || p.name) === (player.id || player.name)) || player;

    const activeProfile = {
      id: freshPlayer.id || ('player-' + Date.now()),
      name: freshPlayer.name,
      avatar: freshPlayer.avatar,
      bio: freshPlayer.bio || 'Spreman za igru!',
      country: freshPlayer.country || 'HR',
      points: freshPlayer.points || 0,
      wins: freshPlayer.wins || 0,
      losses: freshPlayer.losses || 0,
      matchHistory: freshPlayer.matchHistory || [],
      achievements: Array.isArray(freshPlayer.achievements) ? freshPlayer.achievements : []
    };

    localStorage.setItem('mlin_user_profile', JSON.stringify(activeProfile));
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  const handleStartOnlineMatch = (selectedProfile = null) => {
    setIsSearchingMatch(true);
    const profileToUse = selectedProfile || JSON.parse(localStorage.getItem('mlin_user_profile')) || {
      name: name.trim() || 'Igrač',
      country: country || 'HR',
      avatar: avatar || '🦊'
    };

    quickMatch(
      profileToUse,
      (gameId, myColor) => {
        setIsSearchingMatch(false);
        sessionStorage.setItem('mlin_my_color', myColor);
        navigate(`/game/${gameId}`);
      },
      (gameId) => console.log('Čekamo protivnika u sobi:', gameId)
    );
  };

  const handleStartEdit = (e, player) => {
    e.stopPropagation();
    setEditingId(player.id);
    setName(player.name);
    setAvatar(player.avatar);
    setCountry(player.country || 'HR');
    setCountrySearch(player.country || 'HR');
    setBio(player.bio || '');
    setActiveAdminTab('profiles_create');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setAvatar('🧙‍♂️');
    setBio('');
    setCountry('HR');
    setCountrySearch('HR');
    setIsCountryOpen(false);
  };

  const handleCreateProfileOnly = (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;
    const finalCountry = country.trim().toUpperCase() || 'HR';

    if (editingId) {
      const updated = profiles.map(p => p.id === editingId ? {
        ...p,
        name: name.trim(),
        avatar,
        country: finalCountry,
        bio: bio.trim() || 'Spreman za igru!'
      } : p);

      setProfiles(updated);
      localStorage.setItem('mlin_admin_profiles', JSON.stringify(updated));

      const savedActive = localStorage.getItem('mlin_user_profile');
      if (savedActive) {
        try {
          const parsed = JSON.parse(savedActive);
          const editedPlayer = updated.find(p => p.id === editingId);
          if (editedPlayer && (parsed.id === editingId || parsed.name === editedPlayer.name || editingId === 'admin-ivica')) {
            localStorage.setItem('mlin_user_profile', JSON.stringify({
              ...parsed,
              name: editedPlayer.name,
              avatar: editedPlayer.avatar,
              country: editedPlayer.country,
              bio: editedPlayer.bio
            }));
            window.dispatchEvent(new Event('storage'));
          }
        } catch (err) { }
      }
    } else {
      const newProfile = {
        id: 'player-' + Date.now(),
        name: name.trim(),
        avatar,
        bio: bio.trim() || 'Spreman za igru!',
        country: finalCountry,
        points: 0,
        wins: 0,
        losses: 0,
        matchHistory: [],
        achievements: []
      };
      const updated = [...profiles, newProfile];
      setProfiles(updated);
      localStorage.setItem('mlin_admin_profiles', JSON.stringify(updated));
    }

    handleCancelEdit();
    setActiveAdminTab('profiles_list');
  };

  const handlePlayDirectly = (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;
    const existing = profiles.find(p => p.name.toLowerCase() === name.trim().toLowerCase());
    if (existing) {
      handleSelectProfile(existing);
    } else {
      handleSelectProfile({
        name: name.trim(),
        avatar,
        bio: bio.trim() || 'Spreman za igru!',
        country: country.trim().toUpperCase() || 'HR',
        points: 0,
        wins: 0,
        losses: 0,
        matchHistory: [],
        achievements: []
      });
    }
  };

  const handleResetAllProfiles = () => {
    if (!window.confirm('Jesi li siguran? Ovo će resetirati bodove, pobjede, poraze i postignuća za SVE profile na 0!')) return;

    const resetList = profiles.map(p => ({
      ...p,
      points: 0,
      wins: 0,
      losses: 0,
      matchHistory: [],
      achievements: []
    }));

    setProfiles(resetList);
    localStorage.setItem('mlin_admin_profiles', JSON.stringify(resetList));

    const activeRaw = localStorage.getItem('mlin_user_profile');
    if (activeRaw) {
      try {
        const parsedActive = JSON.parse(activeRaw);
        localStorage.setItem('mlin_user_profile', JSON.stringify({
          ...parsedActive,
          points: 0,
          wins: 0,
          losses: 0,
          matchHistory: [],
          achievements: []
        }));
      } catch (err) { }
    }

    window.dispatchEvent(new Event('storage'));
  };

  const toggleSelectDelete = (id) => {
    setSelectedForDelete(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleConfirmDelete = () => {
    if (selectedForDelete.length === 0) {
      setIsDeleteMode(false);
      return;
    }
    if (window.confirm(`Želite li obrisati označene profile (${selectedForDelete.length})?`)) {
      const updated = profiles.filter(p => !selectedForDelete.includes(p.id));
      setProfiles(updated);
      localStorage.setItem('mlin_admin_profiles', JSON.stringify(updated));
      setSelectedForDelete([]);
      setIsDeleteMode(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', width: '100%', color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>

      {/* ==================== GUMB ZA OTVARANJE / ZATVARANJE MENIJA ==================== */}
      <button
        type="button"
        onClick={() => setIsSidebarOpen(prev => !prev)}
        style={{
          position: 'fixed',
          top: '16px',
          left: isSidebarOpen ? `calc(${SIDEBAR_WIDTH} + 14px)` : '16px',
          zIndex: 200,
          backgroundColor: '#1e293b',
          color: '#fbbf24',
          border: '1px solid #334155',
          padding: '8px 12px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.82rem',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          transition: 'left 0.3s ease'
        }}
      >
        {isSidebarOpen ? '✕ Zatvori' : '☰ Meni'}
      </button>

      {/* ==================== LIJEVI IZBORNIK (KLIZNI SIDEBAR) ==================== */}
      <aside style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: SIDEBAR_WIDTH,
        backgroundColor: '#090f1d',
        borderRight: '1px solid #1e293b',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 150,
        boxShadow: isSidebarOpen ? '4px 0 20px rgba(0,0,0,0.5)' : 'none',
        boxSizing: 'border-box',
        transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease'
      }}>
        {/* Zaglavlje sidebara */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.05rem', color: '#fbbf24' }}>
            🛠️ Mlin Admin
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{ background: '#1e293b', color: '#cbd5e1', border: '1px solid #334155', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
          >
            ⬅ U igru
          </button>
        </div>

        {/* Navigacijske grupe i podstavke */}
        <nav style={{ padding: '16px 10px', flex: 1, overflowY: 'auto' }}>
          {MENU_GROUPS.map(group => (
            <div key={group.id} style={{ marginBottom: '16px' }}>
              <div
                onClick={() => toggleMenuGroup(group.id)}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  userSelect: 'none'
                }}
              >
                <span>{group.label}</span>
                <span style={{ fontSize: '0.7rem' }}>{openMenus[group.id] ? '▼' : '▶'}</span>
              </div>

              {openMenus[group.id] && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '6px', marginTop: '4px' }}>
                  {group.items.map(item => {
                    const isActive = activeAdminTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          if (item.id !== 'profiles_create' && editingId) handleCancelEdit();
                          setActiveAdminTab(item.id);
                          if (window.innerWidth < 768) setIsSidebarOpen(false);
                        }}
                        style={{
                          textAlign: 'left',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: 'none',
                          borderLeft: isActive ? '4px solid #3b82f6' : '4px solid transparent',
                          backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                          color: isActive ? '#60a5fa' : '#cbd5e1',
                          fontWeight: isActive ? '600' : '400',
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer sidebara */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid #1e293b', backgroundColor: '#060a14', fontSize: '0.8rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
          <span>Profila: <strong style={{ color: '#e2e8f0' }}>{profiles.length}</strong></span>
          <span>Znački: <strong style={{ color: '#38bdf8' }}>{achievementsList.length}</strong></span>
        </div>
      </aside>

      {/* ==================== SREDIŠNJI PROSTOR (CENTRIRANO) ==================== */}
      <div style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '56px 24px 40px',
        boxSizing: 'border-box'
      }}>
        <main style={{ width: '100%', maxWidth: '880px', margin: '0 auto' }}>

          {/* ==================================================================== */}
          {/* 1. EKRAN: DOSTUPNI PROFILI                                           */}
          {/* ==================================================================== */}
          {activeAdminTab === 'profiles_list' && (
            <div style={S.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ color: '#fbbf24', margin: 0 }}>👥 Dostupni profili igrača</h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                    {isDeleteMode ? 'Označite profile koje želite trajno obrisati:' : 'Klikni na profil za ulazak u igru ili uredi njegove podatke:'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => { handleCancelEdit(); setActiveAdminTab('profiles_create'); }}
                    style={S.btn('#2563eb')}
                  >
                    ➕ Novi igrač
                  </button>

                  {!isDeleteMode ? (
                    <>
                      <button
                        type="button"
                        onClick={handleResetAllProfiles}
                        style={S.btn('#d97706')}
                        title="Resetiraj bodove, pobjede, poraze i postignuća za sve igrače"
                      >
                        🔄 Resetiraj na 0
                      </button>
                      <button
                        type="button"
                        onClick={() => { handleCancelEdit(); setIsDeleteMode(true); }}
                        style={S.btn('#ef4444')}
                      >
                        🗑️ Obriši profile
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" onClick={handleConfirmDelete} style={S.btn('#dc2626')}>
                        Potvrdi brisanje ({selectedForDelete.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsDeleteMode(false); setSelectedForDelete([]); }}
                        style={S.btn('#475569')}
                      >
                        Odustani
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '16px' }}>
                {profiles.map(p => {
                  const isIvica = p.id === 'admin-ivica';
                  const isSelected = selectedForDelete.includes(p.id);
                  const borderColor = isSelected ? '#ef4444' : (isIvica ? '#38bdf8' : '#334155');

                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        if (isDeleteMode && !isIvica) toggleSelectDelete(p.id);
                        else if (!isDeleteMode) handleSelectProfile(p);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        padding: '14px',
                        backgroundColor: isSelected ? '#450a0a' : (isIvica ? '#1e3a5f' : '#1e293b'),
                        borderRadius: '10px',
                        border: `1px solid ${borderColor}`,
                        cursor: (isDeleteMode && isIvica) ? 'default' : 'pointer',
                        opacity: (isDeleteMode && isIvica) ? 0.6 : 1,
                        userSelect: 'none',
                        boxSizing: 'border-box'
                      }}
                    >
                      {isDeleteMode && !isIvica && (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            style={{ width: '18px', height: '18px', cursor: 'pointer', pointerEvents: 'none' }}
                          />
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '2.2rem', lineHeight: 1 }}>{p.avatar}</span>
                      </div>

                      <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }} title={p.name}>
                            {p.name}
                          </span>
                          <CountryFlag code={p.country} size="20x15" />
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>({p.country})</span>
                          {isIvica && (
                            <span style={{ fontSize: '0.65rem', color: '#38bdf8', border: '1px solid #38bdf8', padding: '1px 4px', borderRadius: '4px', fontWeight: 'bold' }}>
                              ADMIN
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '0.75rem', color: '#cbd5e1', fontStyle: 'italic', margin: '4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={p.bio}>
                          "{p.bio}"
                        </div>

                        <div style={{ fontSize: '0.73rem', color: '#94a3b8' }}>
                          {p.points || 0} bodova | {p.wins || 0}W - {p.losses || 0}L | 🏅 {(p.achievements || []).length}
                        </div>
                      </div>

                      {!isDeleteMode && (
                        <div style={{ width: '84px', minWidth: '84px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => handleSelectProfile(p)}
                            style={{ width: '100%', height: '28px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
                          >
                            Igraj
                          </button>
                          <button
                            type="button"
                            disabled={isSearchingMatch}
                            onClick={(e) => { e.stopPropagation(); handleStartOnlineMatch(p); }}
                            style={{ width: '100%', height: '28px', backgroundColor: isSearchingMatch ? '#475569' : '#8b5cf6', color: '#fff', border: 'none', borderRadius: '6px', cursor: isSearchingMatch ? 'not-allowed' : 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
                          >
                            {isSearchingMatch ? '⏳ Tražim' : '⚡ Online'}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleStartEdit(e, p)}
                            style={{ width: '100%', height: '28px', backgroundColor: '#334155', color: '#fbbf24', border: '1px solid #475569', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
                          >
                            ✏️ Uredi
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================================================================== */}
          {/* 2. EKRAN: KREIRAJ / UREDI PROFIL                                     */}
          {/* ==================================================================== */}
          {activeAdminTab === 'profiles_create' && (
            <div style={S.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <h2 style={{ margin: 0, color: editingId ? '#f59e0b' : '#38bdf8' }}>
                  {editingId ? '✏️ Uredi postojeći profil' : '➕ Novi igrač — Kreiraj profil'}
                </h2>
                <button
                  type="button"
                  onClick={() => { handleCancelEdit(); setActiveAdminTab('profiles_list'); }}
                  style={S.btn('#334155', '#cbd5e1')}
                >
                  📋 Povratak na listu profila
                </button>
              </div>

              <form onSubmit={handleCreateProfileOnly} style={{ ...S.subCard, border: editingId ? '1px solid #f59e0b' : '1px solid #334155' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>

                  {/* IME S AUTOCOMPLETEOM */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Ime igrača:</label>
                      {ghostSuffix && <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>Pritisni [Tab] za dopunu</span>}
                    </div>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <div
                        aria-hidden="true"
                        style={{
                          position: 'absolute', inset: 0, padding: '8px 10px', borderRadius: '6px',
                          fontSize: '0.85rem', fontFamily: 'inherit', whiteSpace: 'pre', pointerEvents: 'none', overflow: 'hidden'
                        }}
                      >
                        <span style={{ opacity: 0 }}>{name}</span>
                        <span style={{ color: '#64748b' }}>{ghostSuffix}</span>
                      </div>
                      <input
                        type="text"
                        required
                        autoComplete="off"
                        list="existing-names"
                        placeholder="npr. Marko"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onKeyDown={handleKeyDownName}
                        style={{ ...S.input, position: 'relative', backgroundColor: 'transparent' }}
                      />
                    </div>
                    <datalist id="existing-names">
                      {profiles.map(p => <option key={p.id} value={p.name} />)}
                    </datalist>
                  </div>

                  {/* AVATAR */}
                  <div>
                    <label style={S.label}>Avatar:</label>
                    <select value={avatar} onChange={e => setAvatar(e.target.value)} style={S.input}>
                      {AVATAR_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>

                  {/* DRŽAVA */}
                  <div style={{ position: 'relative' }}>
                    <label style={S.label}>Zemlja:</label>
                    <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
                      <div style={{ position: 'absolute', left: '10px', display: 'flex', alignItems: 'center', pointerEvents: 'none', zIndex: 2 }}>
                        <CountryFlag code={country} size="20x15" />
                      </div>
                      <input
                        type="text"
                        required
                        autoComplete="off"
                        placeholder="Traži državu..."
                        value={countrySearch}
                        onFocus={() => setIsCountryOpen(true)}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCountrySearch(val);
                          setIsCountryOpen(true);
                          if (val.trim().length === 2) setCountry(val.trim().toUpperCase());
                        }}
                        onBlur={() => setTimeout(() => setIsCountryOpen(false), 250)}
                        style={{ ...S.input, paddingLeft: '38px' }}
                      />
                    </div>

                    {isCountryOpen && filteredCountries.length > 0 && (
                      <div style={{
                        position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#1e293b',
                        border: '1px solid #475569', borderRadius: '6px', marginTop: '4px', zIndex: 30,
                        maxHeight: '190px', overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,0.7)'
                      }}>
                        {filteredCountries.map(c => (
                          <div
                            key={c.code}
                            onMouseDown={() => { setCountry(c.code); setCountrySearch(c.code); setIsCountryOpen(false); }}
                            style={{
                              padding: '8px 12px', fontSize: '0.85rem', cursor: 'pointer', borderBottom: '1px solid #334155',
                              display: 'flex', alignItems: 'center', gap: '10px',
                              backgroundColor: country === c.code ? '#334155' : 'transparent', color: '#fff'
                            }}
                          >
                            <CountryFlag code={c.code} size="20x15" />
                            <strong style={{ color: '#38bdf8', minWidth: '28px' }}>{c.code}</strong>
                            <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>{c.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* BIO */}
                  <div>
                    <label style={S.label}>Kratki status / Bio:</label>
                    <input
                      type="text"
                      placeholder="Duhoviti opis..."
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      style={S.input}
                    />
                  </div>

                  {/* GUMBI */}
                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '16px', marginTop: '10px' }}>
                    {editingId ? (
                      <>
                        <button type="submit" style={{ ...S.btn('#f59e0b'), padding: '11px 22px', fontSize: '0.95rem' }}>
                          💾 Spremi izmjene
                        </button>
                        <button
                          type="button"
                          onClick={() => { handleCancelEdit(); setActiveAdminTab('profiles_list'); }}
                          style={{ ...S.btn('#64748b'), padding: '11px 20px', fontSize: '0.95rem' }}
                        >
                          Odustani
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="submit" style={{ ...S.btn('#2563eb'), padding: '11px 22px', fontSize: '0.95rem' }}>
                          ➕ Kreiraj profil
                        </button>
                        <button type="button" onClick={handlePlayDirectly} style={{ ...S.btn('#16a34a'), padding: '11px 22px', fontSize: '0.95rem' }}>
                          🎮 Igraj odmah
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ==================================================================== */}
          {/* 3. EKRAN: KATALOG I DODJELA POSTIGNUĆA (1:N)                         */}
          {/* ==================================================================== */}
          {activeAdminTab === 'ach_assign' && (
            <div style={S.card}>
              <div style={{ ...S.subCard, marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h2 style={{ color: '#fbbf24', margin: 0, fontSize: '1.25rem' }}>🏅 Katalog Postignuća i Dodjela Igračima (1:N)</h2>
                    <div style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '4px' }}>
                      Katalog: <strong style={{ color: '#38bdf8' }}>{achievementsList.length}</strong> postignuća u bazi
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#0f172a', padding: '8px 12px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <span style={{ color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 'bold' }}>👤 Odaberi profil:</span>
                    <select
                      value={selectedProfileId}
                      onChange={(e) => setSelectedProfileId(e.target.value)}
                      style={{ background: '#1e293b', color: '#fbbf24', border: '1px solid #475569', padding: '6px 10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      {profiles.map(p => {
                        const val = p.id || p.name;
                        return <option key={val} value={val}>{p.name || 'Neimenovani igrač'}</option>;
                      })}
                    </select>

                    {currentSelectedProfile && (
                      <span style={{ color: '#4ade80', fontSize: '0.82rem', fontWeight: 'bold', marginLeft: '6px' }}>
                        Značke: {(currentSelectedProfile.achievements || []).length} / {achievementsList.length}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* PRETRAGA I FILTERI */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="🔍 Pretraži po nazivu ili opisu..."
                  value={achSearch}
                  onChange={(e) => setAchSearch(e.target.value)}
                  style={{ ...S.input, flex: 1, minWidth: '220px', backgroundColor: '#1e293b' }}
                />

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {['ALL', ...Object.keys(ACHIEVEMENT_TIERS)].map(key => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setAchTierFilter(key)}
                      style={{
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        borderRadius: '6px',
                        border: '1px solid #334155',
                        background: achTierFilter === key ? '#3b82f6' : '#1e293b',
                        color: achTierFilter === key ? '#fff' : '#94a3b8',
                        cursor: 'pointer',
                        fontWeight: achTierFilter === key ? 'bold' : 'normal'
                      }}
                    >
                      {key === 'ALL' ? 'Sve' : ACHIEVEMENT_TIERS[key].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* POPIS POSTIGNUĆA */}
              {loadingAch ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>⏳ Učitavanje kataloga postignuća...</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '62vh', overflowY: 'auto', paddingRight: '6px' }}>

                  {achievementsList
                    .filter(a => {
                      const matchesTier = achTierFilter === 'ALL' || a.tier === achTierFilter;
                      const matchesSearch = a.title?.toLowerCase().includes(achSearch.toLowerCase()) ||
                        a.desc?.toLowerCase().includes(achSearch.toLowerCase());
                      return matchesTier && matchesSearch;
                    })
                    .map((ach) => {
                      const userAchs = Array.isArray(currentSelectedProfile?.achievements) ? currentSelectedProfile.achievements : [];
                      const isAssigned = userAchs.includes(ach.id);
                      const tierData = ACHIEVEMENT_TIERS[ach.tier] || ACHIEVEMENT_TIERS.BRONZE;
                      const outerBorder = isAssigned ? '#22c55e' : '#334155';
                      const isEditing = editingAchId === ach.id;

                      return (
                        <div
                          key={ach.id}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            backgroundColor: isEditing ? '#1e293b' : (isAssigned ? 'rgba(34, 197, 94, 0.08)' : '#1e293b'),
                            borderTopWidth: '1px',
                            borderTopStyle: 'solid',
                            borderTopColor: isEditing ? '#fbbf24' : outerBorder,
                            borderRightWidth: '1px',
                            borderRightStyle: 'solid',
                            borderRightColor: isEditing ? '#fbbf24' : outerBorder,
                            borderBottomWidth: '1px',
                            borderBottomStyle: 'solid',
                            borderBottomColor: isEditing ? '#fbbf24' : outerBorder,
                            borderLeftWidth: '5px',
                            borderLeftStyle: 'solid',
                            borderLeftColor: tierData.border,
                            gap: '10px'
                          }}
                        >
                          {isEditing ? (
                            /* INLINE FORMA ZA UREĐIVANJE */
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <input
                                  type="text"
                                  value={editAchData.icon}
                                  onChange={(e) => setEditAchData({ ...editAchData, icon: e.target.value })}
                                  style={{ ...S.input, width: '55px', textAlign: 'center' }}
                                />
                                <input
                                  type="text"
                                  value={editAchData.title}
                                  onChange={(e) => setEditAchData({ ...editAchData, title: e.target.value })}
                                  style={{ ...S.input, flex: 2, minWidth: '160px' }}
                                  placeholder="Naziv"
                                />
                                <select
                                  value={editAchData.tier}
                                  onChange={(e) => setEditAchData({ ...editAchData, tier: e.target.value })}
                                  style={{ ...S.input, flex: 1, minWidth: '110px' }}
                                >
                                  {Object.keys(ACHIEVEMENT_TIERS).map(k => (
                                    <option key={k} value={k}>{ACHIEVEMENT_TIERS[k].label}</option>
                                  ))}
                                </select>
                                <input
                                  type="number"
                                  value={editAchData.points}
                                  onChange={(e) => setEditAchData({ ...editAchData, points: e.target.value })}
                                  style={{ ...S.input, width: '80px' }}
                                />
                              </div>
                              <input
                                type="text"
                                value={editAchData.desc}
                                onChange={(e) => setEditAchData({ ...editAchData, desc: e.target.value })}
                                style={S.input}
                                placeholder="Opis uvjeta..."
                              />
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => handleSaveEditAch(ach.id)} style={S.btn('#10b981')}>💾 Spremi</button>
                                <button type="button" onClick={() => setEditingAchId(null)} style={S.btn('#64748b')}>✕ Odustani</button>
                              </div>
                            </div>
                          ) : (
                            /* STANDARDNI PRIKAZ */
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '1.5rem', minWidth: '34px', textAlign: 'center' }}>{ach.icon || '🏅'}</span>
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    <strong style={{ color: '#fff', fontSize: '0.92rem' }}>{ach.title}</strong>
                                    <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '4px', background: tierData.border, color: '#000', fontWeight: 'bold' }}>
                                      {tierData.label}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 'bold' }}>+{ach.points} B</span>
                                    <span style={{ fontSize: '0.65rem', color: '#64748b' }}>({ach.id})</span>
                                  </div>
                                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>{ach.desc}</div>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                <button
                                  type="button"
                                  onClick={() => handleToggleAchievementForUser(ach.id)}
                                  style={S.btn(isAssigned ? '#ef4444' : '#22c55e')}
                                >
                                  {isAssigned ? '✖ Oduzmi' : '✔ Dodijeli'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleStartEditAch(ach)}
                                  title="Uredi postignuće"
                                  style={{ background: '#334155', border: '1px solid #475569', color: '#fbbf24', borderRadius: '6px', padding: '6px 8px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                  ✏️
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteAch(ach.id)}
                                  title="Trajno obriši s Firebasea"
                                  style={{ background: 'transparent', border: '1px solid #475569', color: '#94a3b8', borderRadius: '6px', padding: '6px 8px', cursor: 'pointer' }}
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* ==================================================================== */}
          {/* 4. EKRAN: STVORI NOVO POSTIGNUĆE                                     */}
          {/* ==================================================================== */}
          {activeAdminTab === 'ach_create' && (
            <div style={S.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h2 style={{ color: '#fbbf24', margin: 0 }}>✨ Stvori novo postignuće</h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                    Novo postignuće se odmah sprema u Firebase kolekciju i postaje dostupno za dodjelu svim igračima.
                  </p>
                </div>
                <button type="button" onClick={() => setActiveAdminTab('ach_assign')} style={S.btn('#334155', '#cbd5e1')}>
                  🎖️ Idi na katalog ({achievementsList.length})
                </button>
              </div>

              <form onSubmit={handleAddNewAchievement} style={S.subCard}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={S.label}>Ikona</label>
                    <input
                      type="text"
                      value={newAchData.icon}
                      onChange={(e) => setNewAchData({ ...newAchData, icon: e.target.value })}
                      style={{ ...S.input, textAlign: 'center', fontSize: '1.3rem', padding: '5px' }}
                    />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={S.label}>Naziv postignuća</label>
                    <input
                      type="text"
                      required
                      placeholder="npr. Gospodar prstena..."
                      value={newAchData.title}
                      onChange={(e) => setNewAchData({ ...newAchData, title: e.target.value })}
                      style={S.input}
                    />
                  </div>
                  <div>
                    <label style={S.label}>Razina (Tier)</label>
                    <select
                      value={newAchData.tier}
                      onChange={(e) => setNewAchData({ ...newAchData, tier: e.target.value })}
                      style={S.input}
                    >
                      {Object.keys(ACHIEVEMENT_TIERS).map(k => (
                        <option key={k} value={k}>{ACHIEVEMENT_TIERS[k].label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={S.label}>Bodovi</label>
                    <input
                      type="number"
                      value={newAchData.points}
                      onChange={(e) => setNewAchData({ ...newAchData, points: e.target.value })}
                      style={S.input}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={S.label}>Opis uvjeta (kako se osvaja)</label>
                  <input
                    type="text"
                    required
                    placeholder="npr. Pobijedi u partiji držeći sve figure na vanjskom kvadratu..."
                    value={newAchData.desc}
                    onChange={(e) => setNewAchData({ ...newAchData, desc: e.target.value })}
                    style={S.input}
                  />
                </div>

                <button type="submit" style={{ ...S.btn('#10b981'), padding: '10px 22px', fontSize: '0.95rem' }}>
                  + Dodaj postignuće u katalog
                </button>
              </form>
            </div>
          )}

          {/* ==================================================================== */}
          {/* 5. EKRAN: UPRAVLJANJE SUSTAVOM BODOVANJA                             */}
          {/* ==================================================================== */}
          {activeAdminTab === 'scoring' && (
            <div style={S.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h2 style={{ color: '#fbbf24', margin: 0 }}>⚖️ Upravljanje Sustavom Bodovanja</h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                    Definiraj ili prilagodi pravila bodovanja koja se prikazuju igračima.
                  </p>
                </div>
                <button type="button" onClick={() => saveRulesToStorage(DEFAULT_SCORING_RULES)} style={S.btn('#334155', '#cbd5e1')}>
                  🔄 Vrati na zadano
                </button>
              </div>

              <form onSubmit={handleAddRule} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Ikona"
                  value={newRule.icon}
                  onChange={(e) => setNewRule({ ...newRule, icon: e.target.value })}
                  style={{ ...S.input, width: '65px', backgroundColor: '#1e293b', textAlign: 'center' }}
                />
                <input
                  type="text"
                  placeholder="Naziv pravila (npr. Pobjeda)..."
                  value={newRule.title}
                  onChange={(e) => setNewRule({ ...newRule, title: e.target.value })}
                  style={{ ...S.input, flex: 2, minWidth: '180px', backgroundColor: '#1e293b' }}
                />
                <input
                  type="text"
                  placeholder="Vrijednost (npr. +10 Bodova)..."
                  value={newRule.value}
                  onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                  style={{ ...S.input, flex: 2, minWidth: '180px', backgroundColor: '#1e293b' }}
                />
                <button type="submit" style={S.btn('#10b981')}>
                  + Dodaj pravilo
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
          )}

        </main>
      </div>
    </div>
  );
}