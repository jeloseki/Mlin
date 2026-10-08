import { 
  collection, 
  query, 
  where, 
  limit, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase";

export const quickMatch = async (userProfile, onFound, onWaiting) => {
  const gamesRef = collection(db, "games");

  // Tražimo sobu koja čeka igrača
  const q = query(gamesRef, where("status", "==", "waiting"), limit(1));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    // 1. Postoji otvorena igra -> ulazimo kao CRNI (BLACK)
    const gameDoc = snapshot.docs[0];
    const gameId = gameDoc.id;
    const gameData = gameDoc.data();

    // Ako smo slučajno mi sami otvorili tu sobu ranije, samo čekamo
    if (gameData.playerWhite?.name === userProfile.name) {
      onWaiting(gameId);
      return;
    }

    await updateDoc(doc(db, "games", gameId), {
      playerBlack: userProfile,
      status: "playing",
      startedAt: serverTimestamp()
    });

    onFound(gameId, "BLACK");
  } else {
    // 2. Nema otvorenih igara -> kreiramo novu kao BIJELI (WHITE)
    const newDoc = await addDoc(gamesRef, {
      playerWhite: userProfile,
      playerBlack: null,
      status: "waiting",
      currentTurn: "WHITE",
      board: Array(24).fill(null),
      phase: "placing",
      whitePlaced: 0,
      blackPlaced: 0,
      createdAt: serverTimestamp()
    });

    const gameId = newDoc.id;
    onWaiting(gameId);

    // Slušamo u Firestoreu trenutak kada se netko drugi spoji
    const unsubscribe = onSnapshot(doc(db, "games", gameId), (snap) => {
      const data = snap.data();
      if (data && data.status === "playing" && data.playerBlack) {
        unsubscribe();
        onFound(gameId, "WHITE");
      }
    });
  }
};