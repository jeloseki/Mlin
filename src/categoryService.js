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

// 1. Fetching all categories (1)
export const getCategories = async () => {
  try {
    const snap = await getDocs(collection(db, CATEGORIES_COLLECTION));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// 2. Adding a new category (1)
export const addCategory = async ({ name, description = '' }) => {
  try {
    return await addDoc(collection(db, CATEGORIES_COLLECTION), {
      name,
      description,
      createdAt: Date.now()
    });
  } catch (error) {
    console.error("Error adding category:", error);
  }
};

// 3. Deleting a category
export const deleteCategory = async (categoryId) => {
  try {
    return await deleteDoc(doc(db, CATEGORIES_COLLECTION, categoryId));
  } catch (error) {
    console.error("Error deleting category:", error);
  }
};

// 4. Fetching items within the selected category (N)
export const getItemsByCategory = async (categoryId) => {
  if (!categoryId) return [];
  try {
    const itemsRef = collection(db, CATEGORIES_COLLECTION, categoryId, 'items');
    const snap = await getDocs(itemsRef);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error fetching category items:", error);
    return [];
  }
};

// 5. Adding an item to the selected category (N)
export const addItemToCategory = async (categoryId, itemData) => {
  try {
    const itemsRef = collection(db, CATEGORIES_COLLECTION, categoryId, 'items');
    return await addDoc(itemsRef, {
      ...itemData,
      createdAt: Date.now()
    });
  } catch (error) {
    console.error("Error adding item:", error);
  }
};

// 6. Deleting a single item from a category
export const deleteItem = async (categoryId, itemId) => {
  try {
    return await deleteDoc(doc(db, CATEGORIES_COLLECTION, categoryId, 'items', itemId));
  } catch (error) {
    console.error("Error deleting item:", error);
  }
};

// 7. Initializing default categories and sub-items (Seed 1:N data)
export const seedDefaultCategories = async () => {
  const defaultData = [
    {
      name: 'Time Modes',
      description: 'Move and game duration format',
      items: [
        { label: 'Classic standard', value: '300s' },
        { label: 'Rapid match', value: '120s' },
        { label: 'Blitz tournament', value: '45s' }
      ]
    },
    {
      name: 'Achievements (Badges)',
      description: 'Tasks and challenges for players',
      items: [
        { label: 'First Mill', value: 'Build 1 mill in a match' },
        { label: 'Double Trap', value: 'Open and close 2 mills' },
        { label: 'King of the Board', value: 'Win with 7+ remaining pieces' }
      ]
    },
    {
      name: 'Cosmetic Packs',
      description: 'Themed groups of avatars and icons',
      items: [
        { label: 'Animal kingdom', value: '🦁, 🦊, 🦉, 🐱' },
        { label: 'Magic warriors', value: '🧙‍♂️, ⚔️, 🛡️, 👑' },
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

// 8. Editing an existing category
export const updateCategory = async (categoryId, data) => {
  try {
    const catRef = doc(db, CATEGORIES_COLLECTION, categoryId);
    return await updateDoc(catRef, {
      ...data,
      updatedAt: Date.now()
    });
  } catch (error) {
    console.error("Error updating category:", error);
  }
};

// 9. Editing an existing item
export const updateItem = async (categoryId, itemId, data) => {
  try {
    const itemRef = doc(db, CATEGORIES_COLLECTION, categoryId, 'items', itemId);
    return await updateDoc(itemRef, {
      ...data,
      updatedAt: Date.now()
    });
  } catch (error) {
    console.error("Error updating item:", error);
  }
};