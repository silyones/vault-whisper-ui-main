import { db } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth } from "@/firebase";

export const addWarrantyToFirestore = async (warranty: any) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const docRef = await addDoc(collection(db, "warranties"), {
    ...warranty,
    userId: user.uid,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};
