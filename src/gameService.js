// src/gameService.js
import { db } from './firebase';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  getCountFromServer,
  serverTimestamp
} from 'firebase/firestore';

/**
 * Učitava profil igrača prema imenu (ili stvara novi ako ne postoji)
 */
export async function getOrCreateProfile(playerName) {
  if (!playerName || !playerName.trim()) return null;
  const nameKey = playerName.trim();
  const playerRef = doc(db, 'profiles', nameKey.toLowerCase());

  try {
    const docSnap = await getDoc(playerRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      const newPlayer = {
        name: nameKey,
        points: 0,
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
 * Ažurira bodove i statistiku kod remija (podjela bodova)
 */
export async function recordDrawMatchResults(playerAName, playerBName, gameCategory = 'COMPETITIVE', drawPoints = 4) {
  if (gameCategory !== 'COMPETITIVE' || !playerAName || !playerBName) return;

  try {
    const refA = doc(db, 'profiles', String(playerAName).trim().toLowerCase());
    const refB = doc(db, 'profiles', String(playerBName).trim().toLowerCase());

    const [snapA, snapB] = await Promise.all([getDoc(refA), getDoc(refB)]);
    if (!snapA.exists() || !snapB.exists()) return;

    const dataA = snapA.data();
    const dataB = snapB.data();

    const ptsA = Number(dataA.rankPoints ?? dataA.points ?? 0) + Number(drawPoints);
    const ptsB = Number(dataB.rankPoints ?? dataB.points ?? 0) + Number(drawPoints);

    await Promise.all([
      setDoc(refA, {
        points: ptsA,
        rankPoints: ptsA,
        draws: Number(dataA.draws || 0) + 1
      }, { merge: true }),
      setDoc(refB, {
        points: ptsB,
        rankPoints: ptsB,
        draws: Number(dataB.draws || 0) + 1
      }, { merge: true })
    ]);
  } catch (error) {
    console.error("Greška pri ažuriranju remija:", error);
  }
}

/**
 * Ažurira bodove i statistiku pobjednika i gubitnika nakon meča
 */
export async function updateMatchResults(winnerName, loserName, isDraw = false, gameCategory = 'COMPETITIVE') {
  if (gameCategory !== 'COMPETITIVE' || !winnerName || !loserName) return;

  try {
    const winnerRef = doc(db, 'profiles', String(winnerName).trim().toLowerCase());
    const loserRef = doc(db, 'profiles', String(loserName).trim().toLowerCase());

    const [winnerSnap, loserSnap] = await Promise.all([
      getDoc(winnerRef),
      getDoc(loserRef)
    ]);

    if (!winnerSnap.exists() || !loserSnap.exists()) return;

    const winnerData = winnerSnap.data();
    const loserData = loserSnap.data();

    if (isDraw) {
      const drawPts = 4;
      const wPts = Number(winnerData.rankPoints ?? winnerData.points ?? 0) + drawPts;
      const lPts = Number(loserData.rankPoints ?? loserData.points ?? 0) + drawPts;
      await Promise.all([
        setDoc(winnerRef, { points: wPts, rankPoints: wPts, draws: Number(winnerData.draws || 0) + 1 }, { merge: true }),
        setDoc(loserRef, { points: lPts, rankPoints: lPts, draws: Number(loserData.draws || 0) + 1 }, { merge: true })
      ]);
      return;
    }

    // Dodijeli +12 bodova pobjedniku, oduzmi 6 gubitniku (minimalno 0 bodova)
    const currentWinnerPoints = Number(winnerData.rankPoints ?? winnerData.points ?? 0);
    const currentLoserPoints = Number(loserData.rankPoints ?? loserData.points ?? 0);

    const newWinnerPoints = currentWinnerPoints + 12;
    const newLoserPoints = Math.max(0, currentLoserPoints - 6);

    await setDoc(winnerRef, {
      points: newWinnerPoints,
      rankPoints: newWinnerPoints,
      wins: Number(winnerData.wins || 0) + 1
    }, { merge: true });

    await setDoc(loserRef, {
      points: newLoserPoints,
      rankPoints: newLoserPoints,
      losses: Number(loserData.losses || 0) + 1
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
 * Dohvaća top listu igrača po bodovima (Top 100)
 */
export async function getLeaderboard() {
  try {
    const q = query(
      collection(db, 'profiles'),
      orderBy('rankPoints', 'desc'),
      limit(100)
    );
    const querySnapshot = await getDocs(q);
    const leaderboard = [];
    querySnapshot.forEach((docSnap) => {
      leaderboard.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });
    return leaderboard;
  } catch (error) {
    console.error("Greška pri dohvaćanju ljestvice:", error);
    return [];
  }
}

/**
 * Izračunava točan trenutni rang igrača među svim korisnicima u kolekciji 'profiles'
 * Vraća { rank, totalPlayers } ili null pri grešci
 */
export async function getPlayerGlobalRank(points) {
  const safePoints = Number(points || 0);
  try {
    const profilesRef = collection(db, 'profiles');
    const aboveQuery = query(profilesRef, where('rankPoints', '>', safePoints));

    const [aboveSnap, totalSnap] = await Promise.all([
      getCountFromServer(aboveQuery),
      getCountFromServer(profilesRef)
    ]);

    return {
      rank: aboveSnap.data().count + 1,
      totalPlayers: totalSnap.data().count
    };
  } catch (error) {
    console.error("Greška pri izračunu globalnog ranga:", error);
    return null;
  }
}