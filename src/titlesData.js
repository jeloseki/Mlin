// src/titlesData.js

export const PLAYER_TITLES = [
  { minNet: 0, hr: 'Početnik', en: 'Rookie' },
  { minNet: 3, hr: 'Učenik Mlina', en: 'Mill Apprentice' },
  { minNet: 7, hr: 'Pripravnik', en: 'Trainee' },
  { minNet: 12, hr: 'Izazivač', en: 'Challenger' },
  { minNet: 18, hr: 'Taktičar', en: 'Tactician' },
  { minNet: 25, hr: 'Strateg', en: 'Strategist' },
  { minNet: 33, hr: 'Brat u Mlinu', en: 'Brotherhood Member' },
  { minNet: 42, hr: 'Vitez Ploče', en: 'Knight of the Board' },
  { minNet: 52, hr: 'Kovač Taktika', en: 'Tactics Smith' },
  { minNet: 63, hr: 'Gospodar Mlina', en: 'Mill Lord' },
  { minNet: 75, hr: 'Veteran', en: 'Veteran' },
  { minNet: 88, hr: 'Iskusni Ratnik', en: 'Seasoned Warrior' },
  { minNet: 102, hr: 'Čuvar Pravila', en: 'Rule Guardian' },
  { minNet: 117, hr: 'Lovac na Mlinove', en: 'Mill Hunter' },
  { minNet: 133, hr: 'Nemilosrdni', en: 'Relentless' },
  { minNet: 150, hr: 'Šampion Arene', en: 'Arena Champion' },
  { minNet: 168, hr: 'Majstor Taktike', en: 'Master of Tactics' },
  { minNet: 187, hr: 'Veliki Majstor', en: 'Grandmaster' },
  { minNet: 207, hr: 'Nepobjedivi', en: 'Undefeated Spirit' },
  { minNet: 228, hr: 'Legenda Mlina', en: 'Legend of the Mill' },
  { minNet: 250, hr: 'Mitološki Igrač', en: 'Mythic Player' },
  { minNet: 273, hr: 'Božanstvo Strategije', en: 'Deity of Strategy' },
  { minNet: 297, hr: 'Besmrtni', en: 'Immortal' },
  { minNet: 322, hr: 'Božji Prst', en: 'God\'s Finger' },
  { minNet: 350, hr: 'Vrhovni Vladar Mlina', en: 'Supreme Mill Overlord' }
];

// Pomoćna funkcija koja računa titulu na temelju pobjeda i poraza
export const getPlayerTitle = (wins = 0, losses = 0, lang = 'hr') => {
  const netScore = Math.max(0, wins - losses);
  let matchedTitle = PLAYER_TITLES[0];

  for (let t of PLAYER_TITLES) {
    if (netScore >= t.minNet) {
      matchedTitle = t;
    } else {
      break;
    }
  }

  return lang === 'hr' ? matchedTitle.hr : matchedTitle.en;
};

export const getPlayerTitleTierClass = (wins = 0, losses = 0) => {
  const netScore = Math.max(0, wins - losses);
  let tierIndex = 0;

  for (let i = 0; i < PLAYER_TITLES.length; i++) {
    if (netScore >= PLAYER_TITLES[i].minNet) {
      tierIndex = i;
    } else {
      break;
    }
  }

  return `title-tier-${tierIndex + 1}`;
};
