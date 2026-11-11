import {
  collection,
  query,
  where,
  limit,
  getDocs,
  addDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  runTransaction
} from "firebase/firestore";
import { db } from "../firebase";

// Maksimalno vrijeme čekanja protivnika u čekaonici (modern standard: ne čekamo zauvijek)
const WAITING_TIMEOUT_MS = 5 * 60 * 1000;

/**
 * Quick match: prvo pokušamo atomski zauzeti postojeću "waiting" sobu kao CRNI.
 * Ako nema slobodne sobe (ili je već zauzeta), kreiramo novu kao BIJELI i čekamo.
 * Sve callbacke (onFound/onWaiting) pozivamo isključivo jednom po uspješnom ishodu.
 */
export const quickMatch = async (userProfile, onFound, onWaiting) => {
  const gamesRef = collection(db, "games");
  const q = query(gamesRef, where("status", "==", "waiting"), limit(1));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const gameId = snapshot.docs[0].id;
    const ref = doc(db, "games", gameId);

    // Atomsko zauzimanje slobodne sobe (izbjegava race condition)
    try {
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists()) throw new Error("GONE");
        const data = snap.data();
        if (data.status !== "waiting" || data.playerBlack) throw new Error("GONE");
        // Soba je naša vlastita čekaonica -> ne možemo ući sami sebi
        if (data.playerWhite?.name === userProfile.name) throw new Error("OWN");
        tx.update(ref, {
          playerBlack: userProfile,
          status: "playing",
          startedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });
      // Uspješno se spojili kao CRNI
      onFound(gameId, "BLACK");
      return;
    } catch (err) {
      if (err.message === "OWN") {
        // Ova čekaonica je naša – nastavljamo čekati protivnika
        onWaiting(gameId);
        await subscribeToOpponentJoin(gameId, userProfile, onFound);
        return;
      }
      // Soba je nestala ili je upravo zauzeta od strane nekog drugog – kreiramo novu
      await createNewGame(userProfile, onFound, onWaiting);
      return;
    }
  }

  // Nema slobodnih soba -> kreiramo novu kao BIJELI
  await createNewGame(userProfile, onFound, onWaiting);
};

// Kreiranje nove sobe kao BIJELI + pretplaćenje na spoj protivnika
const createNewGame = async (userProfile, onFound, onWaiting) => {
  const newDoc = await addDoc(collection(db, "games"), {
    playerWhite: userProfile,
    playerBlack: null,
    status: "waiting",
    currentTurn: "WHITE",
    board: Array(24).fill(null),
    phase: "placing",
    whitePlaced: 0,
    blackPlaced: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  const gameId = newDoc.id;
  onWaiting(gameId);
  await subscribeToOpponentJoin(gameId, userProfile, onFound);
};

/**
 * Pretplata na Firestore dokument za trenutak kada se netko drugi spoji.
 * Modern standard:
 *  - automatski timeout ako se nitko ne spoji (čišćenje listenera),
 *  - poništavanje ako dokument nestane,
 *  - igrac koji je već prisutan se ignorira (bez samospaja).
 * Vraća Promise koji se riješi čim se igrač nađe ili timeout istekne.
 */
const subscribeToOpponentJoin = (gameId, userProfile, onFound) => {
  return new Promise((resolve) => {
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try { unsubscribe(); } catch (e) { /* ignore */ }
      resolve();
    };

    const timer = setTimeout(done, WAITING_TIMEOUT_MS);

    const unsubscribe = onSnapshot(
      doc(db, "games", gameId),
      (snap) => {
        const data = snap.exists() ? snap.data() : null;
        if (!data) { done(); return; }
        const opponent = data.playerBlack;
        if (
          data.status === "playing" &&
          opponent &&
          opponent.name !== userProfile.name
        ) {
          onFound(gameId, "WHITE");
          done();
        }
      },
      () => { done(); } // greška konekcije -> odustani od čekanja
    );
  });
};

/**
 * Napuštanje/istekla čekaonica – označimo sobu kao isteklu da je drugi igrač
 * može sigurno prebaciti. (Opcionalna pomoćna funkcija.)
 */
export const releaseWaitingRoom = async (gameId) => {
  try {
    await runTransaction(db, async (tx) => {
      const ref = doc(db, "games", gameId);
      const snap = await tx.get(ref);
      if (snap.exists() && snap.data().status === "waiting") {
        tx.update(ref, { status: "expired", updatedAt: serverTimestamp() });
      }
    });
  } catch (e) {
    console.warn("Ne mogu osloboditi čekaonicu:", e.message);
  }
};
