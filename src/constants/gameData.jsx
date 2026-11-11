// ==========================================================
// 1. SYSTEM OF 100 ANIMAL RANKS (Progression System)
// ==========================================================
export const ANIMAL_RANKS = [
  // 1-10: Insekti i sitni organizmi
  { id: 1, name: 'Ameba', minRating: 0, icon: '🦠' },
  { id: 2, name: 'Plankton', minRating: 50, icon: '🪼' },
  { id: 3, name: 'Gusjenica', minRating: 100, icon: '🐛' },
  { id: 4, name: 'Komarac', minRating: 150, icon: '🦟' },
  { id: 5, name: 'Muha', minRating: 200, icon: '🪰' },
  { id: 6, name: 'Mrav', minRating: 250, icon: '🐜' },
  { id: 7, name: 'Bee', minRating: 300, icon: '🐝' },
  { id: 8, name: 'Pauk', minRating: 350, icon: '🕷️' },
  { id: 9, name: 'Scorpion', minRating: 400, icon: '🦂' },
  { id: 10, name: 'Stoga', minRating: 450, icon: '🪲' },

  // 11-20: Vodozemci, gmazovi i sitni glodavci
  { id: 11, name: 'Snail', minRating: 500, icon: '🐌' },
  { id: 12, name: 'Earthworm', minRating: 550, icon: '🪱' },
  { id: 13, name: 'Toad', minRating: 600, icon: '🐸' },
  { id: 14, name: 'Lizard', minRating: 650, icon: '🦎' },
  { id: 15, name: 'Wall Lizard', minRating: 700, icon: '🦎' },
  { id: 16, name: 'Mouse', minRating: 750, icon: '🖱️' },
  { id: 17, name: 'Rat', minRating: 800, icon: '🐀' },
  { id: 18, name: 'Hamster', minRating: 850, icon: '🐹' },
  { id: 19, name: 'Krtica', minRating: 900, icon: '🦦' },
  { id: 20, name: 'Vjeverica', minRating: 950, icon: '🐿️' },

  // 21-30: Ptice i sitni lovci
  { id: 21, name: 'Hedgehog', minRating: 1000, icon: '🦔' },
  { id: 22, name: 'Zec', minRating: 1050, icon: '🐇' },
  { id: 23, name: 'Bat', minRating: 1100, icon: '🦇' },
  { id: 24, name: 'Vrabac', minRating: 1150, icon: '🐦' },
  { id: 25, name: 'Golub', minRating: 1200, icon: '🕊️' },
  { id: 26, name: 'Sraka', minRating: 1250, icon: '🦤' },
  { id: 27, name: 'Vrana', minRating: 1300, icon: '🐦‍⬛' },
  { id: 28, name: 'Sova', minRating: 1350, icon: '🦉' },
  { id: 29, name: 'Tvor', minRating: 1400, icon: '🦨' },
  { id: 30, name: 'Lasica', minRating: 1450, icon: '🦦' },

  // 31-40: Mid predators and domestic animals
  { id: 31, name: 'Dabar', minRating: 1500, icon: '🦫' },
  { id: 32, name: 'Vidra', minRating: 1550, icon: '🦦' },
  { id: 33, name: 'Jazavac', minRating: 1600, icon: '🦡' },
  { id: 34, name: 'Wild Cat', minRating: 1650, icon: '🐈' },
  { id: 35, name: 'Pas', minRating: 1700, icon: '🐕' },
  { id: 36, name: 'Lisica', minRating: 1750, icon: '🦊' },
  { id: 37, name: 'Jackal', minRating: 1800, icon: '🐺' },
  { id: 38, name: 'Kojot', minRating: 1850, icon: '🐺' },
  { id: 39, name: 'Dingo', minRating: 1900, icon: '🐕' },
  { id: 40, name: 'Ris', minRating: 1950, icon: '🐆' },

  // 41-50: Fast predators and snakes
  { id: 41, name: 'Srna', minRating: 2000, icon: '🦌' },
  { id: 42, name: 'Ovan', minRating: 2050, icon: '🐏' },
  { id: 43, name: 'Divlja svinja', minRating: 2100, icon: '🐗' },
  { id: 44, name: 'Kameleon', minRating: 2150, icon: '🦎' },
  { id: 45, name: 'Iguana', minRating: 2200, icon: '🦎' },
  { id: 46, name: 'Kobra', minRating: 2250, icon: '🐍' },
  { id: 47, name: 'Rattlesnake', minRating: 2300, icon: '🐍' },
  { id: 48, name: 'Piton', minRating: 2350, icon: '🐍' },
  { id: 49, name: 'Pelikan', minRating: 2400, icon: '🦤' },
  { id: 50, name: 'Pingvin', minRating: 2450, icon: '🐧' },

  // 51-60: Birds of prey and wild herbivores
  { id: 51, name: 'Jastreb', minRating: 2500, icon: '🦅' },
  { id: 52, name: 'Sokol', minRating: 2550, icon: '🦅' },
  { id: 53, name: 'Orao', minRating: 2600, icon: '🦅' },
  { id: 54, name: 'Kondor', minRating: 2650, icon: '🦅' },
  { id: 55, name: 'Klokan', minRating: 2700, icon: '🦘' },
  { id: 56, name: 'Zebra', minRating: 2750, icon: '🦓' },
  { id: 57, name: 'Antilopa', minRating: 2800, icon: '🦌' },
  { id: 58, name: 'Sob', minRating: 2850, icon: '🫎' },
  { id: 59, name: 'Jelen', minRating: 2900, icon: '🦌' },
  { id: 60, name: 'Giraffe', minRating: 2950, icon: '🦒' },

  // 61-70: Veliki primati i opasni divlji lovci
  { id: 61, name: 'Lemurom', minRating: 3000, icon: '🐒' },
  { id: 62, name: 'Chimpanzee', minRating: 3050, icon: '🐒' },
  { id: 63, name: 'Orangutan', minRating: 3100, icon: '🦧' },
  { id: 64, name: 'Gorila', minRating: 3150, icon: '🦍' },
  { id: 65, name: 'Hijena', minRating: 3200, icon: '🐺' },
  { id: 66, name: 'Vuk', minRating: 3250, icon: '🐺' },
  { id: 67, name: 'Gepard', minRating: 3300, icon: '🐆' },
  { id: 68, name: 'Pantera', minRating: 3350, icon: '🐆' },
  { id: 69, name: 'Leopard', minRating: 3400, icon: '🐆' },
  { id: 70, name: 'Puma', minRating: 3450, icon: '🦁' },

  // 71-80: Top kopneni predatori i divovi
  { id: 71, name: 'Tigar', minRating: 3500, icon: '🐅' },
  { id: 72, name: 'Lav', minRating: 3550, icon: '🦁' },
  { id: 73, name: 'Brown Bear', minRating: 3600, icon: '🐻' },
  { id: 74, name: 'Grizli', minRating: 3650, icon: '🐻‍❄️' },
  { id: 75, name: 'Polarni medvjed', minRating: 3700, icon: '🧊' },
  { id: 76, name: 'Anakonda', minRating: 3750, icon: '🐍' },
  { id: 77, name: 'Komodo zmaj', minRating: 3800, icon: '🐊' },
  { id: 78, name: 'Krokodil', minRating: 3850, icon: '🐊' },
  { id: 79, name: 'Bizon', minRating: 3900, icon: '🦬' },
  { id: 80, name: 'Nilski konj', minRating: 3950, icon: '🦛' },

  // 81-90: Heavy land giants and sea monsters
  { id: 81, name: 'Nosorog', minRating: 4000, icon: '🦏' },
  { id: 82, name: 'Slon', minRating: 4050, icon: '🐘' },
  { id: 83, name: 'Delfin', minRating: 4100, icon: '🐬' },
  { id: 84, name: 'Manta Ray', minRating: 4150, icon: '🪼' },
  { id: 85, name: 'Morski pas', minRating: 4200, icon: '🦈' },
  { id: 86, name: 'Megalodon', minRating: 4250, icon: '🦈' },
  { id: 87, name: 'Kit ubojica', minRating: 4300, icon: '🐋' },
  { id: 88, name: 'Plavi kit', minRating: 4350, icon: '🐳' },
  { id: 89, name: 'Divovska lignja', minRating: 4400, icon: '🦑' },
  { id: 90, name: 'Mamut', minRating: 4450, icon: '🦣' },

  // 91-100: Prehistoric, mythic and divine creatures
  { id: 91, name: 'Pterodaktil', minRating: 4500, icon: '🦅' },
  { id: 92, name: 'Velociraptor', minRating: 4550, icon: '🦖' },
  { id: 93, name: 'T-Rex', minRating: 4600, icon: '🦖' },
  { id: 94, name: 'Spinosaur', minRating: 4650, icon: '🐊' },
  { id: 95, name: 'Hidra', minRating: 4700, icon: '🐉' },
  { id: 96, name: 'Grifon', minRating: 4750, icon: '🦅' },
  { id: 97, name: 'Kraken', minRating: 4800, icon: '🐙' },
  { id: 98, name: 'Feniks', minRating: 4850, icon: '🔥' },
  { id: 99, name: 'Zmaj', minRating: 4900, icon: '🐉' },
  { id: 100, name: 'Apex Cosmic Dragon', minRating: 5000, icon: '👑' }
];

// ==========================================================
// 2. THEMATIC BOARDS (1 Classic + 8 Unlockable)
// ==========================================================
export const BOARDS = [
  { id: 'classic', name: 'Classic Wooden Mlin', unlockWins: 0, themeClass: 'theme-classic' },
  { id: 'forest', name: 'Forest Nest (Fox)', unlockWins: 5, themeClass: 'theme-forest' },
  { id: 'savannah', name: 'Savannah (Lion)', unlockWins: 15, themeClass: 'theme-savannah' },
  { id: 'arctic', name: 'Arctic Ice (Polar Bear)', unlockWins: 30, themeClass: 'theme-arctic' },
  { id: 'ocean', name: 'Ocean Depths (Shark)', unlockWins: 50, themeClass: 'theme-ocean' },
  { id: 'jungle', name: 'Dense Jungle (Tiger)', unlockWins: 75, themeClass: 'theme-jungle' },
  { id: 'desert', name: 'Desert Oasis (Scorpion)', unlockWins: 105, themeClass: 'theme-desert' },
  { id: 'volcano', name: 'Volcanic Dragon', unlockWins: 140, themeClass: 'theme-volcano' },
  { id: 'celestial', name: 'Celestial Temple (Golden Eagle)', unlockWins: 200, themeClass: 'theme-celestial' }
];

// ==========================================================
// 3. BOARD MATHEMATICAL MODEL (24 Nodes aligned with Board.jsx)
// ==========================================================
export const BOARD_CONNECTIONS = {
  // Vanjski kvadrat (0-7)
  0: [1, 7], 1: [0, 2, 9], 2: [1, 3],
  3: [2, 4, 11], 4: [3, 5], 5: [4, 6, 13],
  6: [5, 7], 7: [0, 6, 15],

  // Srednji kvadrat (8-15)
  8: [9, 15], 9: [1, 8, 10, 17], 10: [9, 11],
  11: [3, 10, 12, 19], 12: [11, 13], 13: [5, 12, 14, 21],
  14: [13, 15], 15: [7, 8, 14, 23],

  // Unutarnji kvadrat (16-23)
  16: [17, 23], 17: [9, 16, 18], 18: [17, 19],
  19: [11, 18, 20], 20: [19, 21], 21: [13, 20, 22],
  22: [21, 23], 23: [15, 16, 22]
};