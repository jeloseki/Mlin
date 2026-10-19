// src/categoryService.js
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from './firebase';

const CATEGORIES_COLLECTION = 'game_categories';

// 1. Dohvaćanje svih kategorija (1)
export const getCategories = async () => {
  try {
    const snap = await getDocs(collection(db, CATEGORIES_COLLECTION));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Greška pri dohvaćanju kategorija:", error);
    return [];
  }
};

// 2. Dodavanje nove kategorije (1)
export const addCategory = async ({ name, description = '' }) => {
  try {
    return await addDoc(collection(db, CATEGORIES_COLLECTION), {
      name,
      description,
      createdAt: Date.now()
    });
  } catch (error) {
    console.error("Greška pri dodavanju kategorije:", error);
  }
};

// 3. Brisanje kategorije
export const deleteCategory = async (categoryId) => {
  try {
    return await deleteDoc(doc(db, CATEGORIES_COLLECTION, categoryId));
  } catch (error) {
    console.error("Greška pri brisanju kategorije:", error);
  }
};

// 4. Dohvaćanje stavki unutar odabrane kategorije (N)
export const getItemsByCategory = async (categoryId) => {
  if (!categoryId) return [];
  try {
    const itemsRef = collection(db, CATEGORIES_COLLECTION, categoryId, 'items');
    const snap = await getDocs(itemsRef);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Greška pri dohvaćanju stavki kategorije:", error);
    return [];
  }
};

// 5. Dodavanje stavke u odabranu kategoriju (N)
export const addItemToCategory = async (categoryId, itemData) => {
  try {
    const itemsRef = collection(db, CATEGORIES_COLLECTION, categoryId, 'items');
    return await addDoc(itemsRef, {
      ...itemData,
      createdAt: Date.now()
    });
  } catch (error) {
    console.error("Greška pri dodavanju stavke:", error);
  }
};

// 6. Brisanje pojedinačne stavke iz kategorije
export const deleteItem = async (categoryId, itemId) => {
  try {
    return await deleteDoc(doc(db, CATEGORIES_COLLECTION, categoryId, 'items', itemId));
  } catch (error) {
    console.error("Greška pri brisanju stavke:", error);
  }
};

// 7. Inicijalizacija zadanih kategorija i podstavki (Seed 1:N podataka)
export const seedDefaultCategories = async () => {
  const defaultData = [
    {
      name: 'Vremenski Modovi',
      description: 'Format trajanja poteza i partije',
      items: [
        { label: 'Classic standard', value: '300s' },
        { label: 'Rapid meč', value: '120s' },
        { label: 'Blitz turnir', value: '45s' }
      ]
    },
    {
      name: 'Postignuća (Bedževi)',
      description: 'Zadaci i izazovi za igrače',
      items: [
        { label: 'Prvi Mlin', value: 'Složi 1 mlin u meču' },
        { label: 'Dvostruka Zamka', value: 'Otvori i zatvori 2 mlina' },
        { label: 'Kralj Ploče', value: 'Pobijedi s 7+ preostalih figura' }
      ]
    },
    {
      name: 'Kozmetički Paketi',
      description: 'Tematske skupine avatara i ikona',
      items: [
        { label: 'Životinjsko carstvo', value: '🦁, 🦊, 🦉, 🐱' },
        { label: 'Magični ratnici', value: '🧙‍♂️, ⚔️, 🛡️, 👑' },
        { label: 'Sci-Fi / Roboti', value: '🤖, 🚀, ⚡, 👾' }
      ]
    }
  ];

  for (const cat of defaultData) {
    const catRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
      name: cat.name,
      description: cat.description,
      createdAt: Date.now()
    });

    const itemsRef = collection(db, CATEGORIES_COLLECTION, catRef.id, 'items');
    for (const item of cat.items) {
      await addDoc(itemsRef, {
        ...item,
        createdAt: Date.now()
      });
    }
  }
};