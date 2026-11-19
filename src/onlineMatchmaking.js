// src/onlineMatchmaking.js
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  runTransaction,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

const QUEUE_COLLECTION = 'matchmaking_queue';
const GAMES_COLLECTION = 'games';

/**
 * Pokreće pretragu protivnika u Firestoreu uz postupno širenje raspona ranga.
 * Vraća cleanup funkciju za prekid slušanja i brisanje iz reda čekanja.
 */
export function startOnlineMatchmaking({
  user,
  playerName,
  points = 0,
  wins = 0,
  losses = 0,
  rankIndex = 0,
  onStatusChange,
  onMatchFound,
  onError
}) {
  if (!user || !user.uid) {
    onError?.('Korisnik nije prijavljen.');
    return () => {};
  }

  const myQueueRef = doc(db, QUEUE_COLLECTION, user.uid);
  let isCancelled = false;
  let hasMatched = false;
  let searchSeconds = 0;

  const getAllowedRankDiff = (elapsedSec) => {
    if (elapsedSec < 3) return 0;
    if (elapsedSec < 6) return 1;
    if (elapsedSec < 9) return 2;
    if (elapsedSec < 12) return 4;
    return 999;
  };

  const enterMatch = (gameId, color) => {
    if (hasMatched || isCancelled) return;
    hasMatched = true;
    clearInterval(timerInterval);
    clearInterval(matchLoopInterval);
    unsubscribeQueueDoc();
    sessionStorage.setItem('mlin_my_color', color);
    onMatchFound?.({ gameId, color });
  };

  // 1. Prati vlastiti dokument u čekaonici (ako nas drugi igrač spoji, dobijemo gameId ovdje)
  const unsubscribeQueueDoc = onSnapshot(
    myQueueRef,
    (snap) => {
      if (!snap.exists() || hasMatched || isCancelled) return;
      const data = snap.data();
      if (data.status === 'matched' && data.gameId && data.assignedColor) {
        enterMatch(data.gameId, data.assignedColor);
      }
    },
    (err) => {
      if (!isCancelled) onError?.(err.message);
    }
  );

  // 2. Pokušaj pronalaska i transakcijskog spajanja s protivnikom
  const tryFindOpponent = async () => {
    if (hasMatched || isCancelled) return;

    const allowedDiff = getAllowedRankDiff(searchSeconds);
    onStatusChange?.({
      seconds: searchSeconds,
      allowedDiff
    });

    try {
      const q = query(
        collection(db, QUEUE_COLLECTION),
        where('status', '==', 'searching')
      );
      const snapshot = await getDocs(q);

      const candidates = [];
      snapshot.forEach((docSnap) => {
        if (docSnap.id === user.uid) return;
        const d = docSnap.data();
        const oppRank = Number(d.rankIndex ?? 0);
        const diff = Math.abs(oppRank - Number(rankIndex ?? 0));
        if (diff <= allowedDiff) {
          candidates.push({
            id: docSnap.id,
            diff,
            createdAt: d.createdAt?.toMillis?.() || 0,
            data: d
          });
        }
      });

      if (candidates.length === 0) return;

      // Prioritet: najmanja razlika u rangu, zatim onaj tko dulje čeka
      candidates.sort((a, b) => {
        if (a.diff !== b.diff) return a.diff - b.diff;
        return a.createdAt - b.createdAt;
      });

      const target = candidates[0];
      const oppQueueRef = doc(db, QUEUE_COLLECTION, target.id);
      const newGameRef = doc(collection(db, GAMES_COLLECTION));

      const result = await runTransaction(db, async (transaction) => {
        const freshMe = await transaction.get(myQueueRef);
        const freshOpp = await transaction.get(oppQueueRef);

        if (!freshMe.exists() || !freshOpp.exists()) return null;
        if (freshMe.data().status !== 'searching') return null;
        if (freshOpp.data().status !== 'searching') return null;

        const iAmWhite = Math.random() < 0.5;
        const myColor = iAmWhite ? 'WHITE' : 'BLACK';
        const oppColor = iAmWhite ? 'BLACK' : 'WHITE';

        const mePayload = {
          uid: user.uid,
          name: playerName || 'Igrač',
          points: Number(points || 0),
          wins: Number(wins || 0),
          losses: Number(losses || 0)
        };

        const oppPayload = {
          uid: target.id,
          name: target.data.name || 'Protivnik',
          points: Number(target.data.points || 0),
          wins: Number(target.data.wins || 0),
          losses: Number(target.data.losses || 0)
        };

        const whitePlayer = iAmWhite ? mePayload : oppPayload;
        const blackPlayer = !iAmWhite ? mePayload : oppPayload;

        transaction.set(newGameRef, {
          board: Array(24).fill(null),
          currentTurn: 'WHITE',
          mustRemove: false,
          unplaced: { WHITE: 9, BLACK: 9 },
          winner: null,
          playerWhite: whitePlayer,
          playerBlack: blackPlayer,
          createdAt: serverTimestamp()
        });

        transaction.update(myQueueRef, {
          status: 'matched',
          gameId: newGameRef.id,
          assignedColor: myColor,
          matchedAt: serverTimestamp()
        });

        transaction.update(oppQueueRef, {
          status: 'matched',
          gameId: newGameRef.id,
          assignedColor: oppColor,
          matchedAt: serverTimestamp()
        });

        return { gameId: newGameRef.id, color: myColor };
      });

      if (result) {
        enterMatch(result.gameId, result.color);
      }
    } catch (err) {
      if (!isCancelled && !hasMatched) {
        console.error('Matchmaking error:', err);
      }
    }
  };

  // Upisujemo se u čekaonicu i odmah pokrećemo prvi krug pretrage
  (async () => {
    try {
      await setDoc(myQueueRef, {
        uid: user.uid,
        name: playerName || 'Igrač',
        points: Number(points || 0),
        wins: Number(wins || 0),
        losses: Number(losses || 0),
        rankIndex: Number(rankIndex || 0),
        status: 'searching',
        gameId: null,
        assignedColor: null,
        createdAt: serverTimestamp()
      });
      await tryFindOpponent();
    } catch (err) {
      if (!isCancelled) onError?.(err.message);
    }
  })();

  const timerInterval = setInterval(() => {
    if (!isCancelled && !hasMatched) {
      searchSeconds += 1;
      const allowedDiff = getAllowedRankDiff(searchSeconds);
      onStatusChange?.({
        seconds: searchSeconds,
        allowedDiff
      });
    }
  }, 1000);

  const matchLoopInterval = setInterval(() => {
    if (!isCancelled && !hasMatched) {
      tryFindOpponent();
    }
  }, 2000);

  return () => {
    isCancelled = true;
    clearInterval(timerInterval);
    clearInterval(matchLoopInterval);
    unsubscribeQueueDoc();
    if (!hasMatched) {
      deleteDoc(myQueueRef).catch(() => {});
    }
  };
}