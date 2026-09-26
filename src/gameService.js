import { db } from './firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';

/**
 * Učitava profil igrača prema imenu (ili stvara novi ako ne postoji)
 */
export async function getOrCreateProfile(playerName) {
  if (!playerName || !playerName.trim()) return null;
  const nameKey = playerName.trim();
  const playerRef = doc(db, 'players', nameKey);

  try {
    const docSnap = await getDoc(playerRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Novi profil s početnim rangom (1200 bodova je standard)
      const newPlayer = {
        name: nameKey,
        rankPoints: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        createdAt: serverTimestamp()
      };
      await setDoc(playerRef, newPlayer);
      return newPlayer;
    }
  } catch (error) {
    console.error("Greška pri dohvaćanju profila:", error);
    return null;
  }
}

/**
 * Ažurira bodove i statistiku pobjednika i gubitnika nakon meča
 */
export async function updateMatchResults(winnerName, loserName, isDraw = false, gameCategory = 'COMPETITIVE') {
  if (gameCategory !== 'COMPETITIVE' || !winnerName || !loserName) return;

  try {
    const winnerRef = doc(db, 'players', winnerName);
    const loserRef = doc(db, 'players', loserName);

    const [winnerSnap, loserSnap] = await Promise.all([
      getDoc(winnerRef),
      getDoc(loserRef)
    ]);

    if (!winnerSnap.exists() || !loserSnap.exists()) return;

    const winnerData = winnerSnap.data();
    const loserData = loserSnap.data();

    if (isDraw) {
      await setDoc(winnerRef, { draws: (winnerData.draws || 0) + 1 }, { merge: true });
      await setDoc(loserRef, { draws: (loserData.draws || 0) + 1 }, { merge: true });
      return;
    }

    // Dodijeli +25 bodova pobjedniku, oduzmi 20 gubitniku (minimalno 0 bodova)
    const newWinnerPoints = (winnerData.rankPoints || 0) + 12;
    const newLoserPoints = Math.max(0, (loserData.rankPoints || 0) - 6);

    await setDoc(winnerRef, {
      rankPoints: newWinnerPoints,
      wins: (winnerData.wins || 0) + 1
    }, { merge: true });

    await setDoc(loserRef, {
      rankPoints: newLoserPoints,
      losses: (loserData.losses || 0) + 1
    }, { merge: true });

  } catch (error) {
    console.error("Greška pri ažuriranju rezultata:", error);
  }
}

/**
 * Sprema odigrani meč u povijest mečeva u bazi
 */
export async function saveMatchHistory(matchData) {
  try {
    await addDoc(collection(db, 'matches'), {
      ...matchData,
      playedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Greška pri spremanju meča:", error);
  }
}

/**
 * Dohvaća top listu igrača po bodovima (Top 10)
 */
export async function getLeaderboard() {
  try {
    const q = query(collection(db, 'players'), orderBy('rankPoints', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);
    const leaderboard = [];
    querySnapshot.forEach((doc) => {
      leaderboard.push(doc.data());
    });
    return leaderboard;
  } catch (error) {
    console.error("Greška pri dohvaćanju ljestvice:", error);
    return [];
  }
}