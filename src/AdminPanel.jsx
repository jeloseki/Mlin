// src/AdminPanel.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AVATAR_OPTIONS = ['🦁', '🧙‍♂️', '⚡', '🌙', '🎨', '🕹️', '❄️', '🤫', '🚀', '🌟', '☕', '🐱', '🤖', '🦊', '🦉', '🎯'];

const DEFAULT_IVICA = {
  id: 'admin-ivica',
  name: 'Ivica',
  avatar: '🦁',
  country: 'HR',
  bio: 'Glavni developer i strateg igre',
  points: 0,
  wins: 0,
  losses: 0
};

export default function AdminPanel() {
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState(() => {
    const saved = localStorage.getItem('mlin_admin_profiles');
    return saved ? JSON.parse(saved) : [DEFAULT_IVICA];
  });

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🧙‍♂️');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('HR');

  const [editingId, setEditingId] = useState(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState([]);

  // Nalazi prvo podudaranje imena koje počinje upisanim slovima
  const matchingProfile = name.trim()
    ? profiles.find(p => p.name.toLowerCase().startsWith(name.toLowerCase()) && p.name.toLowerCase() !== name.toLowerCase())
    : null;

  // Izračun sivog nastavka (ghost text)
  const ghostSuffix = matchingProfile
    ? matchingProfile.name.slice(name.length)
    : '';

  // Obrada tipke TAB ili strelice desno za prihvaćanje prijedloga
  const handleKeyDownName = (e) => {
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && matchingProfile) {
      // Ako kursor stoji na samom kraju teksta ili se pritisne Tab
      if (e.key === 'Tab' || e.target.selectionStart === name.length) {
        e.preventDefault();
        setName(matchingProfile.name);
      }
    }
  };

  const handleSelectProfile = (player) => {
    if (isDeleteMode || editingId !== null) return;

    const activeProfile = {
      name: player.name,
      avatar: player.avatar,
      bio: player.bio || 'Spreman za igru!',
      country: player.country || 'HR',
      points: player.points || 0,
      wins: player.wins || 0,
      losses: player.losses || 0,
      matchHistory: []
    };

    localStorage.setItem('mlin_user_profile', JSON.stringify(activeProfile));
    navigate('/');
  };

  const handleStartEdit = (e, player) => {
    e.stopPropagation();
    setEditingId(player.id);
    setName(player.name);
    setAvatar(player.avatar);
    setCountry(player.country || 'HR');
    setBio(player.bio || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setAvatar('🧙‍♂️');
    setBio('');
    setCountry('HR');
  };

  const handleSubmitProfile = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      const updated = profiles.map(p => {
        if (p.id === editingId) {
          return {
            ...p,
            name: name.trim(),
            avatar,
            country: country.trim().toUpperCase() || 'HR',
            bio: bio.trim() || 'Spreman za igru!'
          };
        }
        return p;
      });

      setProfiles(updated);
      localStorage.setItem('mlin_admin_profiles', JSON.stringify(updated));

      const savedActive = localStorage.getItem('mlin_user_profile');
      if (savedActive) {
        const parsed = JSON.parse(savedActive);
        const editedPlayer = updated.find(p => p.id === editingId);
        if (parsed.name === editedPlayer.name || editingId === 'admin-ivica') {
          localStorage.setItem('mlin_user_profile', JSON.stringify({
            ...parsed,
            name: editedPlayer.name,
            avatar: editedPlayer.avatar,
            country: editedPlayer.country,
            bio: editedPlayer.bio
          }));
        }
      }

      handleCancelEdit();
    } else {
      const newProfile = {
        id: 'player-' + Date.now(),
        name: name.trim(),
        avatar,
        bio: bio.trim() || 'Spreman za igru!',
        country: country.trim().toUpperCase() || 'HR',
        points: 0,
        wins: 0,
        losses: 0
      };

      const updated = [...profiles, newProfile];
      setProfiles(updated);
      localStorage.setItem('mlin_admin_profiles', JSON.stringify(updated));

      handleSelectProfile(newProfile);
    }
  };

  const toggleSelectDelete = (id) => {
    setSelectedForDelete(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
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

    <div style={{
      width: '95%',
      maxWidth: '1100px',
      margin: '30px auto',
      padding: '32px',
      backgroundColor: '#0f172a',
      borderRadius: '16px',
      color: '#fff',
      fontFamily: 'sans-serif',
      boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
      boxSizing: 'border-box'
    }}>

      {/* GORNJA TRAKA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            backgroundColor: '#334155',
            color: '#f8fafc',
            border: '1px solid #475569',
            padding: '8px 14px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 'bold'
          }}
        >
          ⬅ Natrag u igru
        </button>

        {!isDeleteMode ? (
          <button
            type="button"
            onClick={() => {
              handleCancelEdit();
              setIsDeleteMode(true);
            }}
            style={{
              backgroundColor: '#ef4444',
              color: '#fff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 'bold'
            }}
          >
            🗑️ Obriši profile
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              type="button"
              onClick={handleConfirmDelete}
              style={{
                backgroundColor: '#dc2626',
                color: '#fff',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                marginLeft: '12px'
              }}
            >
              Potvrdi brisanje ({selectedForDelete.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setIsDeleteMode(false);
                setSelectedForDelete([]);
              }}
              style={{
                backgroundColor: '#475569',
                color: '#fff',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              Odustani
            </button>
          </div>
        )}
      </div>

      <h2 style={{ textAlign: 'center', color: '#fbbf24', marginBottom: '8px' }}>🛠️ Prijava i Upravljanje Profilima</h2>
      <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '24px' }}>
        {isDeleteMode
          ? 'Označite profile koje želite trajno obrisati:'
          : editingId
            ? 'Uređivanje odabranog profila:'
            : 'Odaberi profil za igru ili kreiraj novi:'}
      </p>

      {/* FORMA ZA UNOS / UREĐIVANJE */}
      {!isDeleteMode && (
        <form onSubmit={handleSubmitProfile} style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '10px', marginBottom: '28px', border: editingId ? '1px solid #f59e0b' : '1px solid #334155' }}>
          <h4 style={{ margin: '0 0 16px 0', color: editingId ? '#f59e0b' : '#38bdf8' }}>
            {editingId ? '✏️ Uredi profil' : '➕ Novi igrač — Kreiraj profil'}
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Ime igrača:</label>
                {ghostSuffix && (
                  <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>Pritisni [Tab] za dopunu</span>
                )}
              </div>

              {/* Relativni omotač za preklapanje ghost teksta i inputa */}
              <div style={{ position: 'relative', width: '100%' }}>
                {/* Pozadinski sloj koji prikazuje sivi prijedlog */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: '8px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontFamily: 'inherit',
                    lineHeight: 'normal',
                    whiteSpace: 'pre',
                    pointerEvents: 'none',
                    boxSizing: 'border-box',
                    overflow: 'hidden'
                  }}
                >
                  <span style={{ opacity: 0 }}>{name}</span>
                  <span style={{ color: '#64748b' }}>{ghostSuffix}</span>
                </div>

                {/* Stvarni input polja */}
                <input
                  type="text"
                  required
                  list="existing-names"
                  placeholder="npr. Marko"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={handleKeyDownName}
                  style={{
                    position: 'relative',
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    backgroundColor: 'transparent',
                    border: '1px solid #475569',
                    color: '#fff',
                    boxSizing: 'border-box',
                    fontSize: '0.85rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Datalist za standardni padajući prozorčić */}
              <datalist id="existing-names">
                {profiles.map(p => (
                  <option key={p.id} value={p.name} />
                ))}
              </datalist>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Avatar:</label>
              <select
                value={avatar}
                onChange={e => setAvatar(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #475569', color: '#fff', boxSizing: 'border-box' }}
              >
                {AVATAR_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Zemlja (kod):</label>
              <input
                type="text"
                maxLength="3"
                placeholder="HR"
                value={country}
                onChange={e => setCountry(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #475569', color: '#fff', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Kratki status / Bio:</label>
              <input
                type="text"
                placeholder="Duhoviti opis..."
                value={bio}
                onChange={e => setBio(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #475569', color: '#fff', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  backgroundColor: editingId ? '#f59e0b' : '#22c55e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {editingId ? 'Spremi izmjene' : 'Kreiraj i igraj'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  style={{ padding: '9px 12px', backgroundColor: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Odustani
                </button>
              )}
            </div>
          </div>
        </form>
      )}

      {/* POPIS PROFILA */}
      <h4 style={{ margin: '0 0 16px 0', color: '#e2e8f0' }}>👥 Dostupni profili:</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {profiles.map(p => {
          const isIvica = p.id === 'admin-ivica';
          const isSelected = selectedForDelete.includes(p.id);
          const isBeingEdited = editingId === p.id;

          return (
            <div
              key={p.id}
              onClick={() => {
                if (isDeleteMode && !isIvica) {
                  toggleSelectDelete(p.id);
                } else if (!isDeleteMode) {
                  handleSelectProfile(p);
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                backgroundColor: isSelected
                  ? '#450a0a'
                  : isBeingEdited
                    ? '#292524'
                    : (isIvica ? '#1e3a5f' : '#1e293b'),
                borderRadius: '8px',
                border: isSelected
                  ? '1px solid #ef4444'
                  : isBeingEdited
                    ? '1px solid #f59e0b'
                    : (isIvica ? '1px solid #38bdf8' : '1px solid #334155'),
                cursor: (isDeleteMode && isIvica) ? 'default' : 'pointer',
                opacity: (isDeleteMode && isIvica) ? 0.6 : 1
              }}
            >
              {isDeleteMode && !isIvica && (
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelectDelete(p.id)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              )}

              <span style={{ fontSize: '2rem' }}>{p.avatar}</span>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#f8fafc' }}>
                  {p.name} <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>({p.country})</span>
                  {isIvica && <span style={{ marginLeft: '6px', fontSize: '0.7rem', color: '#38bdf8', border: '1px solid #38bdf8', padding: '1px 4px', borderRadius: '4px' }}>ADMIN</span>}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#cbd5e1', fontStyle: 'italic', margin: '2px 0' }}>
                  "{p.bio}"
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {p.points || 0} bodova | {p.wins || 0}W - {p.losses || 0}L
                </div>
              </div>

              {!isDeleteMode && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button
                    type="button"
                    style={{ backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '5px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}
                  >
                    Igraj
                  </button>
                  <button
                    type="button"
                    title="Uredi profil"
                    onClick={(e) => handleStartEdit(e, p)}
                    style={{ backgroundColor: '#475569', color: '#fbbf24', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}
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
  );
}