// src/admin/adminConstants.js
// Extracted static data, styles and helper functions from AdminPanel.jsx

export const DEFAULT_IVICA = {
  id: 'admin-ivica',
  name: 'Ivica',
  avatar: '🦁',
  country: 'HR',
  bio: 'Lead developer and game strategist',
  points: 0,
  wins: 0,
  losses: 0,
  matchHistory: [],
  achievements: [],
  unlockedAvatars: []
};

export const DEFAULT_SCORING_RULES = [
  { id: 'rule-win', icon: '🏆', title: 'Win', value: '+12 Points' },
  { id: 'rule-loss', icon: '❌', title: 'Loss', value: '-6 Points' },
  { id: 'rule-mill', icon: '🎯', title: 'Mill bonus', value: '+1 Point per mill (Max +4 per match)' },
  { id: 'rule-dom', icon: '👑', title: 'Dominant win (6+ pieces)', value: '+3 Points' },
  { id: 'rule-streak', icon: '🔥', title: 'Win streak (3+ wins in a row)', value: '+3 Points' },
  { id: 'rule-prot', icon: '🛡️', title: 'Protection', value: 'Points cannot drop below 0' }
];

export const MENU_GROUPS = [
  {
    id: 'profiles',
    label: '👥 Players and Profiles',
    items: [
      { id: 'profiles_list', label: '📋 Available profiles' },
      { id: 'profiles_create', label: '➕ Create / Edit profile' }
    ]
  },
  {
    id: 'boards',
    label: '🎨 Board Themes',
    items: [
      { id: 'board_assign', label: '🖼️ Catalog and board assignment' }
    ]
  },
  {
    id: 'achievements',
    label: '🏅 Achievements',
    items: [
      { id: 'ach_assign', label: '🎖️ Catalog and achievement assignment' },
      { id: 'ach_create', label: '✨ Create achievement' }
    ]
  },
  {
    id: 'avatars',
    label: '🦁 Avatars',
    items: [
      { id: 'avatar_assign', label: '🎭 Catalog and avatar assignment' },
      { id: 'avatar_create', label: '✨ Create avatar' }
    ]
  },
  {
    id: 'system',
    label: '⚙️ System and Rules',
    items: [
      { id: 'scoring', label: '⚖️ Scoring system' }
    ]
  }
];

export const SIDEBAR_WIDTH = 'max(220px, calc((100vw - 1130px) / 2))';

export const S = {
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

// Helper function that reliably detects whether an avatar was manually created in the Admin panel
export const isAvatarCreated = (av) => {
  if (!av || av.isDefault) return false;
  if (av.isCustom === true) return true;
  if (av.id && !av.id.startsWith('av_')) return true;
  if (av.id && av.id.startsWith('av_')) {
    const num = parseInt(av.id.replace('av_', ''), 10);
    if (!isNaN(num) && num > 80) return true;
  }
  return false;
};

// Helper function that reliably detects whether an achievement was manually created in the Admin panel
export const isAchievementCreated = (ach) => {
  if (!ach || ach.isDefault) return false;
  if (ach.isCustom === true) return true;
  if (ach.id && !ach.id.startsWith('ach_')) return true;
  if (ach.id && ach.id.startsWith('ach_')) {
    const num = parseInt(ach.id.replace('ach_', ''), 10);
    if (!isNaN(num) && num > 100) return true;
  }
  return false;
};
