import { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import type { Clima, Formalidad, LookGuardado, Outfit, Prenda } from '../types';

const COLECCION = 'looks';

/** Suscripción en tiempo real a los looks guardados del usuario */
export function useLooks(uid: string | undefined) {
  const [looks, setLooks] = useState<LookGuardado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setLooks([]);
      setLoading(false);
      return;
    }
    const q = query(collection(db, COLECCION), where('uid', '==', uid));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as LookGuardado);
      items.sort((a, b) => b.creadoEn - a.creadoEn);
      setLooks(items);
      setLoading(false);
    });
    return unsub;
  }, [uid]);

  return { looks, loading };
}

export async function guardarLook(uid: string, outfit: Outfit, clima: Clima, formalidad: Formalidad) {
  await addDoc(collection(db, COLECCION), {
    uid,
    prendaIds: outfit.prendas.map((p) => p.id),
    clima,
    formalidad,
    creadoEn: Date.now(),
  });
}

export async function eliminarLook(look: LookGuardado) {
  await deleteDoc(doc(db, COLECCION, look.id));
}

/** Reconstruye los objetos Prenda completos de un look a partir del armario actual */
export function prendasDeLook(look: LookGuardado, prendas: Prenda[]): Prenda[] {
  return look.prendaIds
    .map((id) => prendas.find((p) => p.id === id))
    .filter((p): p is Prenda => p !== undefined);
}
