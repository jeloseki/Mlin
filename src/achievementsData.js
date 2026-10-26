// src/achievementsData.js

export const ACHIEVEMENT_TIERS = {
  BRONZE: { label: 'Bronca', color: '#cd7f32', bg: 'rgba(205, 127, 50, 0.15)', border: '#cd7f32' },
  SILVER: { label: 'Srebro', color: '#cbd5e1', bg: 'rgba(203, 213, 225, 0.15)', border: '#94a3b8' },
  GOLD: { label: 'Zlato', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)', border: '#f59e0b' },
  PLATINUM: { label: 'Platina', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', border: '#0ea5e9' },
  LEGENDARY: { label: 'Legenda', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)', border: '#db2777' },
  SHAME: { label: 'Gaf / Peh', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: '#dc2626' }
};

export const INITIAL_ACHIEVEMENTS = [
  // ==========================================
  // 1. POČETAK I OSNOVE (Bronca - Pozitivna: 1-15)
  // ==========================================
  { id: 'ach_001', tier: 'BRONZE', icon: '🌱', title: 'Prvi korak', desc: 'Odigraj svoju prvu partiju Mlina', points: 5 },
  { id: 'ach_002', tier: 'BRONZE', icon: '🎯', title: 'Prvi Mlin', desc: 'Složi svoj prvi mlin u karijeri', points: 5 },
  { id: 'ach_003', tier: 'BRONZE', icon: '🏆', title: 'Prvi Trijumf', desc: 'Ostvari svoju prvu pobjedu', points: 10 },
  { id: 'ach_004', tier: 'BRONZE', icon: '⚔️', title: 'Ubojica figura', desc: 'Ukloni prvu protivničku figuru s ploče', points: 5 },
  { id: 'ach_005', tier: 'BRONZE', icon: '⚪', title: 'Bijela snaga', desc: 'Pobijedi igrajući s bijelim figurama', points: 10 },
  { id: 'ach_006', tier: 'BRONZE', icon: '⚫', title: 'Crna magija', desc: 'Pobijedi igrajući s crnim figurama', points: 10 },
  { id: 'ach_007', tier: 'BRONZE', icon: '🪙', title: 'Sreća na novčiću', desc: 'Pogodi ishod bacanja novčića', points: 5 },
  { id: 'ach_008', tier: 'BRONZE', icon: '🤝', title: 'Lokalni derbi', desc: 'Odigraj meč u lokalnom načinu za dva igrača', points: 5 },
  { id: 'ach_009', tier: 'BRONZE', icon: '🤖', title: 'Učenik i bot', desc: 'Pobijedi Laganog (Easy) AI protivnika', points: 10 },
  { id: 'ach_010', tier: 'BRONZE', icon: '🛡️', title: 'Čuvar bedema', desc: 'Spriječi protivnika da zatvori mlin u postavljanju', points: 10 },
  { id: 'ach_011', tier: 'BRONZE', icon: '📦', title: 'Sve na broju', desc: 'Završi fazu postavljanja bez izgubljene figure', points: 10 },
  { id: 'ach_012', tier: 'BRONZE', icon: '🪨', title: 'Prva blokada', desc: 'Zatvori protivničku figuru tako da nema kamo', points: 10 },
  { id: 'ach_013', tier: 'BRONZE', icon: '🕊️', title: 'Poletanje', desc: 'Dosegni fazu letenja (preostale točno 3 figure)', points: 10 },
  { id: 'ach_014', tier: 'BRONZE', icon: '🔄', title: 'Vraćalica', desc: 'Otvori i ponovno zatvori isti mlin u uzastopnim potezima', points: 10 },
  { id: 'ach_015', tier: 'BRONZE', icon: '⚡', title: 'Dvostruka prijetnja', desc: 'Pripremi dva potencijalna mlina u istom potezu', points: 10 },

  // ==========================================
  // 2. TAKTIKA I RAZVOJ (Srebro - Pozitivna: 16-35)
  // ==========================================
  { id: 'ach_016', tier: 'SILVER', icon: '🔥', title: 'Zagrijavanje', desc: 'Ostvari 3 pobjede u nizu', points: 20 },
  { id: 'ach_017', tier: 'SILVER', icon: '🧠', title: 'Nadmudren bot', desc: 'Pobijedi Srednjeg (Medium) AI protivnika', points: 25 },
  { id: 'ach_018', tier: 'SILVER', icon: '🏰', title: 'Opsada', desc: 'Pobijedi protivnika blokiranjem svih njegovih figura', points: 30 },
  { id: 'ach_019', tier: 'SILVER', icon: '🏭', title: 'Mlinar', desc: 'Složi 3 ili više mlinova u istoj partiji', points: 20 },
  { id: 'ach_020', tier: 'SILVER', icon: '🦅', title: 'Povratak iz mrtvih', desc: 'Pobijedi nakon što si spao na 3 figure (faza leta)', points: 30 },
  { id: 'ach_021', tier: 'SILVER', icon: '⏱️', title: 'Munjevit potez', desc: 'Odigraj pobjednički meč u manje od 30 ukupnih poteza', points: 25 },
  { id: 'ach_022', tier: 'SILVER', icon: '🥇', title: 'Bez milosti', desc: 'Sruši protivnika na samo 2 figure prije nego on tebi uzme 2', points: 25 },
  { id: 'ach_023', tier: 'SILVER', icon: '🧩', title: 'Harmonika', desc: 'Uspješno koristi klackalicu (otvaranje dva mlina naizmjence)', points: 25 },
  { id: 'ach_024', tier: 'SILVER', icon: '📐', title: 'Vanjski prsten', desc: 'Složi sva 4 moguća mlina na vanjskom kvadratu kroz meč', points: 25 },
  { id: 'ach_025', tier: 'SILVER', icon: '🎯', title: 'Središnji čvor', desc: 'Pobijedi držeći kontrolu nad sva 4 središnja vezna polja', points: 25 },
  { id: 'ach_026', tier: 'SILVER', icon: '🥋', title: 'Brzi prsti', desc: 'Pobijedi u natjecateljskom meču s vremenskim ograničenjem', points: 25 },
  { id: 'ach_027', tier: 'SILVER', icon: '🛡️', title: 'Tvrđava', desc: 'Pobijedi bez da protivnik složi ijedan mlin', points: 35 },
  { id: 'ach_028', tier: 'SILVER', icon: '🥈', title: 'Skakač', desc: 'Zatvori mlin skokom s točno 3 figure', points: 20 },
  { id: 'ach_029', tier: 'SILVER', icon: '📈', title: 'Desetka', desc: 'Upiši 10 ukupnih pobjeda u karijeri', points: 25 },
  { id: 'ach_030', tier: 'SILVER', icon: '🎖️', title: 'Rani rez', desc: 'Ukloni protivničku figuru već u prva 3 svoja poteza', points: 20 },
  { id: 'ach_031', tier: 'SILVER', icon: '⏳', title: 'Pod pritiskom', desc: 'Napravi potez i složi mlin u zadnje 3 sekunde sata', points: 25 },
  { id: 'ach_032', tier: 'SILVER', icon: '🧹', title: 'Čistač ploče', desc: 'Uzmi protivniku 5 figura prije nego on uzme tvoju prvu', points: 30 },
  { id: 'ach_033', tier: 'SILVER', icon: '🥊', title: 'Uzvratni udarac', desc: 'Složi mlin odmah u potezu nakon što je protivnik složio svoj', points: 20 },
  { id: 'ach_034', tier: 'SILVER', icon: '🌐', title: 'Lokalni šampion', desc: 'Odigraj 10 mečeva u lokalnom modu', points: 20 },
  { id: 'ach_035', tier: 'SILVER', icon: '🔥', title: 'U plamenu', desc: 'Ostvari 5 pobjeda u nizu', points: 35 },

  // ==========================================
  // 3. NAPREDNO I MAJSTORSTVO (Zlato - Pozitivna: 36-55)
  // ==========================================
  { id: 'ach_036', tier: 'GOLD', icon: '🤖', title: 'Rušitelj algoritma', desc: 'Pobijedi Teškog (Hard) AI bota', points: 50 },
  { id: 'ach_037', tier: 'GOLD', icon: '👑', title: 'Dominacija', desc: 'Pobijedi ostavivši svih 7 ili više svojih figura na ploči', points: 50 },
  { id: 'ach_038', tier: 'GOLD', icon: '🏆', title: 'Zlatni niz', desc: 'Ostvari 7 pobjeda u nizu', points: 50 },
  { id: 'ach_039', tier: 'GOLD', icon: '🏹', title: 'Snajperist', desc: 'Razbij protivnički ključni mlin u nastajanju 3 puta u partiji', points: 40 },
  { id: 'ach_040', tier: 'GOLD', icon: '🪤', title: 'Zamka stoljeća', desc: 'Prisili protivnika na potez koji mu automatski blokira preostale figure', points: 45 },
  { id: 'ach_041', tier: 'GOLD', icon: '⏱️', title: 'Gospodar sekundi', desc: 'Pobijedi na vrijeme u COMPETITIVE modu', points: 40 },
  { id: 'ach_042', tier: 'GOLD', icon: '🎖️', title: 'Četvrt stoljeća', desc: 'Pobijedi u 25 partija u karijeri', points: 50 },
  { id: 'ach_043', tier: 'GOLD', icon: '🏟️', title: 'Turnirski debi', desc: 'Odigraj svoj prvi službeni turnirski meč', points: 40 },
  { id: 'ach_044', tier: 'GOLD', icon: '🥇', title: 'Turnirska pobjeda', desc: 'Pobijedi u turnirskom meču', points: 50 },
  { id: 'ach_045', tier: 'GOLD', icon: '🌪️', title: 'Tornado mlinova', desc: 'Složi 6 ili više mlinova u jednom jedinom meču', points: 50 },
  { id: 'ach_046', tier: 'GOLD', icon: '💎', title: 'Savršena obrana', desc: 'Pobijedi Teškog AI bota bez ijednog njegovog složenog mlina', points: 60 },
  { id: 'ach_047', tier: 'GOLD', icon: '🧗', title: 'Povratak s ruba ponora', desc: 'Protivnik ima 6 figura a ti 3 — i svejedno pobjeđuješ', points: 60 },
  { id: 'ach_048', tier: 'GOLD', icon: '🎛️', title: 'Univerzalac', desc: 'Pobijedi barem po jednom u Casual, Competitive i AI modu', points: 45 },
  { id: 'ach_049', tier: 'GOLD', icon: '⚙️', title: 'Taktički um', desc: 'Pobijedi isključivo blokadom (bez spuštanja na 2 figure)', points: 50 },
  { id: 'ach_050', tier: 'GOLD', icon: '♟️', title: 'Monolit', desc: 'Završi partiju s netaknutim trostrukim mlinom', points: 45 },
  { id: 'ach_051', tier: 'GOLD', icon: '🏰', title: 'Unutarnje dvorište', desc: 'Složi mlin na najmanjem (unutarnjem) kvadratu i održi ga 5 poteza', points: 40 },
  { id: 'ach_052', tier: 'GOLD', icon: '🎪', title: 'Žongler', desc: 'Imaj istovremeno aktivna 3 različita mlina na ploči', points: 60 },
  { id: 'ach_053', tier: 'GOLD', icon: '🛑', title: 'Stop mašinerija', desc: 'Blokiraj protivnika u prva 4 poteza faze pomicanja', points: 50 },
  { id: 'ach_054', tier: 'GOLD', icon: '🏅', title: 'Pedesetica', desc: 'Odigraj 50 ukupnih mečeva', points: 50 },
  { id: 'ach_055', tier: 'GOLD', icon: '🔥', title: 'Vatreni niz 10', desc: 'Ostvari nevjerojatnih 10 pobjeda u nizu', points: 70 },

  // ==========================================
  // 4. VRHUNSKI STRUČNJAK (Platina - Pozitivna: 56-68)
  // ==========================================
  { id: 'ach_056', tier: 'PLATINUM', icon: '🤖', title: 'Majstor protiv stroja', desc: 'Pobijedi Ekspertnog (Expert/Brutal) AI bota', points: 100 },
  { id: 'ach_057', tier: 'PLATINUM', icon: '🏆', title: 'Osvajač turnira', desc: 'Završi turnir kao prvoplasirani igrač', points: 120 },
  { id: 'ach_058', tier: 'PLATINUM', icon: '🦅', title: 'Čelična krila', desc: 'U fazi letenja složi 3 mlina zaredom', points: 90 },
  { id: 'ach_059', tier: 'PLATINUM', icon: '💯', title: 'Stotka', desc: 'Odigraj 100 partija Mlina u karijeri', points: 100 },
  { id: 'ach_060', tier: 'PLATINUM', icon: '⚡', title: 'Apsolutna brzina', desc: 'Pobijedi u Blitz natjecanju bez pada zastavice', points: 90 },
  { id: 'ach_061', tier: 'PLATINUM', icon: '👑', title: 'Kralj niza 15', desc: 'Ostvari 15 pobjeda zaredom u bilo kojem modu', points: 120 },
  { id: 'ach_062', tier: 'PLATINUM', icon: '🛡️', title: 'Besprijekorna partija', desc: 'Pobijedi bez gubitka ijedne svoje figure (svih 9 ostaje)', points: 150 },
  { id: 'ach_063', tier: 'PLATINUM', icon: '🎯', title: 'Stotinu mlinova', desc: 'Složi ukupno 100 mlinova kroz karijeru', points: 100 },
  { id: 'ach_064', tier: 'PLATINUM', icon: '🦾', title: 'Krotitelj bota', desc: 'Pobijedi Hard AI 5 puta zaredom', points: 110 },
  { id: 'ach_065', tier: 'PLATINUM', icon: '⚔️', title: 'Krvnik', desc: 'Ukloni ukupno 250 protivničkih figura kroz karijeru', points: 100 },
  { id: 'ach_066', tier: 'PLATINUM', icon: '🏛️', title: 'Arhitekt igre', desc: 'Ostvari pobjedu zatvaranjem protivnika na točno 3 polja', points: 90 },
  { id: 'ach_067', tier: 'PLATINUM', icon: '🌟', title: 'Pola tisuće', desc: 'Skupi 500 bodova u sustavu bodovanja', points: 100 },
  { id: 'ach_068', tier: 'PLATINUM', icon: '🏆', title: '50 Pobjeda', desc: 'Ostvari 50 pobjeda u karijeri', points: 120 },

  // ==========================================
  // 5. LEGENDA I ELITA (Legenda - Pozitivna: 69-75)
  // ==========================================
  { id: 'ach_069', tier: 'LEGENDARY', icon: '👑', title: 'Gospodar Mlina', desc: 'Ostvari 100 pobjeda u karijeri', points: 250 },
  { id: 'ach_070', tier: 'LEGENDARY', icon: '🔥', title: 'Mitski niz 20', desc: 'Nevjerojatan niz od 20 uzastopnih pobjeda', points: 300 },
  { id: 'ach_071', tier: 'LEGENDARY', icon: '💎', title: 'Milijunaš bodova', desc: 'Ostvari preko 1000 rangiranih bodova na profilu', points: 250 },
  { id: 'ach_072', tier: 'LEGENDARY', icon: '🤖', title: 'Kiborg noćna mora', desc: 'Pobijedi Expert AI 10 puta', points: 200 },
  { id: 'ach_073', tier: 'LEGENDARY', icon: '📜', title: 'Vječni igrač', desc: 'Odigraj 250 mečeva', points: 200 },
  { id: 'ach_074', tier: 'LEGENDARY', icon: '✨', title: 'Savršenstvo', desc: 'Pobijedi Teškog AI bota s 9 figura i u manje od 30 poteza', points: 300 },
  { id: 'ach_075', tier: 'LEGENDARY', icon: '🌌', title: 'Besmrtnik', desc: 'Sakupi barem 60 različitih postignuća', points: 350 },

  // ==========================================
  // 6. NEGATIVNA I UTJEŠNA (Peh / Gaf / Shame: 76-100)
  // ==========================================
  { id: 'ach_076', tier: 'SHAME', icon: '🩹', title: 'Prva gorka pilula', desc: 'Doživi svoj prvi poraz u igri', points: 0 },
  { id: 'ach_077', tier: 'SHAME', icon: '🧊', title: 'Slijepa ulica', desc: 'Izgubi meč tako što su ti sve figure blokirane', points: 0 },
  { id: 'ach_078', tier: 'SHAME', icon: '🚪', title: 'Rano zaključavanje', desc: 'Ostani blokiran već u fazi postavljanja figura', points: 0 },
  { id: 'ach_079', tier: 'SHAME', icon: '⏰', title: 'Vrijeme je isteklo', desc: 'Izgubi partiju zbog isteka vremena na satu', points: 0 },
  { id: 'ach_080', tier: 'SHAME', icon: '🤖', title: 'Ponižen od početnika', desc: 'Izgubi partiju protiv Easy AI bota', points: 0 },
  { id: 'ach_081', tier: 'SHAME', icon: '💨', title: 'Prazan džep', desc: 'Završi partiju bez ijednog složenog mlina', points: 0 },
  { id: 'ach_082', tier: 'SHAME', icon: '🪙', title: 'Baksuz na novčiću', desc: 'Promaši ishod bacanja novčića 3 puta zaredom', points: 0 },
  { id: 'ach_083', tier: 'SHAME', icon: '📉', title: 'Hladan tuš', desc: 'Pretrpi 3 uzastopna poraza', points: 0 },
  { id: 'ach_084', tier: 'SHAME', icon: '🌪️', title: 'Crna rupa', desc: 'Pretrpi 5 uzastopnih poraza', points: 0 },
  { id: 'ach_085', tier: 'SHAME', icon: '🪦', title: 'Potpuni debakl', desc: 'Pretrpi poraz u kojem protivnik nije izgubio niti jednu figuru', points: 0 },
  { id: 'ach_086', tier: 'SHAME', icon: '🪓', title: 'Masakr u startu', desc: 'Izgubi 3 figure prije nego uopće završi faza postavljanja', points: 0 },
  { id: 'ach_087', tier: 'SHAME', icon: '🪶', title: 'Kratak let', desc: 'Dosegni fazu leta (3 figure) i izgubi već u idućem potezu', points: 0 },
  { id: 'ach_088', tier: 'SHAME', icon: '🙈', title: 'Poklonjeni mlin', desc: 'Pomakni figuru i omogući protivniku zatvaranje mlina u idućem potezu', points: 0 },
  { id: 'ach_089', tier: 'SHAME', icon: '🧱', title: 'Samozid', desc: 'Sam sebi blokiraj vlastitu figuru vlastitim figurama', points: 0 },
  { id: 'ach_090', tier: 'SHAME', icon: '🐌', title: 'Zaspan na potezu', desc: 'Potroši više od 80% ukupnog vremena u prva 5 poteza', points: 0 },
  { id: 'ach_091', tier: 'SHAME', icon: '💔', title: 'Korak do slavlja', desc: 'Izgubi meč u kojem si imao 2 figure više od protivnika', points: 0 },
  { id: 'ach_092', tier: 'SHAME', icon: '💥', title: 'Ekspresan poraz', desc: 'Izgubi meč u manje od 20 ukupnih poteza', points: 0 },
  { id: 'ach_093', tier: 'SHAME', icon: '🚷', title: 'Paraliza', desc: 'Ostani blokiran sa 5 ili više preostalih figura na ploči', points: 0 },
  { id: 'ach_094', tier: 'SHAME', icon: '🕳️', title: 'Uporni gubitnik', desc: 'Upiši 25 ukupnih poraza u karijeri', points: 0 },
  { id: 'ach_095', tier: 'SHAME', icon: '🗿', title: 'Skamenjen', desc: 'Niti jednom ne pomakni figuru u kutu ploče cijelu partiju', points: 0 },
  { id: 'ach_096', tier: 'SHAME', icon: '🎯', title: 'Promašena prilika', desc: 'Imaj 2 figure u nizu i propusti zatvoriti mlin iako je polje bilo slobodno', points: 0 },
  { id: 'ach_097', tier: 'SHAME', icon: '🎪', title: 'Komedija zabuna', desc: 'Pobijedi novčić, odaberi bijelu i izgubi meč u roku 3 minute', points: 0 },
  { id: 'ach_098', tier: 'SHAME', icon: '🌧️', title: 'Sedam mršavih', desc: 'Niz od 7 mečeva bez ijedne pobjede', points: 0 },
  { id: 'ach_099', tier: 'SHAME', icon: '⚡', title: 'Šah-mat bez šaha', desc: 'Izgubi partiju u kojoj si imao aktivan mlin', points: 0 },
  { id: 'ach_100', tier: 'SHAME', icon: '🏁', title: 'Fenjeraš', desc: 'Završi turnir na posljednjem mjestu', points: 0 }
];

// Pomoćna funkcija za dohvat kataloga iz localStorage
export const getStoredAchievements = () => {
  const saved = localStorage.getItem('mlin_achievements_catalog');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Ako u memoriji ima manje od 100 (stara verzija), ažuriraj na novih 100
      if (Array.isArray(parsed) && parsed.length >= 100) {
        return parsed;
      }
    } catch (e) {
      console.error('Greška pri čitanju kataloga postignuća:', e);
    }
  }
  localStorage.setItem('mlin_achievements_catalog', JSON.stringify(INITIAL_ACHIEVEMENTS));
  return INITIAL_ACHIEVEMENTS;
};

export const saveStoredAchievements = (achievements) => {
  localStorage.setItem('mlin_achievements_catalog', JSON.stringify(achievements));
};

import { db } from './firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

// Dohvat svih postignuća iz Firebasea (ili seed prvih 100 ako je baza prazna)
export const fetchAchievementsFromFirebase = async () => {
  try {
    const colRef = collection(db, 'achievements');
    const snapshot = await getDocs(colRef);
    
    if (snapshot.empty) {
      // Baza je još prazna — automatski prebaci naših 100 postignuća u Firebase
      for (const ach of INITIAL_ACHIEVEMENTS) {
        await setDoc(doc(db, 'achievements', ach.id), ach);
      }
      return INITIAL_ACHIEVEMENTS;
    }

    const list = [];
    snapshot.forEach(docSnap => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });
    return list;
  } catch (error) {
    console.error("Greška pri dohvaćanju s Firebasea, koristim lokalno:", error);
    return getStoredAchievements();
  }
};

// Dodavanje ili uređivanje postignuća na Firebaseu
export const saveAchievementToFirebase = async (ach) => {
  try {
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