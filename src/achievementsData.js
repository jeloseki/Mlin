// src/achievementsData.js
import { db } from './firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

export const ACHIEVEMENT_TIERS = {
  BRONZE: { label: 'Bronca', color: '#cd7f32', bg: 'rgba(205, 127, 50, 0.15)', border: '#cd7f32' },
  SILVER: { label: 'Srebro', color: '#cbd5e1', bg: 'rgba(203, 213, 225, 0.15)', border: '#94a3b8' },
  GOLD: { label: 'Zlato', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)', border: '#f59e0b' },
  PLATINUM: { label: 'Platina', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', border: '#0ea5e9' },
  LEGENDARY: { label: 'Legenda', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)', border: '#db2777' },
  SHAME: { label: 'Gaf / Peh', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: '#dc2726' }
};

export const INITIAL_ACHIEVEMENTS = [
  // 1. POČETAK I OSNOVE (Bronca - Pozitivna: 1-15)
  { id: 'ach_001', tier: 'BRONZE', icon: '🌱', title: 'Prvi korak', desc: 'Odigraj svoju prvu partiju Mlina', points: 5, isDefault: true },
  { id: 'ach_002', tier: 'BRONZE', icon: '🎯', title: 'Prvi Mlin', desc: 'Složi svoj prvi mlin u karijeri', points: 5, isDefault: true },
  { id: 'ach_003', tier: 'BRONZE', icon: '🏆', title: 'Prvi Trijumf', desc: 'Ostvari svoju prvu pobjedu', points: 10, isDefault: true },
  { id: 'ach_004', tier: 'BRONZE', icon: '⚔️', title: 'Ubojica figura', desc: 'Ukloni prvu protivničku figuru s ploče', points: 5, isDefault: true },
  { id: 'ach_005', tier: 'BRONZE', icon: '⚪', title: 'Bijela snaga', desc: 'Pobijedi igrajući s bijelim figurama', points: 10, isDefault: true },
  { id: 'ach_006', tier: 'BRONZE', icon: '⚫', title: 'Crna magija', desc: 'Pobijedi igrajući s crnim figurama', points: 10, isDefault: true },
  { id: 'ach_007', tier: 'BRONZE', icon: '🪙', title: 'Sreća na novčiću', desc: 'Pogodi ishod bacanja novčića', points: 5, isDefault: true },
  { id: 'ach_008', tier: 'BRONZE', icon: '🤝', title: 'Lokalni derbi', desc: 'Odigraj meč u lokalnom načinu za dva igrača', points: 5, isDefault: true },
  { id: 'ach_009', tier: 'BRONZE', icon: '🤖', title: 'Učenik i bot', desc: 'Pobijedi Laganog (Easy) AI protivnika', points: 10, isDefault: true },
  { id: 'ach_010', tier: 'BRONZE', icon: '🛡️', title: 'Čuvar bedema', desc: 'Spriječi protivnika da zatvori mlin u postavljanju', points: 10, isDefault: true },
  { id: 'ach_011', tier: 'BRONZE', icon: '📦', title: 'Sve na broju', desc: 'Završi fazu postavljanja bez izgubljene figure', points: 10, isDefault: true },
  { id: 'ach_012', tier: 'BRONZE', icon: '🪨', title: 'Prva blokada', desc: 'Zatvori protivničku figuru tako da nema kamo', points: 10, isDefault: true },
  { id: 'ach_013', tier: 'BRONZE', icon: '🕊️', title: 'Poletanje', desc: 'Dosegni fazu letenja (preostale točno 3 figure)', points: 10, isDefault: true },
  { id: 'ach_014', tier: 'BRONZE', icon: '🔄', title: 'Vraćalica', desc: 'Otvori i ponovno zatvori isti mlin u uzastopnim potezima', points: 10, isDefault: true },
  { id: 'ach_015', tier: 'BRONZE', icon: '⚡', title: 'Dvostruka prijetnja', desc: 'Pripremi dva potencijalna mlina u istom potezu', points: 10, isDefault: true },

  // 2. TAKTIKA I RAZVOJ (Srebro - Pozitivna: 16-35)
  { id: 'ach_016', tier: 'SILVER', icon: '🔥', title: 'Zagrijavanje', desc: 'Ostvari 3 pobjede u nizu', points: 20, isDefault: true },
  { id: 'ach_017', tier: 'SILVER', icon: '🧠', title: 'Nadmudren bot', desc: 'Pobijedi Srednjeg (Medium) AI protivnika', points: 25, isDefault: true },
  { id: 'ach_018', tier: 'SILVER', icon: '🏰', title: 'Opsada', desc: 'Pobijedi protivnika blokiranjem svih njegovih figura', points: 30, isDefault: true },
  { id: 'ach_019', tier: 'SILVER', icon: '🏭', title: 'Mlinar', desc: 'Složi 3 ili više mlinova u istoj partiji', points: 20, isDefault: true },
  { id: 'ach_020', tier: 'SILVER', icon: '🦅', title: 'Povratak iz mrtvih', desc: 'Pobijedi nakon što si spao na 3 figure (faza leta)', points: 30, isDefault: true },
  { id: 'ach_021', tier: 'SILVER', icon: '⏱️', title: 'Munjevit potez', desc: 'Odigraj pobjednički meč u manje od 30 ukupnih poteza', points: 25, isDefault: true },
  { id: 'ach_022', tier: 'SILVER', icon: '🥇', title: 'Bez milosti', desc: 'Sruši protivnika na samo 2 figure prije nego on tebi uzme 2', points: 25, isDefault: true },
  { id: 'ach_023', tier: 'SILVER', icon: '🧩', title: 'Harmonika', desc: 'Uspješno koristi klackalicu (otvaranje dva mlina naizmjence)', points: 25, isDefault: true },
  { id: 'ach_024', tier: 'SILVER', icon: '📐', title: 'Vanjski prsten', desc: 'Složi sva 4 moguća mlina na vanjskom kvadratu kroz meč', points: 25, isDefault: true },
  { id: 'ach_025', tier: 'SILVER', icon: '🎯', title: 'Središnji čvor', desc: 'Pobijedi držeći kontrolu nad sva 4 središnja vezna polja', points: 25, isDefault: true },
  { id: 'ach_026', tier: 'SILVER', icon: '🥋', title: 'Brzi prsti', desc: 'Pobijedi u natjecateljskom meču s vremenskim ograničenjem', points: 25, isDefault: true },
  { id: 'ach_027', tier: 'SILVER', icon: '🛡️', title: 'Tvrđava', desc: 'Pobijedi bez da protivnik složi ijedan mlin', points: 35, isDefault: true },
  { id: 'ach_028', tier: 'SILVER', icon: '🥈', title: 'Skakač', desc: 'Zatvori mlin skokom s točno 3 figure', points: 20, isDefault: true },
  { id: 'ach_029', tier: 'SILVER', icon: '📈', title: 'Desetka', desc: 'Upiši 10 ukupnih pobjeda u karijeri', points: 25, isDefault: true },
  { id: 'ach_030', tier: 'SILVER', icon: '🎖️', title: 'Rani rez', desc: 'Ukloni protivničku figuru već u prva 3 svoja poteza', points: 20, isDefault: true },
  { id: 'ach_031', tier: 'SILVER', icon: '⏳', title: 'Pod pritiskom', desc: 'Napravi potez i složi mlin u zadnje 3 sekunde sata', points: 25, isDefault: true },
  { id: 'ach_032', tier: 'SILVER', icon: '🧹', title: 'Čistač ploče', desc: 'Uzmi protivniku 5 figura prije nego on uzme tvoju prvu', points: 30, isDefault: true },
  { id: 'ach_033', tier: 'SILVER', icon: '🥊', title: 'Uzvratni udarac', desc: 'Složi mlin odmah u potezu nakon što je protivnik složio svoj', points: 20, isDefault: true },
  { id: 'ach_034', tier: 'SILVER', icon: '🌐', title: 'Lokalni šampion', desc: 'Odigraj 10 mečeva u lokalnom modu', points: 20, isDefault: true },
  { id: 'ach_035', tier: 'SILVER', icon: '🔥', title: 'U plamenu', desc: 'Ostvari 5 pobjeda u nizu', points: 35, isDefault: true },

  // 3. NAPREDNO I MAJSTORSTVO (Zlato - Pozitivna: 36-55)
  { id: 'ach_036', tier: 'GOLD', icon: '🤖', title: 'Rušitelj algoritma', desc: 'Pobijedi Teškog (Hard) AI bota', points: 50, isDefault: true },
  { id: 'ach_037', tier: 'GOLD', icon: '👑', title: 'Dominacija', desc: 'Pobijedi ostavivši svih 7 ili više svojih figura na ploči', points: 50, isDefault: true },
  { id: 'ach_038', tier: 'GOLD', icon: '🏆', title: 'Zlatni niz', desc: 'Ostvari 7 pobjeda u nizu', points: 50, isDefault: true },
  { id: 'ach_039', tier: 'GOLD', icon: '🏹', title: 'Snajperist', desc: 'Razbij protivnički ključni mlin u nastajanju 3 puta u partiji', points: 40, isDefault: true },
  { id: 'ach_040', tier: 'GOLD', icon: '🪤', title: 'Zamka stoljeća', desc: 'Prisili protivnika na potez koji mu automatski blokira preostale figure', points: 45, isDefault: true },
  { id: 'ach_041', tier: 'GOLD', icon: '⏱️', title: 'Gospodar sekundi', desc: 'Pobijedi na vrijeme u COMPETITIVE modu', points: 40, isDefault: true },
  { id: 'ach_042', tier: 'GOLD', icon: '🎖️', title: 'Četvrt stoljeća', desc: 'Pobijedi u 25 partija u karijeri', points: 50, isDefault: true },
  { id: 'ach_043', tier: 'GOLD', icon: '🏟️', title: 'Turnirski debi', desc: 'Odigraj svoj prvi službeni turnirski meč', points: 40, isDefault: true },
  { id: 'ach_044', tier: 'GOLD', icon: '🥇', title: 'Turnirska pobjeda', desc: 'Pobijedi u turnirskom meču', points: 50, isDefault: true },
  { id: 'ach_045', tier: 'GOLD', icon: '🌪️', title: 'Tornado mlinova', desc: 'Složi 6 ili više mlinova u jednom jedinom meču', points: 50, isDefault: true },
  { id: 'ach_046', tier: 'GOLD', icon: '💎', title: 'Savršena obrana', desc: 'Pobijedi Teškog AI bota bez ijednog njegovog složenog mlina', points: 60, isDefault: true },
  { id: 'ach_047', tier: 'GOLD', icon: '🧗', title: 'Povratak s ruba ponora', desc: 'Protivnik ima 6 figura a ti 3 — i svejedno pobjeđuješ', points: 60, isDefault: true },
  { id: 'ach_048', tier: 'GOLD', icon: '🎛️', title: 'Univerzalac', desc: 'Pobijedi barem po jednom u Casual, Competitive i AI modu', points: 45, isDefault: true },
  { id: 'ach_049', tier: 'GOLD', icon: '⚙️', title: 'Taktički um', desc: 'Pobijedi isključivo blokadom (bez spuštanja na 2 figure)', points: 50, isDefault: true },
  { id: 'ach_050', tier: 'GOLD', icon: '♟️', title: 'Monolit', desc: 'Završi partiju s netaknutim trostrukim mlinom', points: 45, isDefault: true },
  { id: 'ach_051', tier: 'GOLD', icon: '🏰', title: 'Unutarnje dvorište', desc: 'Složi mlin na najmanjem (unutarnjem) kvadratu i održi ga 5 poteza', points: 40, isDefault: true },
  { id: 'ach_052', tier: 'GOLD', icon: '🎪', title: 'Žongler', desc: 'Imaj istovremeno aktivna 3 različita mlina na ploči', points: 60, isDefault: true },
  { id: 'ach_053', tier: 'GOLD', icon: '🛑', title: 'Stop mašinerija', desc: 'Blokiraj protivnika u prva 4 poteza faze pomicanja', points: 50, isDefault: true },
  { id: 'ach_054', tier: 'GOLD', icon: '🏅', title: 'Pedesetica', desc: 'Odigraj 50 ukupnih mečeva', points: 50, isDefault: true },
  { id: 'ach_055', tier: 'GOLD', icon: '🔥', title: 'Vatreni niz 10', desc: 'Ostvari nevjerojatnih 10 pobjeda u nizu', points: 70, isDefault: true },

  // 4. VRHUNSKI STRUČNJAK (Platina - Pozitivna: 56-68)
  { id: 'ach_056', tier: 'PLATINUM', icon: '🤖', title: 'Majstor protiv stroja', desc: 'Pobijedi Ekspertnog (Expert/Brutal) AI bota', points: 100, isDefault: true },
  { id: 'ach_057', tier: 'PLATINUM', icon: '🏆', title: 'Osvajač turnira', desc: 'Završi turnir kao prvoplasirani igrač', points: 120, isDefault: true },
  { id: 'ach_058', tier: 'PLATINUM', icon: '🦅', title: 'Čelična krila', desc: 'U fazi letenja složi 3 mlina zaredom', points: 90, isDefault: true },
  { id: 'ach_059', tier: 'PLATINUM', icon: '💯', title: 'Stotka', desc: 'Odigraj 100 partija Mlina u karijeri', points: 100, isDefault: true },
  { id: 'ach_060', tier: 'PLATINUM', icon: '⚡', title: 'Apsolutna brzina', desc: 'Pobijedi u Blitz natjecanju bez pada zastavice', points: 90, isDefault: true },
  { id: 'ach_061', tier: 'PLATINUM', icon: '👑', title: 'Kralj niza 15', desc: 'Ostvari 15 pobjeda zaredom u bilo kojem modu', points: 120, isDefault: true },
  { id: 'ach_062', tier: 'PLATINUM', icon: '🛡️', title: 'Besprijekorna partija', desc: 'Pobijedi bez gubitka ijedne svoje figure (svih 9 ostaje)', points: 150, isDefault: true },
  { id: 'ach_063', tier: 'PLATINUM', icon: '🎯', title: 'Stotinu mlinova', desc: 'Složi ukupno 100 mlinova kroz karijeru', points: 100, isDefault: true },
  { id: 'ach_064', tier: 'PLATINUM', icon: '🦾', title: 'Krotitelj bota', desc: 'Pobijedi Hard AI 5 puta zaredom', points: 110, isDefault: true },
  { id: 'ach_065', tier: 'PLATINUM', icon: '⚔️', title: 'Krvnik', desc: 'Ukloni ukupno 250 protivničkih figura kroz karijeru', points: 100, isDefault: true },
  { id: 'ach_066', tier: 'PLATINUM', icon: '🏛️', title: 'Arhitekt igre', desc: 'Ostvari pobjedu zatvaranjem protivnika na točno 3 polja', points: 90, isDefault: true },
  { id: 'ach_067', tier: 'PLATINUM', icon: '🌟', title: 'Pola tisuće', desc: 'Skupi 500 bodova u sustavu bodovanja', points: 100, isDefault: true },
  { id: 'ach_068', tier: 'PLATINUM', icon: '🏆', title: '50 Pobjeda', desc: 'Ostvari 50 pobjeda u karijeri', points: 120, isDefault: true },

  // 5. LEGENDA I ELITA (Legenda - Pozitivna: 69-75)
  { id: 'ach_069', tier: 'LEGENDARY', icon: '👑', title: 'Gospodar Mlina', desc: 'Ostvari 100 pobjeda u karijeri', points: 250, isDefault: true },
  { id: 'ach_070', tier: 'LEGENDARY', icon: '🔥', title: 'Mitski niz 20', desc: 'Nevjerojatan niz od 20 uzastopnih pobjeda', points: 300, isDefault: true },
  { id: 'ach_071', tier: 'LEGENDARY', icon: '💎', title: 'Milijunaš bodova', desc: 'Ostvari preko 1000 rangiranih bodova na profilu', points: 250, isDefault: true },
  { id: 'ach_072', tier: 'LEGENDARY', icon: '🤖', title: 'Kiborg noćna mora', desc: 'Pobijedi Expert AI 10 puta', points: 200, isDefault: true },
  { id: 'ach_073', tier: 'LEGENDARY', icon: '📜', title: 'Vječni igrač', desc: 'Odigraj 250 mečeva', points: 200, isDefault: true },
  { id: 'ach_074', tier: 'LEGENDARY', icon: '✨', title: 'Savršenstvo', desc: 'Pobijedi Teškog AI bota s 9 figura i u manje od 30 poteza', points: 300, isDefault: true },
  { id: 'ach_075', tier: 'LEGENDARY', icon: '🌌', title: 'Besmrtnik', desc: 'Sakupi barem 60 različitih postignuća', points: 350, isDefault: true },

  // 6. NEGATIVNA I UTJEŠNA (Peh / Gaf / Shame: 76-100)
  { id: 'ach_076', tier: 'SHAME', icon: '🩹', title: 'Prva gorka pilula', desc: 'Doživi svoj prvi poraz u igri', points: 0, isDefault: true },
  { id: 'ach_077', tier: 'SHAME', icon: '🧊', title: 'Slijepa ulica', desc: 'Izgubi meč tako što su ti sve figure blokirane', points: 0, isDefault: true },
  { id: 'ach_078', tier: 'SHAME', icon: '🚪', title: 'Rano zaključavanje', desc: 'Ostani blokiran već u fazi postavljanja figura', points: 0, isDefault: true },
  { id: 'ach_079', tier: 'SHAME', icon: '⏰', title: 'Vrijeme je isteklo', desc: 'Izgubi partiju zbog isteka vremena na satu', points: 0, isDefault: true },
  { id: 'ach_080', tier: 'SHAME', icon: '🤖', title: 'Ponižen od početnika', desc: 'Izgubi partiju protiv Easy AI bota', points: 0, isDefault: true },
  { id: 'ach_081', tier: 'SHAME', icon: '💨', title: 'Prazan džep', desc: 'Završi partiju bez ijednog složenog mlina', points: 0, isDefault: true },
  { id: 'ach_082', tier: 'SHAME', icon: '🪙', title: 'Baksuz na novčiću', desc: 'Promaši ishod bacanja novčića 3 puta zaredom', points: 0, isDefault: true },
  { id: 'ach_083', tier: 'SHAME', icon: '📉', title: 'Hladan tuš', desc: 'Pretrpi 3 uzastopna poraza', points: 0, isDefault: true },
  { id: 'ach_084', tier: 'SHAME', icon: '🌪️', title: 'Crna rupa', desc: 'Pretrpi 5 uzastopnih poraza', points: 0, isDefault: true },
  { id: 'ach_085', tier: 'SHAME', icon: '🪦', title: 'Potpuni debakl', desc: 'Pretrpi poraz u kojem protivnik nije izgubio niti jednu figuru', points: 0, isDefault: true },
  { id: 'ach_086', tier: 'SHAME', icon: '🪓', title: 'Masakr u startu', desc: 'Izgubi 3 figure prije nego uopće završi faza postavljanja', points: 0, isDefault: true },
  { id: 'ach_087', tier: 'SHAME', icon: '🪶', title: 'Kratak let', desc: 'Dosegni fazu leta (3 figure) i izgubi već u idućem potezu', points: 0, isDefault: true },
  { id: 'ach_088', tier: 'SHAME', icon: '🙈', title: 'Poklonjeni mlin', desc: 'Pomakni figuru i omogući protivniku zatvaranje mlina u idućem potezu', points: 0, isDefault: true },
  { id: 'ach_089', tier: 'SHAME', icon: '🧱', title: 'Samozid', desc: 'Sam sebi blokiraj vlastitu figuru vlastitim figurama', points: 0, isDefault: true },
  { id: 'ach_090', tier: 'SHAME', icon: '🐌', title: 'Zaspan na potezu', desc: 'Potroši više od 80% ukupnog vremena u prva 5 poteza', points: 0, isDefault: true },
  { id: 'ach_091', tier: 'SHAME', icon: '💔', title: 'Korak do slavlja', desc: 'Izgubi meč u kojem si imao 2 figure više od protivnika', points: 0, isDefault: true },
  { id: 'ach_092', tier: 'SHAME', icon: '💥', title: 'Ekspresan poraz', desc: 'Izgubi meč u manje od 20 ukupnih poteza', points: 0, isDefault: true },
  { id: 'ach_093', tier: 'SHAME', icon: '🚷', title: 'Paraliza', desc: 'Ostani blokiran sa 5 ili više preostalih figura na ploči', points: 0, isDefault: true },
  { id: 'ach_094', tier: 'SHAME', icon: '🕳️', title: 'Uporni gubitnik', desc: 'Upiši 25 ukupnih poraza u karijeri', points: 0, isDefault: true },
  { id: 'ach_095', tier: 'SHAME', icon: '🗿', title: 'Skamenjen', desc: 'Niti jednom ne pomakni figuru u kutu ploče cijelu partiju', points: 0, isDefault: true },
  { id: 'ach_096', tier: 'SHAME', icon: '🎯', title: 'Promašena prilika', desc: 'Imaj 2 figure u nizu i propusti zatvoriti mlin iako je polje bilo slobodno', points: 0, isDefault: true },
  { id: 'ach_097', tier: 'SHAME', icon: '🎪', title: 'Komedija zabuna', desc: 'Pobijedi novčić, odaberi bijelu i izgubi meč u roku 3 minute', points: 0, isDefault: true },
  { id: 'ach_098', tier: 'SHAME', icon: '🌧️', title: 'Sedam mršavih', desc: 'Niz od 7 mečeva bez ijedne pobjede', points: 0, isDefault: true },
  { id: 'ach_099', tier: 'SHAME', icon: '⚡', title: 'Šah-mat bez šaha', desc: 'Izgubi partiju u kojoj si imao aktivan mlin', points: 0, isDefault: true },
  { id: 'ach_100', tier: 'SHAME', icon: '🏁', title: 'Fenjeraš', desc: 'Završi turnir na posljednjem mjestu', points: 0, isDefault: true }
];

// Pomoćna funkcija koja spaja početnih 100 s custom stvorenim postignućima iz localStoragea
export const getStoredAchievements = () => {
  let customList = [];
  try {
    const rawCustom = localStorage.getItem('mlin_custom_achievements');
    if (rawCustom) {
      const parsed = JSON.parse(rawCustom);
      if (Array.isArray(parsed)) customList = parsed;
    }
  } catch (e) {}

  let catalog = [...INITIAL_ACHIEVEMENTS];
  try {
    const saved = localStorage.getItem('mlin_achievements_catalog');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length >= 100) {
        catalog = parsed;
      }
    }
  } catch (e) {}

  // Spoji custom postignuća na početak tako da nema duplikata
  const existingIds = new Set(catalog.map(a => a.id));
  const missingCustom = customList.filter(c => !existingIds.has(c.id));
  const finalCatalog = [...missingCustom, ...catalog];

  localStorage.setItem('mlin_achievements_catalog', JSON.stringify(finalCatalog));
  return finalCatalog;
};

export const saveStoredAchievements = (achievements) => {
  localStorage.setItem('mlin_achievements_catalog', JSON.stringify(achievements));
};

// Dohvat svih postignuća iz Firebasea + spajanje s lokalno stvorenima
export const fetchAchievementsFromFirebase = async () => {
  const localCatalog = getStoredAchievements();
  try {
    const colRef = collection(db, 'achievements');
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      for (const ach of INITIAL_ACHIEVEMENTS) {
        await setDoc(doc(db, 'achievements', ach.id), ach);
      }
      return localCatalog;
    }

    const firebaseList = [];
    snapshot.forEach(docSnap => {
      firebaseList.push({ id: docSnap.id, ...docSnap.data() });
    });

    // Osiguraj da su i lokalna custom postignuća i svih 100 početnih uvijek prisutni
    const mapById = new Map();
    INITIAL_ACHIEVEMENTS.forEach(a => mapById.set(a.id, a));
    firebaseList.forEach(a => {
      const num = parseInt((a.id || '').replace('ach_', ''), 10);
      const isCustom = a.isCustom || (!isNaN(num) && num > 100);
      mapById.set(a.id, { ...a, isDefault: !isCustom, isCustom });
    });
    localCatalog.forEach(a => {
      if (a.isCustom && !mapById.has(a.id)) {
        mapById.set(a.id, a);
      }
    });

    const merged = Array.from(mapById.values());
    localStorage.setItem('mlin_achievements_catalog', JSON.stringify(merged));
    return merged;
  } catch (error) {
    console.error("Greška pri dohvaćanju s Firebasea, koristim lokalno:", error);
    return localCatalog;
  }
};

// Dodavanje ili uređivanje postignuća na Firebaseu i lokalno
export const saveAchievementToFirebase = async (ach) => {
  try {
    const current = getStoredAchievements();
    const exists = current.some(a => a.id === ach.id);
    const updated = exists ? current.map(a => a.id === ach.id ? ach : a) : [ach, ...current];
    localStorage.setItem('mlin_achievements_catalog', JSON.stringify(updated));
    if (ach.isCustom) {
      const customOnly = updated.filter(a => a.isCustom);
      localStorage.setItem('mlin_custom_achievements', JSON.stringify(customOnly));
    }
    await setDoc(doc(db, 'achievements', ach.id), ach);
  } catch (error) {
    console.error("Greška pri spremanju postignuća na Firebase:", error);
  }
};

// Brisanje postignuća s Firebasea
export const deleteAchievementFromFirebase = async (achId) => {
  try {
    await deleteDoc(doc(db, 'achievements', achId));
  } catch (error) {
    console.error("Greška pri brisanju postignuća s Firebasea:", error);
  }
};

export const getLocalizedAchievement = (ach, lang) => {
  if (lang === 'en') {
    // Ovdje možeš definirati engleske prijevode za standardna postignuća prema njihovom ID-ju
    const translationsEn = {
  'ach_001': { title: 'First Step', desc: 'Play your first Mill match' },
  'ach_002': { title: 'First Mill', desc: 'Form your first mill in career' },
  'ach_003': { title: 'First Triumph', desc: 'Achieve your first victory' },
  'ach_004': { title: 'Piece Slayer', desc: 'Remove your first opponent piece from the board' },
  'ach_005': { title: 'White Power', desc: 'Win playing with white pieces' },
  'ach_006': { title: 'Black Magic', desc: 'Win playing with black pieces' },
  'ach_007': { title: 'Coin Luck', desc: 'Guess the coin toss outcome correctly' },
  'ach_008': { title: 'Local Derby', desc: 'Play a match in local 2-player mode' },
  'ach_009': { title: 'Student & Bot', desc: 'Defeat an Easy AI opponent' },
  'ach_010': { title: 'Rampart Guardian', desc: 'Prevent opponent from closing a mill during placement' },
  'ach_011': { title: 'All Accounted For', desc: 'Finish placement phase without losing a piece' },
  'ach_012': { title: 'First Block', desc: 'Trap an opponent piece so it has nowhere to go' },
  'ach_013': { title: 'Takeoff', desc: 'Reach the flying phase (exactly 3 pieces remaining)' },
  'ach_014': { title: 'The Reopened', desc: 'Open and re-close the same mill in consecutive turns' },
  'ach_015': { title: 'Double Threat', desc: 'Prepare two potential mills in a single move' },

  // 2. TAKTIKA I RAZVOJ (16-35)
  'ach_016': { title: 'Warm-up', desc: 'Achieve a 3-win streak' },
  'ach_017': { title: 'Bot Outsmarted', desc: 'Defeat a Medium AI opponent' },
  'ach_018': { title: 'Siege', desc: 'Win by blocking all opponent pieces' },
  'ach_019': { title: 'Miller', desc: 'Form 3 or more mills in a single match' },
  'ach_020': { title: 'Comeback', desc: 'Win after dropping down to 3 pieces (flying phase)' },
  'ach_021': { title: 'Lightning Move', desc: 'Win a match in under 30 total turns' },
  'ach_022': { title: 'No Mercy', desc: 'Reduce opponent to just 2 pieces before they take 2 of yours' },
  'ach_023': { title: 'Accordion', desc: 'Successfully use the seesaw tactic (opening two mills alternately)' },
  'ach_024': { title: 'Outer Ring', desc: 'Form all 4 possible mills on the outer square during a match' },
  'ach_025': { title: 'Center Node', desc: 'Win while maintaining control over all 4 central connecting fields' },
  'ach_026': { title: 'Quick Fingers', desc: 'Win in a competitive match with a time limit' },
  'ach_027': { title: 'Fortress', desc: 'Win without the opponent forming a single mill' },
  'ach_028': { title: 'Jumper', desc: 'Close a mill by jumping with exactly 3 pieces' },
  'ach_029': { title: 'The Tens', desc: 'Score 10 career victories' },
  'ach_030': { title: 'Early Cut', desc: 'Remove an opponent piece within your first 3 turns' },
  'ach_031': { title: 'Under Pressure', desc: 'Make a move and close a mill in the last 3 seconds of the clock' },
  'ach_032': { title: 'Board Cleaner', desc: 'Take 5 opponent pieces before they take your first' },
  'ach_033': { title: 'Counterattack', desc: 'Close a mill immediately on the turn after your opponent closed theirs' },
  'ach_034': { title: 'Local Champion', desc: 'Play 10 matches in local mode' },
  'ach_035': { title: 'On Fire', desc: 'Achieve a 5-win streak' },

  // 3. NAPREDNO I MAJSTORSTVO (36-55)
  'ach_036': { title: 'Algorithm Breaker', desc: 'Defeat a Hard AI bot' },
  'ach_037': { title: 'Domination', desc: 'Win leaving all 7 or more of your pieces on the board' },
  'ach_038': { title: 'Golden Streak', desc: 'Achieve a 7-win streak' },
  'ach_039': { title: 'Sniper', desc: 'Break your opponent’s crucial developing mill 3 times in a game' },
  'ach_040': { title: 'Trap of the Century', desc: 'Force the opponent into a move that automatically blocks their remaining pieces' },
  'ach_041': { title: 'Second Master', desc: 'Win on time in COMPETITIVE mode' },
  'ach_042': { title: 'Quarter Century', desc: 'Win 25 career games' },
  'ach_043': { title: 'Tournament Debut', desc: 'Play your first official tournament match' },
  'ach_044': { title: 'Tournament Victory', desc: 'Win a tournament match' },
  'ach_045': { title: 'Mill Tornado', desc: 'Form 6 or more mills in a single match' },
  'ach_046': { title: 'Perfect Defense', desc: 'Defeat a Hard AI bot without any of their mills completed' },
  'ach_047': { title: 'Edge of the Abyss', desc: 'Opponent has 6 pieces and you have 3 — and you still win' },
  'ach_048': { title: 'All-Rounder', desc: 'Win at least once in Casual, Competitive, and AI mode' },
  'ach_049': { title: 'Tactical Mind', desc: 'Win exclusively by blocking (without dropping to 2 pieces)' },
  'ach_050': { title: 'Monolith', desc: 'Finish a match with an intact triple mill' },
  'ach_051': { title: 'Inner Courtyard', desc: 'Form a mill on the smallest (inner) square and maintain it for 5 turns' },
  'ach_052': { title: 'Juggler', desc: 'Have 3 different mills active on the board simultaneously' },
  'ach_053': { title: 'Stop Machinery', desc: 'Block the opponent within the first 4 turns of the movement phase' },
  'ach_054': { title: 'Fifty', desc: 'Play 50 total matches' },
  'ach_055': { title: 'Fiery Streak 10', desc: 'Achieve an incredible 10-win streak' },

  // 4. VRHUNSKI STRUČNJAK (56-68)
  'ach_056': { title: 'Machine Tamer', desc: 'Defeat an Expert/Brutal AI bot' },
  'ach_057': { title: 'Tournament Conqueror', desc: 'Finish a tournament as the first-place player' },
  'ach_058': { title: 'Steel Wings', desc: 'Form 3 consecutive mills in the flying phase' },
  'ach_059': { title: 'Centurion', desc: 'Play 100 Mill games in career' },
  'ach_060': { title: 'Absolute Speed', desc: 'Win a Blitz competition without flagging' },
  'ach_061': { title: 'King of Streak 15', desc: 'Achieve 15 consecutive wins in any mode' },
  'ach_062': { title: 'Flawless Match', desc: 'Win without losing a single piece (all 9 remain)' },
  'ach_063': { title: 'Hundred Mills', desc: 'Form a total of 100 mills throughout your career' },
  'ach_064': { title: 'Bot Whisperer', desc: 'Defeat Hard AI 5 times in a row' },
  'ach_065': { title: 'Executioner', desc: 'Remove a total of 250 opponent pieces throughout your career' },
  'ach_066': { title: 'Game Architect', desc: 'Achieve victory by locking the opponent down to exactly 3 fields' },
  'ach_067': { title: 'Half a Thousand', desc: 'Collect 500 points in the scoring system' },
  'ach_068': { title: '50 Wins', desc: 'Achieve 50 career victories' },

  // 5. LEGENDA I ELITA (69-75)
  'ach_069': { title: 'Lord of the Mill', desc: 'Achieve 100 career victories' },
  'ach_070': { title: 'Mythic Streak 20', desc: 'An amazing streak of 20 consecutive wins' },
  'ach_071': { title: 'Point Millionaire', desc: 'Achieve over 1000 ranked points on your profile' },
  'ach_072': { title: 'Cyborg Nightmare', desc: 'Defeat Expert AI 10 times' },
  'ach_073': { title: 'Eternal Player', desc: 'Play 250 matches' },
  'ach_074': { title: 'Perfection', desc: 'Defeat a Hard AI bot with 9 pieces and in under 30 turns' },
  'ach_075': { title: 'Immortal', desc: 'Collect at least 60 different achievements' },

  // 6. NEGATIVNA I UTJEŠNA / SHAME (76-100)
  'ach_076': { title: 'First Bitter Pill', desc: 'Experience your first defeat in the game' },
  'ach_077': { title: 'Dead End', desc: 'Lose a match by having all your pieces blocked' },
  'ach_078': { title: 'Early Lockout', desc: 'Remain blocked already in the piece placement phase' },
  'ach_079': { title: 'Time Out', desc: 'Lose a game due to running out of clock time' },
  'ach_080': { title: 'Humiliated by Rookie', desc: 'Lose a game against an Easy AI bot' },
  'ach_081': { title: 'Empty Pockets', desc: 'Finish a game without a single completed mill' },
  'ach_082': { title: 'Coin Bad Luck', desc: 'Miss the coin toss outcome 3 times in a row' },
  'ach_083': { title: 'Cold Shower', desc: 'Suffer 3 consecutive defeats' },
  'ach_084': { title: 'Black Hole', desc: 'Suffer 5 consecutive defeats' },
  'ach_085': { title: 'Total Debacle', desc: 'Suffer a defeat where the opponent didn’t lose a single piece' },
  'ach_086': { title: 'Start Massacre', desc: 'Lose 3 pieces before the placement phase even ends' },
  'ach_087': { title: 'Short Flight', desc: 'Reach the flying phase (3 pieces) and lose on the very next turn' },
  'ach_088': { title: 'Gifted Mill', desc: 'Move a piece and allow the opponent to close a mill on the next turn' },
  'ach_089': { title: 'Self-Wall', desc: 'Block your own piece with your own pieces' },
  'ach_090': { title: 'Asleep on Turn', desc: 'Spend over 80% of total time within the first 5 turns' },
  'ach_091': { title: 'Step from Glory', desc: 'Lose a match where you had 2 more pieces than the opponent' },
  'ach_092': { title: 'Express Defeat', desc: 'Lose a match in under 20 total turns' },
  'ach_093': { title: 'Paralysis', desc: 'Stay blocked with 5 or more remaining pieces on the board' },
  'ach_094': { title: 'Persistent Loser', desc: 'Rack up 25 total career defeats' },
  'ach_095': { title: 'Petrified', desc: 'Never move a piece in the corner of the board the entire game' },
  'ach_096': { title: 'Missed Opportunity', desc: 'Have 2 pieces in a row and fail to close a mill even though the field was free' },
  'ach_097': { title: 'Comedy of Errors', desc: 'Win the coin toss, choose white, and lose the match within 3 minutes' },
  'ach_098': { title: 'Seven Lean Years', desc: 'A streak of 7 matches without a single win' },
  'ach_099': { title: 'Checkmate Without Chess', desc: 'Lose a game in which you had an active mill' },
  'ach_100': { title: 'Lantern Carrier', desc: 'Finish a tournament in last place' }
};
    if (translationsEn[ach.id]) {
      return { ...ach, title: translationsEn[ach.id].title, desc: translationsEn[ach.id].desc };
    }
  }
  return ach;
};