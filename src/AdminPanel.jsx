// src/AdminPanel.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AVATAR_OPTIONS = ['🦁', '🧙‍♂️', '⚡', '🌙', '🎨', '🕹️', '❄️', '🤫', '🚀', '🌟', '☕', '🐱', '🤖', '🦊', '🦉', '🎯'];

// Popis svih svjetskih država s dvoslovnim kodom, imenom i emoji zastavicom
const ALL_COUNTRIES = [
  { code: 'AF', name: 'Afganistan', flag: '🇦🇫' },
  { code: 'AL', name: 'Albanija', flag: '🇦🇱' },
  { code: 'DZ', name: 'Alžir', flag: '🇩🇿' },
  { code: 'AD', name: 'Andora', flag: '🇦🇩' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴' },
  { code: 'AG', name: 'Antigva i Barbuda', flag: '🇦🇬' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'AM', name: 'Armenija', flag: '🇦🇲' },
  { code: 'AU', name: 'Australija', flag: '🇦🇺' },
  { code: 'AT', name: 'Austrija', flag: '🇦🇹' },
  { code: 'AZ', name: 'Azerbajdžan', flag: '🇦🇿' },
  { code: 'BS', name: 'Bahami', flag: '🇧🇸' },
  { code: 'BH', name: 'Bahrein', flag: '🇧🇭' },
  { code: 'BD', name: 'Bangladeš', flag: '🇧🇩' },
  { code: 'BB', name: 'Barbados', flag: '🇧🇧' },
  { code: 'BE', name: 'Belgija', flag: '🇧🇪' },
  { code: 'BZ', name: 'Belize', flag: '🇧🇿' },
  { code: 'BJ', name: 'Benin', flag: '🇧🇯' },
  { code: 'BT', name: 'Butan', flag: '🇧🇹' },
  { code: 'BO', name: 'Bolivija', flag: '🇧🇴' },
  { code: 'BA', name: 'Bosna i Hercegovina', flag: '🇧🇦' },
  { code: 'BW', name: 'Bocvana', flag: '🇧🇼' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'BN', name: 'Brunej', flag: '🇧🇳' },
  { code: 'BG', name: 'Bugarska', flag: '🇧🇬' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮' },
  { code: 'CV', name: 'Zelenortska Republika', flag: '🇨🇻' },
  { code: 'KH', name: 'Kambodža', flag: '🇰🇭' },
  { code: 'CM', name: 'Kamerun', flag: '🇨🇲' },
  { code: 'CA', name: 'Kanada', flag: '🇨🇦' },
  { code: 'CF', name: 'Srednjoafrička Republika', flag: '🇨🇫' },
  { code: 'TD', name: 'Čad', flag: '🇹🇩' },
  { code: 'CL', name: 'Čile', flag: '🇨🇱' },
  { code: 'CN', name: 'Kina', flag: '🇨🇳' },
  { code: 'CO', name: 'Kolumbija', flag: '🇨🇴' },
  { code: 'KM', name: 'Komori', flag: '🇰🇲' },
  { code: 'CG', name: 'Kongo', flag: '🇨🇬' },
  { code: 'CD', name: 'DR Kongo', flag: '🇨🇩' },
  { code: 'CR', name: 'Kostarika', flag: '🇨🇷' },
  { code: 'CI', name: 'Obala Bjelokosti', flag: '🇨🇮' },
  { code: 'HR', name: 'Hrvatska', flag: '🇭🇷' },
  { code: 'CU', name: 'Kuba', flag: '🇨🇺' },
  { code: 'CY', name: 'Cipar', flag: '🇨🇾' },
  { code: 'CZ', name: 'Češka', flag: '🇨🇿' },
  { code: 'DK', name: 'Danska', flag: '🇩🇰' },
  { code: 'DJ', name: 'Džibuti', flag: '🇩🇯' },
  { code: 'DM', name: 'Dominika', flag: '🇩🇲' },
  { code: 'DO', name: 'Dominikanska Republika', flag: '🇩🇴' },
  { code: 'EC', name: 'Ekvador', flag: '🇪🇨' },
  { code: 'EG', name: 'Egipat', flag: '🇪🇬' },
  { code: 'SV', name: 'Salvador', flag: '🇸🇻' },
  { code: 'GQ', name: 'Ekvatorska Gvineja', flag: '🇬🇶' },
  { code: 'ER', name: 'Eritreja', flag: '🇪🇷' },
  { code: 'EE', name: 'Estonija', flag: '🇪🇪' },
  { code: 'SZ', name: 'Esvatini', flag: '🇸🇿' },
  { code: 'ET', name: 'Etiopija', flag: '🇪🇹' },
  { code: 'FJ', name: 'Fidži', flag: '🇫🇯' },
  { code: 'FI', name: 'Finska', flag: '🇫🇮' },
  { code: 'FR', name: 'Francuska', flag: '🇫🇷' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦' },
  { code: 'GM', name: 'Gambija', flag: '🇬🇲' },
  { code: 'GE', name: 'Gruzija', flag: '🇬🇪' },
  { code: 'DE', name: 'Njemačka', flag: '🇩🇪' },
  { code: 'GH', name: 'Gana', flag: '🇬🇭' },
  { code: 'GR', name: 'Grčka', flag: '🇬🇷' },
  { code: 'GD', name: 'Grenada', flag: '🇬🇩' },
  { code: 'GT', name: 'Gvatemala', flag: '🇬🇹' },
  { code: 'GN', name: 'Gvineja', flag: '🇬🇳' },
  { code: 'GW', name: 'Gvineja Bisau', flag: '🇬🇼' },
  { code: 'GY', name: 'Gvajana', flag: '🇬🇾' },
  { code: 'HT', name: 'Haiti', flag: '🇭🇹' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳' },
  { code: 'HU', name: 'Mađarska', flag: '🇭🇺' },
  { code: 'IS', name: 'Island', flag: '🇮🇸' },
  { code: 'IN', name: 'Indija', flag: '🇮🇳' },
  { code: 'ID', name: 'Indonezija', flag: '🇮🇩' },
  { code: 'IR', name: 'Iran', flag: '🇮🇷' },
  { code: 'IQ', name: 'Irak', flag: '🇮🇶' },
  { code: 'IE', name: 'Irska', flag: '🇮🇪' },
  { code: 'IL', name: 'Izrael', flag: '🇮🇱' },
  { code: 'IT', name: 'Italija', flag: '🇮🇹' },
  { code: 'JM', name: 'Jamajka', flag: '🇯🇲' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴' },
  { code: 'KZ', name: 'Kazahstan', flag: '🇰🇿' },
  { code: 'KE', name: 'Kenija', flag: '🇰🇪' },
  { code: 'KI', name: 'Kiribati', flag: '🇰🇮' },
  { code: 'KP', name: 'Sjeverna Koreja', flag: '🇰🇵' },
  { code: 'KR', name: 'Južna Koreja', flag: '🇰🇷' },
  { code: 'KW', name: 'Kuvajt', flag: '🇰🇼' },
  { code: 'KG', name: 'Kirgistan', flag: '🇰🇬' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦' },
  { code: 'LV', name: 'Latvija', flag: '🇱🇻' },
  { code: 'LB', name: 'Libanon', flag: '🇱🇧' },
  { code: 'LS', name: 'Lesoto', flag: '🇱🇸' },
  { code: 'LR', name: 'Liberija', flag: '🇱🇷' },
  { code: 'LY', name: 'Libija', flag: '🇱🇾' },
  { code: 'LI', name: 'Lihtenštajn', flag: '🇱🇮' },
  { code: 'LT', name: 'Litva', flag: '🇱🇹' },
  { code: 'LU', name: 'Luksemburg', flag: '🇱🇺' },
  { code: 'MG', name: 'Madagaskar', flag: '🇲🇬' },
  { code: 'MW', name: 'Malavi', flag: '🇲🇼' },
  { code: 'MY', name: 'Malezija', flag: '🇲🇾' },
  { code: 'MV', name: 'Maldivi', flag: '🇲🇻' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹' },
  { code: 'MH', name: 'Maršalovi Otoci', flag: '🇲🇭' },
  { code: 'MR', name: 'Mauritanija', flag: '🇲🇷' },
  { code: 'MU', name: 'Mauricijus', flag: '🇲🇺' },
  { code: 'MX', name: 'Meksiko', flag: '🇲🇽' },
  { code: 'FM', name: 'Mikronezija', flag: '🇫🇲' },
  { code: 'MD', name: 'Moldavija', flag: '🇲🇩' },
  { code: 'MC', name: 'Monako', flag: '🇲🇨' },
  { code: 'MN', name: 'Mongolija', flag: '🇲🇳' },
  { code: 'ME', name: 'Crna Gora', flag: '🇲🇪' },
  { code: 'MA', name: 'Maroko', flag: '🇲🇦' },
  { code: 'MZ', name: 'Mozambik', flag: '🇲🇿' },
  { code: 'MM', name: 'Mjanmar', flag: '🇲🇲' },
  { code: 'NA', name: 'Namibija', flag: '🇳🇦' },
  { code: 'NR', name: 'Nauru', flag: '🇳🇷' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵' },
  { code: 'NL', name: 'Nizozemska', flag: '🇳🇱' },
  { code: 'NZ', name: 'Novi Zeland', flag: '🇳🇿' },
  { code: 'NI', name: 'Nikaragva', flag: '🇳🇮' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪' },
  { code: 'NG', name: 'Nigerija', flag: '🇳🇬' },
  { code: 'MK', name: 'Sjeverna Makedonija', flag: '🇲🇰' },
  { code: 'NO', name: 'Norveška', flag: '🇳🇴' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'PW', name: 'Palau', flag: '🇵🇼' },
  { code: 'PA', name: 'Panama', flag: '🇵🇦' },
  { code: 'PG', name: 'Papua Nova Gvineja', flag: '🇵🇬' },
  { code: 'PY', name: 'Paragvaj', flag: '🇵🇾' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪' },
  { code: 'PH', name: 'Filipini', flag: '🇵🇭' },
  { code: 'PL', name: 'Poljska', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'QA', name: 'Katar', flag: '🇶🇦' },
  { code: 'RO', name: 'Rumunjska', flag: '🇷🇴' },
  { code: 'RU', name: 'Rusija', flag: '🇷🇺' },
  { code: 'RW', name: 'Ruanda', flag: '🇷🇼' },
  { code: 'KN', name: 'Sveti Kristofor i Nevis', flag: '🇰🇳' },
  { code: 'LC', name: 'Sveta Lucija', flag: '🇱🇨' },
  { code: 'VC', name: 'Sveti Vincent i Grenadini', flag: '🇻🇨' },
  { code: 'WS', name: 'Samoa', flag: '🇼🇸' },
  { code: 'SM', name: 'San Marino', flag: '🇸🇲' },
  { code: 'ST', name: 'Sveti Toma i Princip', flag: '🇸🇹' },
  { code: 'SA', name: 'Saudijska Arabija', flag: '🇸🇦' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳' },
  { code: 'RS', name: 'Srbija', flag: '🇷🇸' },
  { code: 'SC', name: 'Sejšeli', flag: '🇸🇨' },
  { code: 'SL', name: 'Sijera Leone', flag: '🇸🇱' },
  { code: 'SG', name: 'Singapur', flag: '🇸🇬' },
  { code: 'SK', name: 'Slovačka', flag: '🇸🇰' },
  { code: 'SI', name: 'Slovenija', flag: '🇸🇮' },
  { code: 'SB', name: 'Solomonski Otoci', flag: '🇸🇧' },
  { code: 'SO', name: 'Somalija', flag: '🇸🇴' },
  { code: 'ZA', name: 'Južnoafrička Republika', flag: '🇿🇦' },
  { code: 'ES', name: 'Španjolska', flag: '🇪🇸' },
  { code: 'LK', name: 'Šri Lanka', flag: '🇱🇰' },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩' },
  { code: 'SS', name: 'Južni Sudan', flag: '🇸🇸' },
  { code: 'SR', name: 'Surinam', flag: '🇸🇷' },
  { code: 'SE', name: 'Švedska', flag: '🇸🇪' },
  { code: 'CH', name: 'Švicarska', flag: '🇨🇭' },
  { code: 'SY', name: 'Sirija', flag: '🇸🇾' },
  { code: 'TW', name: 'Tajvan', flag: '🇹🇼' },
  { code: 'TJ', name: 'Tadžikistan', flag: '🇹🇯' },
  { code: 'TZ', name: 'Tanzanija', flag: '🇹🇿' },
  { code: 'TH', name: 'Tajland', flag: '🇹🇭' },
  { code: 'TL', name: 'Istočni Timor', flag: '🇹🇱' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬' },
  { code: 'TO', name: 'Tonga', flag: '🇹🇴' },
  { code: 'TT', name: 'Trinidad i Tobago', flag: '🇹🇹' },
  { code: 'TN', name: 'Tunis', flag: '🇹🇳' },
  { code: 'TR', name: 'Turska', flag: '🇹🇷' },
  { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲' },
  { code: 'TV', name: 'Tuvalu', flag: '🇹🇻' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
  { code: 'UA', name: 'Ukrajina', flag: '🇺🇦' },
  { code: 'AE', name: 'Ujedinjeni Arapski Emirati', flag: '🇦🇪' },
  { code: 'GB', name: 'Velika Britanija', flag: '🇬🇧' },
  { code: 'US', name: 'SAD', flag: '🇺🇸' },
  { code: 'UY', name: 'Urugvaj', flag: '🇺🇾' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿' },
  { code: 'VU', name: 'Vanuatu', flag: '🇻🇺' },
  { code: 'VA', name: 'Vatikan', flag: '🇻🇦' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
  { code: 'VN', name: 'Vijetnam', flag: '🇻🇳' },
  { code: 'YE', name: 'Jemen', flag: '🇾🇪' },
  { code: 'ZM', name: 'Zambija', flag: '🇿🇲' },
  { code: 'ZW', name: 'Zimbabve', flag: '🇿🇼' }
];

// Prikaz prave grafičke zastave (radi savršeno na Windowsima, mobitelima i Macu)
const CountryFlag = ({ code, size = '16x12' }) => {
  if (!code) return <span>🌐</span>;
  const lower = code.toLowerCase();
  return (
    <img
      src={`https://flagcdn.com/${size}/${lower}.png`}
      srcSet={`https://flagcdn.com/${size === '16x12' ? '32x24' : '48x36'}/${lower}.png 2x`}
      alt={code}
      style={{
        verticalAlign: 'middle',
        borderRadius: '2px',
        objectFit: 'cover',
        boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
        display: 'inline-block'
      }}
      onError={(e) => {
        // Fallback ako kod ne postoji
        e.target.style.display = 'none';
      }}
    />
  );
};

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

  // Stanja za pretragu država
  const [countrySearch, setCountrySearch] = useState('HR');
  const [isCountryOpen, setIsCountryOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState([]);

  // Filtrirane države na temelju unosa
  const filteredCountries = countrySearch.trim()
    ? ALL_COUNTRIES.filter(c =>
      c.code.toLowerCase().includes(countrySearch.trim().toLowerCase()) ||
      c.name.toLowerCase().includes(countrySearch.trim().toLowerCase())
    )
    : ALL_COUNTRIES;

  // Nalazi prvo podudaranje imena koje počinje upisanim slovima
  const matchingProfile = name.trim()
    ? profiles.find(p => p.name.toLowerCase().startsWith(name.toLowerCase()) && p.name.toLowerCase() !== name.toLowerCase())
    : null;

  const ghostSuffix = matchingProfile
    ? matchingProfile.name.slice(name.length)
    : '';

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
    setCountrySearch(player.country || 'HR');
    setBio(player.bio || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleSubmitProfile = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalCountry = country.trim().toUpperCase() || 'HR';

    if (editingId) {
      const updated = profiles.map(p => {
        if (p.id === editingId) {
          return {
            ...p,
            name: name.trim(),
            avatar,
            country: finalCountry,
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
        country: finalCountry,
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

            {/* IME S AUTOCOMPLETEOM */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Ime igrača:</label>
                {ghostSuffix && (
                  <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>Pritisni [Tab] za dopunu</span>
                )}
              </div>

              <div style={{ position: 'relative', width: '100%' }}>
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

                <input
                  type="text"
                  required
                  autoComplete="off"
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

              <datalist id="existing-names">
                {profiles.map(p => (
                  <option key={p.id} value={p.name} />
                ))}
              </datalist>
            </div>

            {/* AVATAR */}
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

            {/* ZEMLJA S ZASTAVICOM UNUTAR POLJA I PADAJUĆIM IZBORNIKOM */}
            <div style={{ position: 'relative' }}>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Zemlja:
              </label>

              <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
                {/* Zastava smještena unutar samog input polja */}
                <div style={{
                  position: 'absolute',
                  left: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  pointerEvents: 'none',
                  zIndex: 2
                }}>
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
                    if (val.trim().length === 2) {
                      setCountry(val.trim().toUpperCase());
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => setIsCountryOpen(false), 250);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 10px 8px 38px', // padding-left 38px ostavlja točno mjesta za zastavicu
                    borderRadius: '6px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #475569',
                    color: '#fff',
                    boxSizing: 'border-box',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              {/* Padajući izbornik */}
              {isCountryOpen && filteredCountries.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '6px',
                  marginTop: '4px',
                  zIndex: 30,
                  maxHeight: '190px',
                  overflowY: 'auto',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.7)'
                }}>
                  {filteredCountries.map(c => (
                    <div
                      key={c.code}
                      onMouseDown={() => {
                        setCountry(c.code);
                        setCountrySearch(c.code);
                        setIsCountryOpen(false);
                      }}
                      style={{
                        padding: '8px 12px',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        borderBottom: '1px solid #334155',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        backgroundColor: country === c.code ? '#334155' : 'transparent',
                        color: '#fff'
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

            {/* STATUS / BIO */}
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
                opacity: (isDeleteMode && isIvica) ? 0.6 : 1,
                userSelect: 'none'
              }}
            >
              {isDeleteMode && !isIvica && (
                <input
                  type="checkbox"
                  checked={isSelected}
                  readOnly
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    pointerEvents: 'none'
                  }}
                />
              )}

              <span style={{ fontSize: '2rem' }}>{p.avatar}</span>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#f8fafc' }}>
                 
                  <span style={{ fontSize: '1rem', marginLeft: '2px' }} title={p.country}>
                    <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{p.name}</span>
                      <CountryFlag code={p.country} size="20x15" />
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>({p.country})</span>
                      {isIvica && (
                        <span style={{ marginLeft: '6px', fontSize: '0.7rem', color: '#38bdf8', border: '1px solid #38bdf8', padding: '1px 4px', borderRadius: '4px' }}>
                          ADMIN
                        </span>
                      )}
                    </div>
                    
                  </span>{' '}
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>({p.country})</span>
                  {isIvica && (
                    <span style={{ marginLeft: '6px', fontSize: '0.7rem', color: '#38bdf8', border: '1px solid #38bdf8', padding: '1px 4px', borderRadius: '4px' }}>
                      ADMIN
                    </span>
                  )}
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