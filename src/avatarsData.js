import { collection, getDocs, setDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

// Catalog of 80 avatars:
// The first 10 (av_01 to av_10) are unlocked for everyone at the start (isDefault: true)
// The other 70 (av_11 to av_80) are earned through gameplay or assigned in the Admin Panel (M:N relation)
export const INITIAL_AVATARS = [
  // --- 1-10: STARTER AVATARS (UNLOCKED FOR EVERYONE) ---
  { id: 'av_01', icon: '🦁', name: 'Royal Lion', isDefault: true, unlockHint: 'Starter avatar' },
  { id: 'av_02', icon: '🐺', name: 'Gray Wolf', isDefault: true, unlockHint: 'Starter avatar' },
  { id: 'av_03', icon: '🦊', name: 'Wise Fox', isDefault: true, unlockHint: 'Starter avatar' },
  { id: 'av_04', icon: '🐻', name: 'Mountain Bear', isDefault: true, unlockHint: 'Starter avatar' },
  { id: 'av_05', icon: '🐯', name: 'Siberian Tiger', isDefault: true, unlockHint: 'Starter avatar' },
  { id: 'av_06', icon: '🦅', name: 'Golden Eagle', isDefault: true, unlockHint: 'Starter avatar' },
  { id: 'av_07', icon: '🦉', name: 'Night Owl', isDefault: true, unlockHint: 'Starter avatar' },
  { id: 'av_08', icon: '🐼', name: 'Zen Panda', isDefault: true, unlockHint: 'Starter avatar' },
  { id: 'av_09', icon: '🐨', name: 'Calm Koala', isDefault: true, unlockHint: 'Starter avatar' },
  { id: 'av_10', icon: '🐸', name: 'Happy Frog', isDefault: true, unlockHint: 'Starter avatar' },

  // --- 11-25: WILD BEASTS AND NATURE (earned through the first wins and matches) ---
  { id: 'av_11', icon: '🐗', name: 'Wild Boar', isDefault: false, reqWins: 1, unlockHint: 'Get 1 win' },
  { id: 'av_12', icon: '🐴', name: 'Fast Stallion', isDefault: false, reqMatches: 2, unlockHint: 'Play 2 matches' },
  { id: 'av_13', icon: '🦄', name: 'Mystic Unicorn', isDefault: false, reqWins: 2, unlockHint: 'Get 2 wins' },
  { id: 'av_14', icon: '🐝', name: 'Hardworking Bee', isDefault: false, reqMatches: 3, unlockHint: 'Play 3 matches' },
  { id: 'av_15', icon: '🦋', name: 'Imperial Butterfly', isDefault: false, reqWins: 3, unlockHint: 'Get 3 wins' },
  { id: 'av_16', icon: '🐢', name: 'Old Tortoise', isDefault: false, reqMatches: 5, unlockHint: 'Play 5 matches' },
  { id: 'av_17', icon: '🐍', name: 'Royal Cobra', isDefault: false, reqWins: 4, unlockHint: 'Get 4 wins' },
  { id: 'av_18', icon: '🦎', name: 'Fast Gecko', isDefault: false, reqMatches: 7, unlockHint: 'Play 7 matches' },
  { id: 'av_19', icon: '🦖', name: 'Powerful T-Rex', isDefault: false, reqWins: 5, unlockHint: 'Get 5 wins' },
  { id: 'av_20', icon: '🐙', name: 'Deep Octopus', isDefault: false, reqPoints: 50, unlockHint: 'Earn 50 points' },
  { id: 'av_21', icon: '🦈', name: 'Great White Shark', isDefault: false, reqWins: 6, unlockHint: 'Get 6 wins' },
  { id: 'av_22', icon: '🐬', name: 'Blue Dolphin', isDefault: false, reqPoints: 80, unlockHint: 'Earn 80 points' },
  { id: 'av_23', icon: '🐳', name: 'Ocean Guardian', isDefault: false, reqMatches: 10, unlockHint: 'Play 10 matches' },
  { id: 'av_24', icon: '🐊', name: 'Nile Crocodile', isDefault: false, reqWins: 7, unlockHint: 'Get 7 wins' },
  { id: 'av_25', icon: '🐆', name: 'Snow Leopard', isDefault: false, reqPoints: 120, unlockHint: 'Earn 120 points' },

  // --- 26-40: WARRIORS, FANTASY AND MAGIC ---
  { id: 'av_26', icon: '🦓', name: 'Steppe Zebra', isDefault: false, reqMatches: 12, unlockHint: 'Play 12 matches' },
  { id: 'av_27', icon: '🦍', name: 'Silver Gorilla', isDefault: false, reqWins: 8, unlockHint: 'Get 8 wins' },
  { id: 'av_28', icon: '🐘', name: 'Imperial Elephant', isDefault: false, reqPoints: 160, unlockHint: 'Earn 160 points' },
  { id: 'av_29', icon: '🦏', name: 'Armored Rhino', isDefault: false, reqWins: 10, unlockHint: 'Get 10 wins' },
  { id: 'av_30', icon: '🐪', name: 'Desert Traveler', isDefault: false, reqMatches: 15, unlockHint: 'Play 15 matches' },
  { id: 'av_31', icon: '🦒', name: 'Tall Scout', isDefault: false, reqPoints: 200, unlockHint: 'Earn 200 points (Silver)' },
  { id: 'av_32', icon: '🦘', name: 'Prairie Hopper', isDefault: false, reqWins: 12, unlockHint: 'Get 12 wins' },
  { id: 'av_33', icon: '🦬', name: 'Wild Bison', isDefault: false, reqMatches: 18, unlockHint: 'Play 18 matches' },
  { id: 'av_34', icon: '🐉', name: 'Mystic Dragon', isDefault: false, reqPoints: 250, unlockHint: 'Earn 250 points' },
  { id: 'av_35', icon: '🐲', name: 'Temple Guardian', isDefault: false, reqWins: 15, unlockHint: 'Get 15 wins' },
  { id: 'av_36', icon: '🧙‍♂️', name: 'White Wizard', isDefault: false, reqPoints: 300, unlockHint: 'Earn 300 points' },
  { id: 'av_37', icon: '🥷', name: 'Shadow Ninja', isDefault: false, reqWins: 18, unlockHint: 'Get 18 wins' },
  { id: 'av_38', icon: '🦸‍♂️', name: 'Board Hero', isDefault: false, reqMatches: 25, unlockHint: 'Play 25 matches' },
  { id: 'av_39', icon: '🦹‍♂️', name: 'Dark Strategist', isDefault: false, reqWins: 20, unlockHint: 'Get 20 wins' },
  { id: 'av_40', icon: '🧝‍♂️', name: 'Forest Elf', isDefault: false, reqPoints: 420, unlockHint: 'Earn 420 points (Silver I)' },

  // --- 41-55: MYTHOLOGY, SPACE AND TECHNOLOGY ---
  { id: 'av_41', icon: '🧛‍♂️', name: 'Night Count', isDefault: false, reqWins: 22, unlockHint: 'Get 22 wins' },
  { id: 'av_42', icon: '🧟‍♂️', name: 'Immortal Pawn', isDefault: false, reqMatches: 30, unlockHint: 'Play 30 matches' },
  { id: 'av_43', icon: '🧞‍♂️', name: 'Spirit of the Lamp', isDefault: false, reqPoints: 500, unlockHint: 'Earn 500 points' },
  { id: 'av_44', icon: '🧜‍♂️', name: 'Lord of Depths', isDefault: false, reqWins: 25, unlockHint: 'Get 25 wins' },
  { id: 'av_45', icon: '🧚‍♀️', name: 'Mountain Fairy', isDefault: false, reqPoints: 560, unlockHint: 'Earn 560 points (Gold)' },
  { id: 'av_46', icon: '🤖', name: 'Cyber Bot', isDefault: false, reqWins: 28, unlockHint: 'Get 28 wins' },
  { id: 'av_47', icon: '👾', name: 'Arcade Invader', isDefault: false, reqMatches: 35, unlockHint: 'Play 35 matches' },
  { id: 'av_48', icon: '👽', name: 'Galactic Mind', isDefault: false, reqPoints: 650, unlockHint: 'Earn 650 points' },
  { id: 'av_49', icon: '👻', name: 'Mill Phantom', isDefault: false, reqWins: 30, unlockHint: 'Get 30 wins' },
  { id: 'av_50', icon: '💀', name: 'Golden Skull', isDefault: false, reqPoints: 720, unlockHint: 'Earn 720 points (Gold II)' },
  { id: 'av_51', icon: '👹', name: 'Red Shogun', isDefault: false, reqWins: 35, unlockHint: 'Get 35 wins' },
  { id: 'av_52', icon: '👺', name: 'Tengu Mask', isDefault: false, reqMatches: 40, unlockHint: 'Play 40 matches' },
  { id: 'av_53', icon: '🤠', name: 'Mlin Hunter', isDefault: false, reqPoints: 800, unlockHint: 'Earn 800 points' },
  { id: 'av_54', icon: '🕵️‍♂️', name: 'Secret Detective', isDefault: false, reqWins: 40, unlockHint: 'Get 40 wins' },
  { id: 'av_55', icon: '💂‍♂️', name: 'Royal Guard', isDefault: false, reqPoints: 900, unlockHint: 'Earn 900 points (Gold I)' },

  // --- 56-70: WEAPONS, ELEMENTS AND SYMBOLS OF POWER ---
  { id: 'av_56', icon: '🧑‍🚀', name: 'Stellar Pilot', isDefault: false, reqWins: 45, unlockHint: 'Get 45 wins' },
  { id: 'av_57', icon: '👑', name: 'Champion Crown', isDefault: false, reqPoints: 1100, unlockHint: 'Earn 1100 points (Platinum)' },
  { id: 'av_58', icon: '⚔️', name: 'Crossed Swords', isDefault: false, reqWins: 50, unlockHint: 'Get 50 wins' },
  { id: 'av_59', icon: '🛡️', name: 'Titanic Shield', isDefault: false, reqMatches: 50, unlockHint: 'Play 50 matches' },
  { id: 'av_60', icon: '🏹', name: 'Fairy Bow', isDefault: false, reqPoints: 1250, unlockHint: 'Earn 1250 points' },
  { id: 'av_61', icon: '🗡️', name: 'Edge of Victory', isDefault: false, reqWins: 55, unlockHint: 'Get 55 wins' },
  { id: 'av_62', icon: '🪓', name: 'Viking Axe', isDefault: false, reqPoints: 1350, unlockHint: 'Earn 1350 points (Platinum II)' },
  { id: 'av_63', icon: '🔱', name: 'Poseidon Trident', isDefault: false, reqWins: 60, unlockHint: 'Get 60 wins' },
  { id: 'av_64', icon: '🔥', name: 'Eternal Flame', isDefault: false, reqPoints: 1500, unlockHint: 'Earn 1500 points' },
  { id: 'av_65', icon: '⚡', name: 'Thunderer', isDefault: false, reqWins: 65, unlockHint: 'Get 65 wins' },
  { id: 'av_66', icon: '❄️', name: 'Ice Crystal', isDefault: false, reqPoints: 1600, unlockHint: 'Earn 1600 points (Platinum I)' },
  { id: 'av_67', icon: '🌪️', name: 'Storm on the Board', isDefault: false, reqWins: 70, unlockHint: 'Get 70 wins' },
  { id: 'av_68', icon: '☄️', name: 'Cosmic Comet', isDefault: false, reqPoints: 1750, unlockHint: 'Earn 1750 points' },
  { id: 'av_69', icon: '💎', name: 'Pure Diamond', isDefault: false, reqPoints: 1900, unlockHint: 'Earn 1900 points (Diamond)' },
  { id: 'av_70', icon: '🔮', name: 'Prophet Orb', isDefault: false, reqWins: 80, unlockHint: 'Get 80 wins' },

  // --- 71-80: PRESTIGE AND GRANDMASTER AVATARS ---
  { id: 'av_71', icon: '🧿', name: 'Mystic Talisman', isDefault: false, reqPoints: 2100, unlockHint: 'Earn 2100 points' },
  { id: 'av_72', icon: '🏆', name: 'Golden Trophy', isDefault: false, reqPoints: 2250, unlockHint: 'Earn 2250 points (Diamond II)' },
  { id: 'av_73', icon: '🥇', name: 'Golden Medal', isDefault: false, reqWins: 90, unlockHint: 'Get 90 wins' },
  { id: 'av_74', icon: '🎖️', name: 'Order of Honor', isDefault: false, reqPoints: 2500, unlockHint: 'Earn 2500 points' },
  { id: 'av_75', icon: '🎯', name: 'Perfect Hit', isDefault: false, reqPoints: 2650, unlockHint: 'Earn 2650 points (Diamond I)' },
  { id: 'av_76', icon: '🚀', name: 'Supersonic Rocket', isDefault: false, reqWins: 100, unlockHint: 'Get 100 wins' },
  { id: 'av_77', icon: '🛸', name: 'UFO Master', isDefault: false, reqPoints: 2900, unlockHint: 'Earn 2900 points' },
  { id: 'av_78', icon: '🌋', name: 'Eruption of Power', isDefault: false, reqPoints: 3100, unlockHint: 'Earn 3100 points (Master)' },
  { id: 'av_79', icon: '🌌', name: 'Guardian of the Galaxy', isDefault: false, reqPoints: 3450, unlockHint: 'Earn 3450 points' },
  { id: 'av_80', icon: '⚜️', name: 'Grand Master Lily', isDefault: false, reqPoints: 3800, unlockHint: 'Earn 3800 points (Grand Master)' }
];

// Pomoćna funkcija koja pouzdano prepoznaje je li avatar ručno stvoren u Admin panelu
export const isCustomAvatarItem = (av) => {
  if (!av || av.isDefault) return false;
  if (av.isCustom === true) return true;
  const idStr = String(av.id || '').trim();
  if (idStr && !idStr.startsWith('av_')) return true;
  if (idStr.startsWith('av_')) {
    const num = parseInt(idStr.replace('av_', ''), 10);
    return !isNaN(num) && num > 80;
  }
  return false;
};

// Dohvaća katalog avatara i spaja sve izvore (uvijek čuva svih 80 + nove iz Admin Panela)
export const getStoredAvatars = () => {
  const map = new Map();
  INITIAL_AVATARS.forEach(item => {
    map.set(String(item.id).trim(), { ...item, isCustom: false });
  });

  try {
    // Provjeravamo sve ključeve kako ništa ne bi ostalo skriveno
    ['mlin_admin_avatars', 'mlin_avatars_catalog', 'mlin_custom_avatars'].forEach(key => {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          parsed.forEach(item => {
            if (item && item.id) {
              const cleanId = String(item.id).trim();
              const isCustom = isCustomAvatarItem(item);
              map.set(cleanId, { ...item, id: cleanId, isCustom });
            }
          });
        }
      }
    });
  } catch (e) {
    console.warn('Greška pri čitanju avatara iz localStoragea:', e);
  }

  return Array.from(map.values());
};

// Dohvaća ID-jeve prvih 10 avatara koje svaki igrač ima otključane u startu
export const getDefaultUnlockedAvatarIds = () => {
  return getStoredAvatars()
    .filter(a => a.isDefault)
    .map(a => a.id);
};

// Automatski provjerava i otključava nove avatare kroz igru na temelju pobjeda, mečeva i bodova
export const evaluateGameAvatars = (profileData) => {
  if (!profileData) return profileData;

  const catalog = getStoredAvatars();
  const currentUnlocked = new Set([
    ...getDefaultUnlockedAvatarIds(),
    ...(Array.isArray(profileData.unlockedAvatars) ? profileData.unlockedAvatars : [])
  ]);

  const wins = Number(profileData.wins) || 0;
  const losses = Number(profileData.losses) || 0;
  const totalMatches = wins + losses;
  const points = Number(profileData.points) || 0;

  catalog.forEach(av => {
    if (av.isDefault) {
      currentUnlocked.add(av.id);
      return;
    }
    // Unlock only if the condition is set to greater than 0 and the player meets it
    if (Number(av.reqWins) > 0 && wins >= Number(av.reqWins)) currentUnlocked.add(av.id);
    if (Number(av.reqMatches) > 0 && totalMatches >= Number(av.reqMatches)) currentUnlocked.add(av.id);
    if (Number(av.reqPoints) > 0 && points >= Number(av.reqPoints)) currentUnlocked.add(av.id);
  });

  return {
    ...profileData,
    unlockedAvatars: Array.from(currentUnlocked)
  };
};

// Save the catalog to localStorage (syncs all keys)
export const saveAvatarsToStorage = (avatarsList) => {
  try {
    const normalized = avatarsList.map(av => ({
      ...av,
      isCustom: isCustomAvatarItem(av)
    }));
    const customOnly = normalized.filter(av => av.isCustom);

    localStorage.setItem('mlin_admin_avatars', JSON.stringify(normalized));
    localStorage.setItem('mlin_avatars_catalog', JSON.stringify(normalized));
    localStorage.setItem('mlin_custom_avatars', JSON.stringify(customOnly));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.warn('Error saving avatars to localStorage:', e);
  }
};

// Firebase sync - saving a single avatar
export const saveAvatarToFirebase = async (avatarItem) => {
  if (!db || !avatarItem?.id) return;
  try {
    const itemToSave = {
      ...avatarItem,
      isCustom: isCustomAvatarItem(avatarItem)
    };
    await setDoc(doc(db, 'avatars', String(itemToSave.id)), itemToSave, { merge: true });
  } catch (e) {
    console.warn('Error saving avatar to Firebase:', e);
  }
};

// Firebase sync - deleting only the created avatar
export const deleteAvatarFromFirebase = async (avatarId) => {
  if (!avatarId) return;
  const cleanId = String(avatarId).trim();

  // Protection for the first 80 base avatars
  const num = parseInt(cleanId.replace('av_', ''), 10);
  if (cleanId.startsWith('av_') && !isNaN(num) && num <= 80) {
    console.warn('Protected base avatar cannot be deleted:', cleanId);
    return;
  }

  // Remove from all local keys
  try {
    const remaining = getStoredAvatars().filter(a => String(a.id).trim() !== cleanId);
    saveAvatarsToStorage(remaining);
  } catch (e) {
    console.warn('Error deleting avatar locally:', e);
  }

  // Remove from Firebase
  if (db) {
    try {
      await deleteDoc(doc(db, 'avatars', cleanId));
    } catch (e) {
      console.warn('Error deleting avatar from Firebase:', e);
    }
  }
};

// Pull the catalog from Firebase and merge it with the existing 80 avatars
export const fetchAvatarsFromFirebase = async () => {
  if (!db) return getStoredAvatars();
  try {
    const snap = await getDocs(collection(db, 'avatars'));
    const fbList = [];
    snap.forEach(d => {
      const data = d.data();
      const item = { id: d.id, ...data };
      fbList.push({ ...item, isCustom: isCustomAvatarItem(item) });
    });

    if (fbList.length > 0) {
      const mergedMap = new Map();
      // First set the 80 base ones
      INITIAL_AVATARS.forEach(a => mergedMap.set(String(a.id).trim(), { ...a, isCustom: false }));
      // Then append the ones from Firebase (including created ones)
      fbList.forEach(a => mergedMap.set(String(a.id).trim(), a));

      const finalCatalog = Array.from(mergedMap.values());
      saveAvatarsToStorage(finalCatalog);
      return finalCatalog;
    }
  } catch (e) {
    console.warn('Error fetching avatars from Firebase:', e);
  }
  return getStoredAvatars();
};