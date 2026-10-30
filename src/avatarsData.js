import { collection, getDocs, setDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

// Katalog od 80 avatara:
// Prvih 10 (av_01 do av_10) je otključano svima u startu (isDefault: true)
// Ostalih 70 (av_11 do av_80) se osvaja kroz igru ili dodjeljuje u Admin Panelu (M:N veza)
export const INITIAL_AVATARS = [
  // --- 1-10: POČETNI AVATARI (OTKLJUČANI SVIMA) ---
  { id: 'av_01', icon: '🦁', name: 'Kraljevski Lav', isDefault: true, unlockHint: 'Početni avatar' },
  { id: 'av_02', icon: '🐺', name: 'Sivi Vuk', isDefault: true, unlockHint: 'Početni avatar' },
  { id: 'av_03', icon: '🦊', name: 'Mudra Lisica', isDefault: true, unlockHint: 'Početni avatar' },
  { id: 'av_04', icon: '🐻', name: 'Gorski Medvjed', isDefault: true, unlockHint: 'Početni avatar' },
  { id: 'av_05', icon: '🐯', name: 'Sibirski Tigar', isDefault: true, unlockHint: 'Početni avatar' },
  { id: 'av_06', icon: '🦅', name: 'Zlatni Orao', isDefault: true, unlockHint: 'Početni avatar' },
  { id: 'av_07', icon: '🦉', name: 'Noćna Sova', isDefault: true, unlockHint: 'Početni avatar' },
  { id: 'av_08', icon: '🐼', name: 'Zen Panda', isDefault: true, unlockHint: 'Početni avatar' },
  { id: 'av_09', icon: '🐨', name: 'Mirna Koala', isDefault: true, unlockHint: 'Početni avatar' },
  { id: 'av_10', icon: '🐸', name: 'Sretna Žaba', isDefault: true, unlockHint: 'Početni avatar' },

  // --- 11-25: DIVLJE ZVIJERI I PRIRODA (Osvajaju se prvim pobjedama i mečevima) ---
  { id: 'av_11', icon: '🐗', name: 'Divlja Svinja', isDefault: false, reqWins: 1, unlockHint: 'Ostvari 1 pobjedu' },
  { id: 'av_12', icon: '🐴', name: 'Brzi Pastuh', isDefault: false, reqMatches: 2, unlockHint: 'Odigraj 2 meča' },
  { id: 'av_13', icon: '🦄', name: 'Mistični Jednorog', isDefault: false, reqWins: 2, unlockHint: 'Ostvari 2 pobjede' },
  { id: 'av_14', icon: '🐝', name: 'Vrijedna Pčela', isDefault: false, reqMatches: 3, unlockHint: 'Odigraj 3 meča' },
  { id: 'av_15', icon: '🦋', name: 'Carski Leptir', isDefault: false, reqWins: 3, unlockHint: 'Ostvari 3 pobjede' },
  { id: 'av_16', icon: '🐢', name: 'Stara Kornjača', isDefault: false, reqMatches: 5, unlockHint: 'Odigraj 5 mečeva' },
  { id: 'av_17', icon: '🐍', name: 'Kraljevska Kobra', isDefault: false, reqWins: 4, unlockHint: 'Ostvari 4 pobjede' },
  { id: 'av_18', icon: '🦎', name: 'Brzi Gekon', isDefault: false, reqMatches: 7, unlockHint: 'Odigraj 7 mečeva' },
  { id: 'av_19', icon: '🦖', name: 'Moćni T-Rex', isDefault: false, reqWins: 5, unlockHint: 'Ostvari 5 pobjeda' },
  { id: 'av_20', icon: '🐙', name: 'Dubinska Hobotnica', isDefault: false, reqPoints: 50, unlockHint: 'Skupi 50 bodova' },
  { id: 'av_21', icon: '🦈', name: 'Velika Bijela Psina', isDefault: false, reqWins: 6, unlockHint: 'Ostvari 6 pobjeda' },
  { id: 'av_22', icon: '🐬', name: 'Plavi Dupin', isDefault: false, reqPoints: 80, unlockHint: 'Skupi 80 bodova' },
  { id: 'av_23', icon: '🐳', name: 'Čuvar Oceana', isDefault: false, reqMatches: 10, unlockHint: 'Odigraj 10 mečeva' },
  { id: 'av_24', icon: '🐊', name: 'Nilski Krokodil', isDefault: false, reqWins: 7, unlockHint: 'Ostvari 7 pobjeda' },
  { id: 'av_25', icon: '🐆', name: 'Snježni Leopard', isDefault: false, reqPoints: 120, unlockHint: 'Skupi 120 bodova' },

  // --- 26-40: RATNICI, FANTAZIJA I MAGIJA ---
  { id: 'av_26', icon: '🦓', name: 'Stepska Zebra', isDefault: false, reqMatches: 12, unlockHint: 'Odigraj 12 mečeva' },
  { id: 'av_27', icon: '🦍', name: 'Srebrni Gorila', isDefault: false, reqWins: 8, unlockHint: 'Ostvari 8 pobjeda' },
  { id: 'av_28', icon: '🐘', name: 'Carski Slon', isDefault: false, reqPoints: 160, unlockHint: 'Skupi 160 bodova' },
  { id: 'av_29', icon: '🦏', name: 'Oklopljeni Nosorog', isDefault: false, reqWins: 10, unlockHint: 'Ostvari 10 pobjeda' },
  { id: 'av_30', icon: '🐪', name: 'Pustinjski Putnik', isDefault: false, reqMatches: 15, unlockHint: 'Odigraj 15 mečeva' },
  { id: 'av_31', icon: '🦒', name: 'Visoki Izviđač', isDefault: false, reqPoints: 200, unlockHint: 'Skupi 200 bodova (Srebro)' },
  { id: 'av_32', icon: '🦘', name: 'Skakač Prerije', isDefault: false, reqWins: 12, unlockHint: 'Ostvari 12 pobjeda' },
  { id: 'av_33', icon: '🦬', name: 'Divlji Bizon', isDefault: false, reqMatches: 18, unlockHint: 'Odigraj 18 mečeva' },
  { id: 'av_34', icon: '🐉', name: 'Mistični Zmaj', isDefault: false, reqPoints: 250, unlockHint: 'Skupi 250 bodova' },
  { id: 'av_35', icon: '🐲', name: 'Čuvar Hrama', isDefault: false, reqWins: 15, unlockHint: 'Ostvari 15 pobjeda' },
  { id: 'av_36', icon: '🧙‍♂️', name: 'Bijeli Čarobnjak', isDefault: false, reqPoints: 300, unlockHint: 'Skupi 300 bodova' },
  { id: 'av_37', icon: '🥷', name: 'Sjenoviti Ninja', isDefault: false, reqWins: 18, unlockHint: 'Ostvari 18 pobjeda' },
  { id: 'av_38', icon: '🦸‍♂️', name: 'Heroj Ploče', isDefault: false, reqMatches: 25, unlockHint: 'Odigraj 25 mečeva' },
  { id: 'av_39', icon: '🦹‍♂️', name: 'Mračni Strateg', isDefault: false, reqWins: 20, unlockHint: 'Ostvari 20 pobjeda' },
  { id: 'av_40', icon: '🧝‍♂️', name: 'Šumski Vilenjak', isDefault: false, reqPoints: 420, unlockHint: 'Skupi 420 bodova (Srebro I)' },

  // --- 41-55: MITOLOGIJA, SVEMIR I TEHNOLOGIJA ---
  { id: 'av_41', icon: '🧛‍♂️', name: 'Noćni Grof', isDefault: false, reqWins: 22, unlockHint: 'Ostvari 22 pobjede' },
  { id: 'av_42', icon: '🧟‍♂️', name: 'Besmrtni Pješak', isDefault: false, reqMatches: 30, unlockHint: 'Odigraj 30 mečeva' },
  { id: 'av_43', icon: '🧞‍♂️', name: 'Duh Svjetiljke', isDefault: false, reqPoints: 500, unlockHint: 'Skupi 500 bodova' },
  { id: 'av_44', icon: '🧜‍♂️', name: 'Vladar Dubina', isDefault: false, reqWins: 25, unlockHint: 'Ostvari 25 pobjeda' },
  { id: 'av_45', icon: '🧚‍♀️', name: 'Gorska Vila', isDefault: false, reqPoints: 560, unlockHint: 'Skupi 560 bodova (Zlato)' },
  { id: 'av_46', icon: '🤖', name: 'Cyber Bot', isDefault: false, reqWins: 28, unlockHint: 'Ostvari 28 pobjeda' },
  { id: 'av_47', icon: '👾', name: 'Arcade Invader', isDefault: false, reqMatches: 35, unlockHint: 'Odigraj 35 mečeva' },
  { id: 'av_48', icon: '👽', name: 'Galaktički Um', isDefault: false, reqPoints: 650, unlockHint: 'Skupi 650 bodova' },
  { id: 'av_49', icon: '👻', name: 'Fantom Mlina', isDefault: false, reqWins: 30, unlockHint: 'Ostvari 30 pobjeda' },
  { id: 'av_50', icon: '💀', name: 'Zlatna Lubanja', isDefault: false, reqPoints: 720, unlockHint: 'Skupi 720 bodova (Zlato II)' },
  { id: 'av_51', icon: '👹', name: 'Crveni Shogun', isDefault: false, reqWins: 35, unlockHint: 'Ostvari 35 pobjeda' },
  { id: 'av_52', icon: '👺', name: 'Tengu Maska', isDefault: false, reqMatches: 40, unlockHint: 'Odigraj 40 mečeva' },
  { id: 'av_53', icon: '🤠', name: 'Lovac na Mlinove', isDefault: false, reqPoints: 800, unlockHint: 'Skupi 800 bodova' },
  { id: 'av_54', icon: '🕵️‍♂️', name: 'Tajni Detektiv', isDefault: false, reqWins: 40, unlockHint: 'Ostvari 40 pobjeda' },
  { id: 'av_55', icon: '💂‍♂️', name: 'Kraljevska Straža', isDefault: false, reqPoints: 900, unlockHint: 'Skupi 900 bodova (Zlato I)' },

  // --- 56-70: ORUŽJE, ELEMENTI I SIMBOLI MOĆI ---
  { id: 'av_56', icon: '🧑‍🚀', name: 'Zvjezdani Pilot', isDefault: false, reqWins: 45, unlockHint: 'Ostvari 45 pobjeda' },
  { id: 'av_57', icon: '👑', name: 'Kruna Šampiona', isDefault: false, reqPoints: 1100, unlockHint: 'Skupi 1100 bodova (Platina)' },
  { id: 'av_58', icon: '⚔️', name: 'Ukršteni Mačevi', isDefault: false, reqWins: 50, unlockHint: 'Ostvari 50 pobjeda' },
  { id: 'av_59', icon: '🛡️', name: 'Titanski Štit', isDefault: false, reqMatches: 50, unlockHint: 'Odigraj 50 mečeva' },
  { id: 'av_60', icon: '🏹', name: 'Vilenjački Luk', isDefault: false, reqPoints: 1250, unlockHint: 'Skupi 1250 bodova' },
  { id: 'av_61', icon: '🗡️', name: 'Oštrica Pobjede', isDefault: false, reqWins: 55, unlockHint: 'Ostvari 55 pobjeda' },
  { id: 'av_62', icon: '🪓', name: 'Vikinška Sjekira', isDefault: false, reqPoints: 1350, unlockHint: 'Skupi 1350 bodova (Platina II)' },
  { id: 'av_63', icon: '🔱', name: 'Posejdonov Trozubac', isDefault: false, reqWins: 60, unlockHint: 'Ostvari 60 pobjeda' },
  { id: 'av_64', icon: '🔥', name: 'Vječni Plamen', isDefault: false, reqPoints: 1500, unlockHint: 'Skupi 1500 bodova' },
  { id: 'av_65', icon: '⚡', name: 'Gromovnik', isDefault: false, reqWins: 65, unlockHint: 'Ostvari 65 pobjeda' },
  { id: 'av_66', icon: '❄️', name: 'Ledeni Kristal', isDefault: false, reqPoints: 1600, unlockHint: 'Skupi 1600 bodova (Platina I)' },
  { id: 'av_67', icon: '🌪️', name: 'Oluja na Ploči', isDefault: false, reqWins: 70, unlockHint: 'Ostvari 70 pobjeda' },
  { id: 'av_68', icon: '☄️', name: 'Kozmički Komet', isDefault: false, reqPoints: 1750, unlockHint: 'Skupi 1750 bodova' },
  { id: 'av_69', icon: '💎', name: 'Čisti Dijamant', isDefault: false, reqPoints: 1900, unlockHint: 'Skupi 1900 bodova (Dijamant)' },
  { id: 'av_70', icon: '🔮', name: 'Kugla Proroka', isDefault: false, reqWins: 80, unlockHint: 'Ostvari 80 pobjeda' },

  // --- 71-80: PRESTIŽNI I VELEMAJSTORSKI AVATARI ---
  { id: 'av_71', icon: '🧿', name: 'Mistični Talisman', isDefault: false, reqPoints: 2100, unlockHint: 'Skupi 2100 bodova' },
  { id: 'av_72', icon: '🏆', name: 'Zlatni Trofej', isDefault: false, reqPoints: 2250, unlockHint: 'Skupi 2250 bodova (Dijamant II)' },
  { id: 'av_73', icon: '🥇', name: 'Zlatna Medalja', isDefault: false, reqWins: 90, unlockHint: 'Ostvari 90 pobjeda' },
  { id: 'av_74', icon: '🎖️', name: 'Orden Časti', isDefault: false, reqPoints: 2500, unlockHint: 'Skupi 2500 bodova' },
  { id: 'av_75', icon: '🎯', name: 'Savršeni Pogodak', isDefault: false, reqPoints: 2650, unlockHint: 'Skupi 2650 bodova (Dijamant I)' },
  { id: 'av_76', icon: '🚀', name: 'Supersonična Raketa', isDefault: false, reqWins: 100, unlockHint: 'Ostvari 100 pobjeda' },
  { id: 'av_77', icon: '🛸', name: 'NLO Gospodar', isDefault: false, reqPoints: 2900, unlockHint: 'Skupi 2900 bodova' },
  { id: 'av_78', icon: '🌋', name: 'Erupcija Moći', isDefault: false, reqPoints: 3100, unlockHint: 'Skupi 3100 bodova (Majstor)' },
  { id: 'av_79', icon: '🌌', name: 'Čuvar Galaksije', isDefault: false, reqPoints: 3450, unlockHint: 'Skupi 3450 bodova' },
  { id: 'av_80', icon: '⚜️', name: 'Velemajstorski Ljiljan', isDefault: false, reqPoints: 3800, unlockHint: 'Skupi 3800 bodova (Velemajstor)' }
];

// Dohvaća katalog avatara i spaja sve izvore (uvijek čuva svih 80 + nove iz Admin Panela)
export const getStoredAvatars = () => {
  const map = new Map();
  INITIAL_AVATARS.forEach(item => map.set(String(item.id).trim(), item));

  try {
    const saved = localStorage.getItem('mlin_admin_avatars');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        parsed.forEach(item => {
          if (item && item.id) {
            map.set(String(item.id).trim(), item);
          }
        });
      }
    }
  } catch (e) { }

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
    if (av.reqWins && wins >= av.reqWins) currentUnlocked.add(av.id);
    if (av.reqMatches && totalMatches >= av.reqMatches) currentUnlocked.add(av.id);
    if (av.reqPoints && points >= av.reqPoints) currentUnlocked.add(av.id);
  });

  return {
    ...profileData,
    unlockedAvatars: Array.from(currentUnlocked)
  };
};

// Sprema katalog u localStorage
export const saveAvatarsToStorage = (avatarsList) => {
  try {
    localStorage.setItem('mlin_admin_avatars', JSON.stringify(avatarsList));
    window.dispatchEvent(new Event('storage'));
  } catch (e) { }
};

// Firebase sinkronizacija - spremanje pojedinačnog avatara
export const saveAvatarToFirebase = async (avatarItem) => {
  if (!db || !avatarItem?.id) return;
  try {
    await setDoc(doc(db, 'avatars', String(avatarItem.id)), avatarItem, { merge: true });
  } catch (e) {
    console.warn('Greška pri spremanju avatara na Firebase:', e);
  }
};

// Firebase sinkronizacija - brisanje avatara
export const deleteAvatarFromFirebase = async (avatarId) => {
  if (!db || !avatarId) return;
  try {
    await deleteDoc(doc(db, 'avatars', String(avatarId)));
  } catch (e) {
    console.warn('Greška pri brisanju avatara s Firebasea:', e);
  }
};

// Povlačenje kataloga s Firebasea i spajanje s postojećih 80 avatara
export const fetchAvatarsFromFirebase = async () => {
  if (!db) return getStoredAvatars();
  try {
    const snap = await getDocs(collection(db, 'avatars'));
    const fbList = [];
    snap.forEach(d => fbList.push({ id: d.id, ...d.data() }));
    if (fbList.length > 0) {
      const mergedMap = new Map();
      getStoredAvatars().forEach(a => mergedMap.set(a.id, a));
      fbList.forEach(a => mergedMap.set(a.id, a));
      const finalCatalog = Array.from(mergedMap.values());
      saveAvatarsToStorage(finalCatalog);
      return finalCatalog;
    }
  } catch (e) { }
  return getStoredAvatars();
};