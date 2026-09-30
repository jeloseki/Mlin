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

  // Stanje forme za unos novog igrača
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🧙‍♂️');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('HR');

  // Stanja za višekratno brisanje
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState([]);

  const handleSelectProfile = (player) => {
    if (isDeleteMode) return; // Ako smo u modu brisanja, klik ne prijavljuje igrača

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

  const handleCreateProfile = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

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
  };

  // Uključivanje / isključivanje checkboxa za brisanje
  const toggleSelectDelete = (id) => {
    setSelectedForDelete(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Potvrda brisanja označenih profila
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
    <div style={{ maxWidth: '750px', margin: '30px auto', padding: '24px', backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontFamily: 'sans-serif', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
      
      {/* GORNJA TRAKA: NATRAG LIJEVO, BRISANJE DESNO */}
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
            onClick={() => setIsDeleteMode(true)}
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
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={handleConfirmDelete}
              style={{
                backgroundColor: '#dc2626',
                color: '#fff',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 'bold'
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

      <h2 style={{ textAlign: 'center', color: '#fbbf24', marginBottom: '8px' }}>🛠️ Prijava i Kreiranje Igrača</h2>
      <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '24px' }}>
        {isDeleteMode ? 'Označite profile koje želite trajno obrisati:' : 'Odaberi profil za igru ili kreiraj novi:'}
      </p>

      {/* FORMA ZA UNOS NOVOG PROFILA (SKRIVA SE DOK JE UKLJUČEN MOD BRISANJA) */}
      {!isDeleteMode && (
        <form onSubmit={handleCreateProfile} style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #334155' }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#38bdf8' }}>➕ Novi igrač — Kreiraj profil</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', alignItems: 'flex-end' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Tvoje ime:</label>
              <input 
                type="text" 
                required 
                placeholder="npr. Marko" 
                value={name} 
                onChange={e => setName(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #475569', color: '#fff', boxSizing: 'border-box' }}
              />
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

            <button 
              type="submit" 
              style={{ padding: '9px 16px', backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Kreiraj i uđi u igru
            </button>
          </div>
        </form>
      )}

      {/* POPIS PROFILA */}
      <h4 style={{ margin: '0 0 12px 0', color: '#e2e8f0' }}>👥 Dostupni profili:</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
        {profiles.map(p => {
          const isIvica = p.id === 'admin-ivica';
          const isSelected = selectedForDelete.includes(p.id);

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
                backgroundColor: isSelected ? '#450a0a' : (isIvica ? '#1e3a5f' : '#1e293b'),
                borderRadius: '8px',
                border: isSelected ? '1px solid #ef4444' : (isIvica ? '1px solid #38bdf8' : '1px solid #334155'),
                cursor: (isDeleteMode && isIvica) ? 'default' : 'pointer',
                opacity: (isDeleteMode && isIvica) ? 0.6 : 1
              }}
            >
              {/* CHECKBOX PRIKAZAN SAMO U DELETE MODU I SAMO ZA DRUGE PROFILE */}
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
              </div>

              {!isDeleteMode && (
                <button 
                  type="button"
                  style={{ backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  Prijavi se
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}