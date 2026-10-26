// src/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quickMatch } from './services/multiplayer';
import {
  getCategories,
  addCategory,
  deleteCategory,
  getItemsByCategory,
  addItemToCategory,
  deleteItem,
  seedDefaultCategories,
  updateCategory,
  updateItem
} from './categoryService';
import {
  getStoredAchievements,
  saveStoredAchievements,
  ACHIEVEMENT_TIERS,
  fetchAchievementsFromFirebase,
  saveAchievementToFirebase,
  deleteAchievementFromFirebase
} from './achievementsData';
import { db } from './firebase';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';

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
  { code: 'UZ', name: 'Uzbekistan', flag: 'UZ' },
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
  losses: 0,
  prilagodba: null
};

export default function AdminPanel() {
  const navigate = useNavigate();

  const [isSearchingMatch, setIsSearchingMatch] = useState(false);



  // Editiranje bodovanja - LOGIKA
  const DEFAULT_SCORING_RULES = [
    { id: 'rule-win', icon: '🏆', title: 'Pobjeda', value: '+12 Bodova' },
    { id: 'rule-loss', icon: '❌', title: 'Poraz', value: '-6 Bodova' },
    { id: 'rule-mill', icon: '🎯', title: 'Mlin bonus', value: '+1 Bod po mlinu (Max +4 po meču)' },
    { id: 'rule-dom', icon: '👑', title: 'Dominantna pobjeda (6+ figura)', value: '+3 Boda' },
    { id: 'rule-streak', icon: '🔥', title: 'Niz pobjeda (3+ pobjede u nizu)', value: '+3 Boda' },
    { id: 'rule-prot', icon: '🛡️', title: 'Zaštita', value: 'Bodovi ne mogu pasti ispod 0' }
  ];

  const [scoringRules, setScoringRules] = useState(() => {
    const saved = localStorage.getItem('mlin_scoring_rules');
    return saved ? JSON.parse(saved) : DEFAULT_SCORING_RULES;
  });

  const [newRuleIcon, setNewRuleIcon] = useState('⭐');
  const [newRuleTitle, setNewRuleTitle] = useState('');
  const [newRuleValue, setNewRuleValue] = useState('');
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [editRuleTitle, setEditRuleTitle] = useState('');
  const [editRuleValue, setEditRuleValue] = useState('');
  const [editRuleIcon, setEditRuleIcon] = useState('');

  const saveRulesToStorage = (rules) => {
    setScoringRules(rules);
    localStorage.setItem('mlin_scoring_rules', JSON.stringify(rules));
  };

  const handleResetScoringRules = () => {
    saveRulesToStorage(DEFAULT_SCORING_RULES);
  };

  const handleAddRule = (e) => {
    e.preventDefault();
    if (!newRuleTitle.trim() || !newRuleValue.trim()) return;
    const newRule = {
      id: 'rule-' + Date.now(),
      icon: newRuleIcon || '⭐',
      title: newRuleTitle.trim(),
      value: newRuleValue.trim()
    };
    saveRulesToStorage([...scoringRules, newRule]);
    setNewRuleTitle('');
    setNewRuleValue('');
  };

  const handleDeleteRule = (id) => {
    const updated = scoringRules.filter(r => r.id !== id);
    saveRulesToStorage(updated);
  };

  const handleStartEditRule = (rule) => {
    setEditingRuleId(rule.id);
    setEditRuleIcon(rule.icon);
    setEditRuleTitle(rule.title);
    setEditRuleValue(rule.value);
  };

  const handleSaveEditRule = (id) => {
    const updated = scoringRules.map(r => {
      if (r.id === id) {
        return { ...r, icon: editRuleIcon, title: editRuleTitle, value: editRuleValue };
      }
      return r;
    });
    saveRulesToStorage(updated);
    setEditingRuleId(null);
  };

  // --- STANJA ZA KATEGORIJE (1:N) ---
  // Mapa koja drži stavke za svaku kategoriju { [catId]: [items...] }
  const [allItemsMap, setAllItemsMap] = useState({});

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryItems, setCategoryItems] = useState([]);

  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newItemLabel, setNewItemLabel] = useState('');
  const [newItemValue, setNewItemValue] = useState('');

  // Stanja za uređivanje kategorije
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatDesc, setEditCatDesc] = useState('');

  // Stanja za uređivanje stavke
  const [editingItemId, setEditingItemId] = useState(null);
  const [editItemLabel, setEditItemLabel] = useState('');
  const [editItemValue, setEditItemValue] = useState('');

  // Način sortiranja kategorija: 'created' (kako su stvarane) ili 'alpha' (abecedno A-Z)
  const [categorySortBy, setCategorySortBy] = useState('created');

  // --- EFEKTI ZA DOHVAT KATEGORIJA I STAVKI (1:N) ---
  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
    if (data.length > 0 && !selectedCategory) {
      setSelectedCategory(data[0]);
    }

    // Povuci stavke za svaku kategoriju u pozadini
    const map = {};
    for (const cat of data) {
      const items = await getItemsByCategory(cat.id);
      map[cat.id] = items;
    }
    setAllItemsMap(map);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const loadItems = async (catId) => {
    const items = await getItemsByCategory(catId);
    setCategoryItems(items);
  };

  useEffect(() => {
    if (selectedCategory) {
      loadItems(selectedCategory.id);
    } else {
      setCategoryItems([]);
    }
  }, [selectedCategory]);


  // --- FUNKCIJE ZA UPRAVLJANJE KATEGORIJAMA ---
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await addCategory({ name: newCatName, description: newCatDesc });
    setNewCatName('');
    setNewCatDesc('');
    await loadCategories();
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemLabel.trim() || !selectedCategory) return;
    await addItemToCategory(selectedCategory.id, {
      label: newItemLabel,
      value: newItemValue
    });
    setNewItemLabel('');
    setNewItemValue('');
    await loadItems(selectedCategory.id);
  };

  const handleDeleteCategory = async (id) => {
    await deleteCategory(id);
    setSelectedCategory(null);
    await loadCategories();
  };

  const handleDeleteItem = async (itemId) => {
    await deleteItem(selectedCategory.id, itemId);
    await loadItems(selectedCategory.id);
  };

  const handleSeedDefaults = async () => {
    if (window.confirm("Želite li generirati zadane kategorije i stavke?")) {
      await seedDefaultCategories();
      await loadCategories();
    }
  };

  // --- UREĐIVANJE KATEGORIJE ---
  const handleStartEditCategory = (e, cat) => {
    e.stopPropagation();
    setEditingCategoryId(cat.id);
    setEditCatName(cat.name);
    setEditCatDesc(cat.description || '');
  };

  const handleSaveEditCategory = async (e, catId) => {
    e.stopPropagation();
    if (!editCatName.trim()) return;
    await updateCategory(catId, { name: editCatName, description: editCatDesc });
    setEditingCategoryId(null);
    await loadCategories();
    if (selectedCategory?.id === catId) {
      setSelectedCategory(prev => ({ ...prev, name: editCatName, description: editCatDesc }));
    }
  };

  // Sortiranje kategorija
  const sortedCategories = [...categories].sort((a, b) => {
    if (categorySortBy === 'alpha') {
      return (a.name || '').localeCompare(b.name || '', 'hr', { sensitivity: 'base' });
    }
    // Zadano: po vremenu stvaranja (od najstarijih prema najnovijima ili po createdAt)
    return (a.createdAt || 0) - (b.createdAt || 0);
  });

  // --- UREĐIVANJE STAVKE ---
  const handleStartEditItem = (e, item) => {
    e.stopPropagation();
    setEditingItemId(item.id);
    setEditItemLabel(item.label);
    setEditItemValue(item.value || '');
  };

  const handleSaveEditItem = async (e, itemId) => {
    e.stopPropagation();
    if (!editItemLabel.trim() || !selectedCategory) return;
    await updateItem(selectedCategory.id, itemId, { label: editItemLabel, value: editItemValue });
    setEditingItemId(null);
    await loadItems(selectedCategory.id);
  };

  const [profiles, setProfiles] = useState(() => {
    const saved = localStorage.getItem('mlin_admin_profiles');
    return saved ? JSON.parse(saved) : [DEFAULT_IVICA];
  });

  // Stanja za Postignuća (Firebase)
  const [achievementsList, setAchievementsList] = useState([]);
  const [achSearch, setAchSearch] = useState('');
  const [achTierFilter, setAchTierFilter] = useState('ALL');
  const [loadingAch, setLoadingAch] = useState(false);

  // Učitavanje 100 postignuća s Firebasea pri otvaranju Admin Panela
  useEffect(() => {
    const loadAchs = async () => {
      setLoadingAch(true);
      try {
        const data = await fetchAchievementsFromFirebase();
        setAchievementsList(data);
      } catch (err) {
        console.error("Greška pri učitavanju postignuća:", err);
      } finally {
        setLoadingAch(false);
      }
    };
    loadAchs();
  }, []);

  // Forma za novo postignuće
  const [newAchData, setNewAchData] = useState({
    title: '',
    desc: '',
    icon: '🏅',
    tier: 'BRONZE',
    points: 10
  });

  // 1:N Profili igrača (povezano na pravo stanje profiles)
  const [selectedProfileId, setSelectedProfileId] = useState(() => {
    return (profiles && profiles.length > 0) ? (profiles[0].id || profiles[0].name) : '';
  });

  const currentSelectedProfile = (profiles || []).find(
    p => (p.id || p.name) === selectedProfileId
  ) || (profiles && profiles.length > 0 ? profiles[0] : null);

  const handleSelectAchievementProfile = (id) => {
    setSelectedProfileId(id);
  };

  // Dodavanje novog postignuća (ide izravno na Firebase)
  const handleAddNewAchievement = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newAchData.title.trim()) return;

    const newId = `ach_${Date.now()}`;
    const item = {
      id: newId,
      title: newAchData.title.trim(),
      desc: newAchData.desc.trim(),
      icon: newAchData.icon || '🏅',
      tier: newAchData.tier || 'BRONZE',
      points: Number(newAchData.points) || 10
    };

    const updated = [item, ...achievementsList];
    setAchievementsList(updated);
    await saveAchievementToFirebase(item);
    setNewAchData({ title: '', desc: '', icon: '🏅', tier: 'BRONZE', points: 10 });
  };

  // Trajno brisanje s Firebasea
  const handleDeleteAch = async (id) => {
    if (!window.confirm('Sigurno želiš trajno obrisati ovo postignuće s Firebasea?')) return;
    setAchievementsList(prev => prev.filter(a => a.id !== id));
    await deleteAchievementFromFirebase(id);
  };

  // 1:N Dodjela / Oduzimanje značke odabranom profilu
  const handleToggleAchievementForUser = async (achId) => {
    if (!currentSelectedProfile) return;

    const currentProfileKey = currentSelectedProfile.id || currentSelectedProfile.name;
    const currentAchs = Array.isArray(currentSelectedProfile.achievements)
      ? [...currentSelectedProfile.achievements]
      : [];

    // Dodaj ako nema, makni ako već ima
    let updatedAchs = [];
    if (currentAchs.includes(achId)) {
      updatedAchs = currentAchs.filter(id => id !== achId);
    } else {
      updatedAchs = [...currentAchs, achId];
    }

    // 1. Ažuriraj stanje `profiles` u Admin Panelu
    const updatedProfiles = profiles.map(p => {
      const pKey = p.id || p.name;
      if (pKey === currentProfileKey) {
        return { ...p, achievements: updatedAchs };
      }
      return p;
    });

    setProfiles(updatedProfiles);
    localStorage.setItem('mlin_admin_profiles', JSON.stringify(updatedProfiles));

    // 2. Ažuriraj trenutno aktivni profil za igru (`mlin_user_profile`)
    const activeRaw = localStorage.getItem('mlin_user_profile');
    if (activeRaw) {
      try {
        const parsedActive = JSON.parse(activeRaw);
        // Ako je ažurirani igrač onaj koji je trenutno prijavljen u igri:
        if (
          parsedActive.id === currentSelectedProfile.id ||
          parsedActive.name === currentSelectedProfile.name
        ) {
          const updatedActive = { ...parsedActive, achievements: updatedAchs };
          localStorage.setItem('mlin_user_profile', JSON.stringify(updatedActive));
          // Emitiraj događaj da ostale komponente (glavni meni / profil) odmah saznaju za promjenu
          window.dispatchEvent(new Event('storage'));
        }
      } catch (err) {
        console.warn("Greška pri ažuriranju mlin_user_profile:", err);
      }
    }

    // 3. Ako profil ima Firestore ID, ažuriraj i u Firebaseu
    if (currentSelectedProfile.id && db) {
      try {
        await updateDoc(doc(db, 'profiles', currentSelectedProfile.id), {
          achievements: updatedAchs
        });
      } catch (err) {
        // Lokalni profil (nema Firestore dokument), mirno nastavi
      }
    }
  };

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

    // Uzmi najnovije stanje tog igrača iz niza profiles (gdje su dodijeljene značke)
    const freshPlayer = profiles.find(p => (p.id || p.name) === (player.id || player.name)) || player;

    const activeProfile = {
      id: freshPlayer.id || ('player-' + Date.now()),
      name: freshPlayer.name,
      avatar: freshPlayer.avatar,
      bio: freshPlayer.bio || 'Spreman za igru!',
      country: freshPlayer.country || 'HR',
      points: freshPlayer.points || 0,
      wins: freshPlayer.wins || 0,
      losses: freshPlayer.losses || 0,
      matchHistory: freshPlayer.matchHistory || [],
      prilagodba: freshPlayer.prilagodba || {},
      achievements: Array.isArray(freshPlayer.achievements) ? freshPlayer.achievements : [] // 👈 OVDJE ČUVAMO ZNAČKE
    };

    localStorage.setItem('mlin_user_profile', JSON.stringify(activeProfile));
    navigate('/');
  };

  const handleSetSinglePrilagodba = (profileId, catId, itemVal) => {
    const targetCat = categories.find(c => c.id === catId);

    const updated = profiles.map(p => {
      if (p.id === profileId) {
        if (!catId) {
          return { ...p, prilagodba: null };
        }
        return {
          ...p,
          prilagodba: {
            kategorijaId: catId,
            kategorijaNaziv: targetCat ? targetCat.name : '',
            stavka: itemVal || ''
          }
        };
      }
      return p;
    });

    setProfiles(updated);
    localStorage.setItem('mlin_admin_profiles', JSON.stringify(updated));

    // Ažuriraj i aktivni profil ako je trenutno odabran
    const active = localStorage.getItem('mlin_user_profile');
    if (active) {
      const parsed = JSON.parse(active);
      const target = updated.find(p => p.id === profileId);
      if (target && (parsed.name === target.name || profileId === 'admin-ivica')) {
        localStorage.setItem('mlin_user_profile', JSON.stringify({
          ...parsed,
          prilagodba: target.prilagodba
        }));
      }
    }
  };

  // --- ONLINE TRAŽENJE MEČA (Ispravno zatvorena funkcija) ---
  const handleStartOnlineMatch = (selectedProfile = null) => {
    setIsSearchingMatch(true);

    const profileToUse = selectedProfile || JSON.parse(localStorage.getItem('mlin_user_profile')) || {
      name: name.trim() || 'Igrač',
      country: country || 'HR',
      avatar: avatar || '🦊'
    };

    quickMatch(
      profileToUse,
      (gameId, myColor) => {
        setIsSearchingMatch(false);
        sessionStorage.setItem('mlin_my_color', myColor);
        navigate(`/game/${gameId}`);
      },
      (gameId) => {
        console.log("Čekamo protivnika u sobi:", gameId);
      }
    );
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

  // 1. Isključivo kreira ili ažurira profil i ostaje u Admin panelu
  const handleCreateProfileOnly = (e) => {
    if (e) e.preventDefault();
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
    } else {
      const newProfile = {
        id: 'player-' + Date.now(),
        name: name.trim(),
        avatar,
        bio: bio.trim() || 'Spreman za igru!',
        country: finalCountry,
        points: 0,
        wins: 0,
        losses: 0,
        prilagodba: null,
        achievements: []
      };

      const updated = [...profiles, newProfile];
      setProfiles(updated);
      localStorage.setItem('mlin_admin_profiles', JSON.stringify(updated));
    }

    handleCancelEdit();
  };

  // 2. Isključivo pokreće igru s unesenim/postojećim profilom
  const handlePlayDirectly = (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;

    const existing = profiles.find(p => p.name.toLowerCase() === name.trim().toLowerCase());

    if (existing) {
      handleSelectProfile(existing);
    } else {
      const tempProfile = {
        name: name.trim(),
        avatar,
        bio: bio.trim() || 'Spreman za igru!',
        country: country.trim().toUpperCase() || 'HR',
        points: 0,
        wins: 0,
        losses: 0
      };
      handleSelectProfile(tempProfile);
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
        <form onSubmit={handleCreateProfileOnly} style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '10px', marginBottom: '28px', border: editingId ? '1px solid #f59e0b' : '1px solid #334155' }}>
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
                    padding: '8px 10px 8px 38px',
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

            <div style={{
              gridColumn: '1 / -1',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '24px',
              marginTop: '10px'
            }}>
              {editingId ? (
                <button
                  type="submit"
                  style={{
                    minWidth: '180px',
                    padding: '11px 20px',
                    backgroundColor: '#f59e0b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
                  }}
                >
                  <span>💾</span>
                  <span>Spremi izmjene</span>
                </button>
              ) : (
                <button
                  type="submit"
                  style={{
                    minWidth: '180px',
                    padding: '11px 20px',
                    backgroundColor: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)'
                  }}
                >
                  <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>➕</span>
                  <span>Kreiraj profil</span>
                </button>
              )}

              {editingId ? (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  style={{
                    minWidth: '140px',
                    padding: '11px 18px',
                    backgroundColor: '#64748b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  Odustani
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePlayDirectly}
                  style={{
                    minWidth: '160px',
                    padding: '11px 20px',
                    backgroundColor: '#16a34a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)'
                  }}
                >
                  <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>🎮</span>
                  <span>Igraj</span>
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
                alignItems: 'stretch',
                justifyContent: 'space-between',
                gap: '12px',
                padding: '14px',
                backgroundColor: isSelected
                  ? '#450a0a'
                  : isBeingEdited
                    ? '#292524'
                    : (isIvica ? '#1e3a5f' : '#1e293b'),
                borderRadius: '10px',
                border: isSelected
                  ? '1px solid #ef4444'
                  : isBeingEdited
                    ? '1px solid #f59e0b'
                    : (isIvica ? '1px solid #38bdf8' : '1px solid #334155'),
                cursor: (isDeleteMode && isIvica) ? 'default' : 'pointer',
                opacity: (isDeleteMode && isIvica) ? 0.6 : 1,
                userSelect: 'none',
                boxSizing: 'border-box',
                minHeight: '135px'
              }}
            >
              {isDeleteMode && !isIvica && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
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
                </div>
              )}

              {/* LIJEVA STRANA: Avatar */}
              <div style={{ display: 'flex', alignItems: 'flex-start', paddingTop: '2px' }}>
                <span style={{ fontSize: '2.2rem', lineHeight: 1 }}>{p.avatar}</span>
              </div>

              {/* SREDINA: Podaci o igraču i prilagodba (fleksibilno, ne gura dugmad) */}
              <div style={{ flex: 1, minWidth: 0, textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }} title={p.name}>
                      {p.name}
                    </span>
                    <CountryFlag code={p.country} size="20x15" />
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>({p.country})</span>
                    {isIvica && (
                      <span style={{ fontSize: '0.65rem', color: '#38bdf8', border: '1px solid #38bdf8', padding: '1px 4px', borderRadius: '4px', fontWeight: 'bold' }}>
                        ADMIN
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#cbd5e1', fontStyle: 'italic', margin: '3px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={p.bio}>
                    "{p.bio}"
                  </div>

                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    {p.points || 0} bodova | {p.wins || 0}W - {p.losses || 0}L
                  </div>
                </div>

                {/* PRILAGODBA: Kompaktno i stabilno */}
                {categories.length > 0 && !isDeleteMode && (
                  <div
                    style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #334155' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#fbbf24', fontWeight: 'bold' }}>🎯 Prilagodba:</span>
                      {p.prilagodba && (
                        <button
                          type="button"
                          title="Ukloni prilagodbu"
                          onClick={() => handleSetSinglePrilagodba(p.id, null, null)}
                          style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.65rem', padding: 0 }}
                        >
                          ✕ Ukloni
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '4px' }}>
                      {/* 1. Izbor kategorije */}
                      <select
                        value={p.prilagodba?.kategorijaId || ''}
                        onChange={(e) => {
                          const catId = e.target.value;
                          if (catId) {
                            handleSetSinglePrilagodba(p.id, catId, '');
                          } else {
                            handleSetSinglePrilagodba(p.id, null, null);
                          }
                        }}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          backgroundColor: '#0f172a',
                          color: '#fff',
                          border: '1px solid #475569',
                          borderRadius: '4px',
                          fontSize: '0.68rem',
                          padding: '3px 2px'
                        }}
                      >
                        <option value="">-- Bez --</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>

                      {/* 2. Izbor stavke */}
                      {p.prilagodba?.kategorijaId && (
                        <select
                          value={p.prilagodba?.stavka || ''}
                          onChange={(e) => handleSetSinglePrilagodba(p.id, p.prilagodba.kategorijaId, e.target.value)}
                          style={{
                            flex: 1,
                            minWidth: 0,
                            backgroundColor: '#0f172a',
                            color: '#10b981',
                            border: '1px solid #10b981',
                            borderRadius: '4px',
                            fontSize: '0.68rem',
                            padding: '3px 2px'
                          }}
                        >
                          <option value="">-- Odaberi --</option>
                          {(allItemsMap[p.prilagodba.kategorijaId] || []).map(it => (
                            <option key={it.id} value={it.label}>{it.label}</option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* ZELENI AKTIVNI BEDŽ */}
                    {p.prilagodba?.stavka && (
                      <div style={{
                        marginTop: '6px',
                        fontSize: '0.72rem',
                        lineHeight: '1.35',
                        color: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.12)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        display: 'block',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word'
                      }}>
                        Aktivno: <strong style={{ color: '#34d399' }}>{p.prilagodba.kategorijaNaziv}</strong> ➜ {p.prilagodba.stavka}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* DESNA STRANA: Fiksni stupac za dugmad (iste dimenzije, nikad ne bježe) */}
              {!isDeleteMode && (
                <div style={{
                  width: '84px',
                  minWidth: '84px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '6px'
                }}>
                  {/* Dugme Igraj */}
                  <button
                    type="button"
                    onClick={() => handleSelectProfile(p)}
                    style={{
                      width: '100%',
                      height: '30px',
                      backgroundColor: '#2563eb',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxSizing: 'border-box'
                    }}
                  >
                    Igraj
                  </button>

                  {/* Dugme Online */}
                  <button
                    type="button"
                    title="Pronađi online protivnika"
                    disabled={isSearchingMatch}
                    onClick={() => handleStartOnlineMatch(p)}
                    style={{
                      width: '100%',
                      height: '30px',
                      backgroundColor: isSearchingMatch ? '#475569' : '#8b5cf6',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: isSearchingMatch ? 'not-allowed' : 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '3px',
                      boxSizing: 'border-box'
                    }}
                  >
                    {isSearchingMatch ? '⏳ Tražim' : '⚡ Online'}
                  </button>

                  {/* Dugme Uredi */}
                  <button
                    type="button"
                    title="Uredi profil"
                    onClick={(e) => handleStartEdit(e, p)}
                    style={{
                      width: '100%',
                      height: '30px',
                      backgroundColor: '#334155',
                      color: '#fbbf24',
                      border: '1px solid #475569',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '3px',
                      boxSizing: 'border-box'
                    }}
                  >
                    ✏️ Uredi
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ========================================================== */}
      {/* 👇 NOVA SEKCIJA: UPRAVLJANJE POSTIGNUĆIMA (1:N VEZA)       */}
      {/* ========================================================== */}
      <div style={{ marginTop: '40px', padding: '24px', background: '#0f172a', borderRadius: '12px', border: '1px solid #334155' }}>

        {/* ZAGLAVLJE S 1:N IZBOROM IGRAČA */}
        <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', border: '1px solid #475569', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ color: '#fbbf24', margin: 0, fontSize: '1.2rem' }}>🏅 Upravljanje Postignućima i Dodjela Igračima (1:N)</h2>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '4px' }}>
                Katalog: <strong style={{ color: '#38bdf8' }}>{achievementsList.length}</strong> postignuća u bazi
              </div>
            </div>

            {/* PADAJUĆI IZBORNIK: ODABERI IGRAČA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#0f172a', padding: '8px 12px', borderRadius: '6px', border: '1px solid #334155' }}>
              <span style={{ color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 'bold' }}>👤 Odaberi profil:</span>
              <select
                value={selectedProfileId}
                onChange={(e) => handleSelectAchievementProfile(e.target.value)}
                style={{
                  background: '#1e293b',
                  color: '#fbbf24',
                  border: '1px solid #475569',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {profiles && profiles.map(p => {
                  const val = p.id || p.name;
                  return (
                    <option key={val} value={val}>
                      {p.name || 'Neimenovani igrač'}
                    </option>
                  );
                })}
              </select>

              {currentSelectedProfile && (
                <span style={{ color: '#4ade80', fontSize: '0.8rem', fontWeight: 'bold', marginLeft: '6px' }}>
                  Značke: {(currentSelectedProfile.achievements || []).length} / {achievementsList.length}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* FORMA ZA UNOS NOVOG POSTIGNUĆA */}
        <form onSubmit={handleAddNewAchievement} style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', border: '1px solid #475569', marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#e2e8f0', fontSize: '0.95rem' }}>➕ Stvori novo postignuće (odmah ide na Firebase)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '60px 2fr 3fr 130px 90px auto', gap: '10px', alignItems: 'center' }}>
            <div>
              <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Ikona</label>
              <input
                type="text"
                value={newAchData.icon}
                onChange={(e) => setNewAchData({ ...newAchData, icon: e.target.value })}
                style={{ width: '100%', padding: '6px', textAlign: 'center', fontSize: '1.2rem', background: '#0f172a', color: '#fff', border: '1px solid #475569', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Naziv</label>
              <input
                type="text"
                placeholder="npr. Snajper..."
                value={newAchData.title}
                onChange={(e) => setNewAchData({ ...newAchData, title: e.target.value })}
                style={{ width: '100%', padding: '6px 8px', background: '#0f172a', color: '#fff', border: '1px solid #475569', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Opis uvjeta</label>
              <input
                type="text"
                placeholder="Kako se osvaja..."
                value={newAchData.desc}
                onChange={(e) => setNewAchData({ ...newAchData, desc: e.target.value })}
                style={{ width: '100%', padding: '6px 8px', background: '#0f172a', color: '#fff', border: '1px solid #475569', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Razina (Tier)</label>
              <select
                value={newAchData.tier}
                onChange={(e) => setNewAchData({ ...newAchData, tier: e.target.value })}
                style={{ width: '100%', padding: '6px', background: '#0f172a', color: '#fff', border: '1px solid #475569', borderRadius: '4px' }}
              >
                {Object.keys(ACHIEVEMENT_TIERS).map(k => (
                  <option key={k} value={k}>{ACHIEVEMENT_TIERS[k].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Bodovi</label>
              <input
                type="number"
                value={newAchData.points}
                onChange={(e) => setNewAchData({ ...newAchData, points: e.target.value })}
                style={{ width: '100%', padding: '6px', background: '#0f172a', color: '#fff', border: '1px solid #475569', borderRadius: '4px' }}
              />
            </div>
            <div style={{ alignSelf: 'flex-end' }}>
              <button
                type="submit"
                style={{ padding: '8px 14px', background: '#10b981', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                + Dodaj
              </button>
            </div>
          </div>
        </form>

        {/* PRETRAGA I FILTERI */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="🔍 Pretraži po nazivu ili opisu..."
            value={achSearch}
            onChange={(e) => setAchSearch(e.target.value)}
            style={{ flex: 1, minWidth: '220px', padding: '8px 12px', background: '#1e293b', color: '#fff', border: '1px solid #475569', borderRadius: '6px' }}
          />

          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {['ALL', ...Object.keys(ACHIEVEMENT_TIERS)].map(key => (
              <button
                key={key}
                type="button"
                onClick={() => setAchTierFilter(key)}
                style={{
                  padding: '5px 10px',
                  fontSize: '0.75rem',
                  borderRadius: '4px',
                  border: '1px solid #334155',
                  background: achTierFilter === key ? '#3b82f6' : '#1e293b',
                  color: achTierFilter === key ? '#fff' : '#94a3b8',
                  cursor: 'pointer'
                }}
              >
                {key === 'ALL' ? 'Sve' : ACHIEVEMENT_TIERS[key].label}
              </button>
            ))}
          </div>
        </div>

        {/* 1:N POPIS POSTIGNUĆA I DODJELA NA PROFIL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '450px', overflowY: 'auto', paddingRight: '4px' }}>
          {achievementsList
            .filter(a => {
              const matchesTier = achTierFilter === 'ALL' || a.tier === achTierFilter;
              const matchesSearch = a.title?.toLowerCase().includes(achSearch.toLowerCase()) ||
                a.desc?.toLowerCase().includes(achSearch.toLowerCase());
              return matchesTier && matchesSearch;
            })
            .map((ach) => {
              const userAchs = Array.isArray(currentSelectedProfile?.achievements) ? currentSelectedProfile.achievements : [];
              const isAssigned = userAchs.includes(ach.id);
              const tierData = ACHIEVEMENT_TIERS[ach.tier] || ACHIEVEMENT_TIERS.BRONZE;

              return (
                <div
                  key={ach.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: isAssigned ? 'rgba(34, 197, 94, 0.08)' : '#1e293b',
                    borderTop: isAssigned ? '1px solid #22c55e' : '1px solid #334155',
                    borderRight: isAssigned ? '1px solid #22c55e' : '1px solid #334155',
                    borderBottom: isAssigned ? '1px solid #22c55e' : '1px solid #334155',
                    borderLeft: `5px solid ${tierData.border}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.4rem', minWidth: '32px', textAlign: 'center' }}>{ach.icon || '🏅'}</span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{ach.title}</strong>
                        <span style={{ fontSize: '0.65rem', padding: '1px 5px', borderRadius: '3px', background: tierData.border, color: '#000', fontWeight: 'bold' }}>
                          {tierData.label}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 'bold' }}>+{ach.points} B</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{ach.desc}</div>
                    </div>
                  </div>

                  {/* 1:N KONTROLE: DODIJELI / ODUZMI + BRISANJE */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleToggleAchievementForUser(ach.id)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        background: isAssigned ? '#ef4444' : '#22c55e',
                        color: '#ffffff',
                        transition: 'background 0.2s'
                      }}
                    >
                      {isAssigned ? '✖ Oduzmi igraču' : '✔ Dodijeli igraču'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteAch(ach.id)}
                      title="Trajno obriši s Firebasea"
                      style={{
                        background: 'transparent',
                        border: '1px solid #475569',
                        color: '#94a3b8',
                        borderRadius: '4px',
                        padding: '4px 6px',
                        cursor: 'pointer',
                        fontSize: '0.75rem'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

      </div>
      {/* 👆 KRAJ NOVE SEKCIJE */}

      {/* SEKCIJA: UPRAVLJANJE SUSTAVOM BODOVANJA */}
      <div style={{ marginTop: '30px', padding: '20px', background: '#0f172a', borderRadius: '12px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ color: '#fbbf24', margin: 0, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⚖️ Upravljanje Sustavom Bodovanja
          </h2>
          <button
            type="button"
            onClick={handleResetScoringRules}
            style={{ background: '#334155', color: '#94a3b8', border: '1px solid #475569', borderRadius: '6px', padding: '6px 12px', fontSize: '0.75rem', cursor: 'pointer' }}
          >
            🔄 Vrati na zadano
          </button>
        </div>

        {/* Forma za dodavanje novog pravila bodovanja */}
        <form onSubmit={handleAddRule} style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Ikona"
            value={newRuleIcon}
            onChange={(e) => setNewRuleIcon(e.target.value)}
            style={{ width: '60px', padding: '8px', borderRadius: '6px', background: '#1e293b', color: '#fff', border: '1px solid #475569', textAlign: 'center' }}
          />
          <input
            type="text"
            placeholder="Naziv pravila (npr. Pobjeda)..."
            value={newRuleTitle}
            onChange={(e) => setNewRuleTitle(e.target.value)}
            style={{ flex: 2, minWidth: '150px', padding: '8px', borderRadius: '6px', background: '#1e293b', color: '#fff', border: '1px solid #475569' }}
          />
          <input
            type="text"
            placeholder="Vrijednost (npr. +10 Bodova)..."
            value={newRuleValue}
            onChange={(e) => setNewRuleValue(e.target.value)}
            style={{ flex: 2, minWidth: '180px', padding: '8px', borderRadius: '6px', background: '#1e293b', color: '#fff', border: '1px solid #475569' }}
          />
          <button
            type="submit"
            style={{ padding: '8px 16px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            + Dodaj pravilo
          </button>
        </form>

        {/* Popis pravila s opcijom uređivanja i brisanja */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {scoringRules.map((rule) => {
            const isEditing = editingRuleId === rule.id;

            return (
              <div
                key={rule.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: '#1e293b',
                  borderRadius: '6px',
                  border: isEditing ? '1px solid #fbbf24' : '1px solid #334155',
                  gap: '8px'
                }}
              >
                {isEditing ? (
                  <div style={{ display: 'flex', gap: '8px', width: '100%', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={editRuleIcon}
                      onChange={(e) => setEditRuleIcon(e.target.value)}
                      style={{ width: '50px', padding: '6px', borderRadius: '4px', background: '#0f172a', color: '#fff', border: '1px solid #fbbf24', textAlign: 'center' }}
                    />
                    <input
                      type="text"
                      value={editRuleTitle}
                      onChange={(e) => setEditRuleTitle(e.target.value)}
                      style={{ flex: 1, padding: '6px', borderRadius: '4px', background: '#0f172a', color: '#fff', border: '1px solid #fbbf24' }}
                    />
                    <input
                      type="text"
                      value={editRuleValue}
                      onChange={(e) => setEditRuleValue(e.target.value)}
                      style={{ flex: 1.5, padding: '6px', borderRadius: '4px', background: '#0f172a', color: '#fff', border: '1px solid #fbbf24' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveEditRule(rule.id)}
                      style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 10px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      💾
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingRuleId(null)}
                      style={{ background: '#64748b', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 8px', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f8fafc' }}>
                      <span style={{ fontSize: '1.2rem' }}>{rule.icon}</span>
                      <span style={{ fontWeight: 'bold' }}>{rule.title}:</span>
                      <span style={{ color: '#94a3b8' }}>{rule.value}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        title="Uredi"
                        onClick={() => handleStartEditRule(rule)}
                        style={{ background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        title="Obriši"
                        onClick={() => handleDeleteRule(rule.id)}
                        style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        ✕
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}