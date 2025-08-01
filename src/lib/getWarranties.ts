//when i refresh my page this contents might dissapearr to stop it this code is there

import { db } from "@/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { auth } from "@/firebase";

export const getWarrantiesFromFirestore = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const q = query(
    collection(db, "warranties"),
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
